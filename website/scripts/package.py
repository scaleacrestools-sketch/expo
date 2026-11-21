#!/usr/bin/env python3
"""Creates the delivery ZIPs in ../deliverables/ (run from website/ after `node build.js`):
  assetz-netlify-ready.zip        production build (dist/) inside folder assetz-netlify-ready/
  assetz-website-source.zip       editable source (no dist, node_modules, leads, secrets)
  assetz-hero-video-assets.zip    web videos + posters, FFmpeg edit project, EDLs, source footage, masters
  assetz-editable-svg.zip         editable-svg-assets/
"""
import os, sys, zipfile, fnmatch
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(ROOT), 'deliverables')
os.makedirs(OUT, exist_ok=True)
STORE = ('.mp4', '.webm', '.webp', '.jpg', '.png', '.pdf', '.woff2', '.zip')

def add_tree(z, src, arc, exclude=()):
    n = 0
    for d, dirs, files in os.walk(src):
        rel_d = os.path.relpath(d, src)
        dirs[:] = sorted(x for x in dirs if not any(fnmatch.fnmatch(os.path.normpath(os.path.join(rel_d, x)), e) for e in exclude))
        for f in sorted(files):
            rel = os.path.normpath(os.path.join(rel_d, f))
            if any(fnmatch.fnmatch(rel, e) or fnmatch.fnmatch(f, e) for e in exclude): continue
            p = os.path.join(d, f)
            z.write(p, os.path.join(arc, rel), compress_type=zipfile.ZIP_STORED if f.lower().endswith(STORE) else zipfile.ZIP_DEFLATED)
            n += 1
    return n

def make(name, items):
    path = os.path.join(OUT, name)
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        n = sum(add_tree(z, *it) if os.path.isdir(it[0]) else (z.write(it[0], it[1]) or 1) for it in items)
    print(f'{name}: {n} files, {os.path.getsize(path)/1048576:.1f} MB')

dist = os.path.join(ROOT, 'dist')
if not os.path.exists(os.path.join(dist, 'index.html')): sys.exit('Run `node build.js` first.')

make('assetz-netlify-ready.zip', [(dist, 'assetz-netlify-ready', ())])

make('assetz-website-source.zip', [(ROOT, 'assetz-website-source', (
    'dist', 'node_modules', 'leads', 'qa-shots', 'preview', '.git', '*.log', '.env', '.env.*', '.DS_Store',
    'video-project/source-footage', 'video-project/work', 'video-project/masters', 'video-project/web',
    'assetz-site-walkthrough.mp4', '__pycache__'))])

vp = os.path.join(ROOT, 'video-project')
make('assetz-hero-video-assets.zip', [
    (os.path.join(ROOT, 'assets/video'), 'assetz-hero-video-assets/web-ready', ()),
    (vp, 'assetz-hero-video-assets/edit-project', ('work', 'web', '.gitignore', 'README.md')),
    (os.path.join(vp, 'README.md'), 'assetz-hero-video-assets/README.md'),
])

make('assetz-editable-svg.zip', [(os.path.join(ROOT, 'editable-svg-assets'), 'assetz-editable-svg', ())])
