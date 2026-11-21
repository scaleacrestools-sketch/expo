#!/usr/bin/env node
/* Local preview server: serves dist/ with clean URLs and handles POST /api/lead,
 * storing every lead in ./leads/leads.jsonl (plus forwarding to CRM_WEBHOOK_URL if set). */
const http = require('http'); const fs = require('fs'); const path = require('path');
const { handleLead } = require('./api/lead-core');
const DIST = path.join(__dirname, 'dist'); const PORT = process.env.PORT || 4173;
const STORE = process.env.LEAD_STORE_DIR || path.join(__dirname, 'leads');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
const store = async lead => { fs.mkdirSync(STORE, { recursive: true }); fs.appendFileSync(path.join(STORE, 'leads.jsonl'), JSON.stringify(lead) + '\n'); };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/lead') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    let raw = ''; req.on('data', c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on('end', async () => {
      let body; try { body = JSON.parse(raw || '{}'); } catch { res.writeHead(400); return res.end('{"ok":false}'); }
      const out = await handleLead({ body, ip: req.socket.remoteAddress, origin: req.headers.origin || '', host: req.headers.host || '', store });
      res.writeHead(out.status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out.body));
    });
    return;
  }
  let p = decodeURIComponent(url.pathname); if (p.endsWith('/')) p += 'index.html';
  let file = path.join(DIST, p); if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) && fs.existsSync(file + '/index.html')) { res.writeHead(301, { Location: url.pathname + '/' }); return res.end(); }
  if (!fs.existsSync(file)) { file = path.join(DIST, '404.html'); res.statusCode = 404; }
  const stat = fs.statSync(file); const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range && type.startsWith('video')) {
    const [s, e] = range.replace('bytes=', '').split('-'); const start = +s; const end = e ? +e : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': type });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.setHeader('Content-Type', type); res.setHeader('Content-Length', stat.size); if (res.statusCode !== 404) res.statusCode = 200;
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Preview on http://localhost:${PORT}`));
