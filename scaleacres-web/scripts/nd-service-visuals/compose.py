# Composer for the homepage service visuals (public/images/nd/svc-*). Builds one HTML scene per
# service from genuine ScaleAcres work; render with shot.mjs (Playwright, 1600x900 @1.5x).
# S points at the high-res originals downloaded from the scaleacres.com media library.
import os
P='file:///home/user/expo/scaleacres-web/public/images/nd/'
S='file:///tmp/claude-0/-home-user-expo/769b79d7-5227-592b-b40b-8d6f12481340/scratchpad/svc/src/'
def p(n): return P+n
CSS='''
*{box-sizing:border-box;margin:0}
html,body{width:1600px;height:900px;overflow:hidden}
.stage{position:relative;width:1600px;height:900px;overflow:hidden}
.abs{position:absolute}
img{display:block}
.sh{box-shadow:0 2px 6px rgba(11,13,13,.07),0 26px 50px -22px rgba(11,13,13,.38),0 60px 110px -50px rgba(11,13,13,.30)}
.sh-s{box-shadow:0 1px 3px rgba(11,13,13,.08),0 18px 36px -18px rgba(11,13,13,.35)}
.laptop .scr{border:13px solid #121414;border-bottom-width:17px;border-radius:20px 20px 6px 6px;overflow:hidden;background:#000;aspect-ratio:16/10;position:relative}
.laptop .scr img{width:100%;height:100%;object-fit:cover;object-position:top}
.laptop .base{height:18px;margin:0 -6.5%;background:linear-gradient(180deg,#e6e8ec 0%,#c3c7ce 55%,#9ea3ab 100%);border-radius:2px 2px 16px 16px;position:relative}
.laptop .base:before{content:"";position:absolute;left:50%;top:0;width:15%;height:7px;transform:translateX(-50%);background:#b3b7be;border-radius:0 0 8px 8px}
.phone{border-radius:40px;border:9px solid #101212;background:#101212;overflow:hidden;aspect-ratio:9/19.3;position:absolute}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:31px}
.phone:after{content:"";position:absolute;top:10px;left:50%;width:30%;height:20px;transform:translateX(-50%);background:#101212;border-radius:12px}
.browser{border-radius:12px;overflow:hidden;background:#fff;position:absolute}
.browser .bar{height:30px;background:#f1f3f6;border-bottom:1px solid #e3e6eb;display:flex;align-items:center;gap:7px;padding:0 14px}
.browser .bar i{width:10px;height:10px;border-radius:50%;background:#d3d7de}
.browser .bar b{margin-left:18px;height:14px;width:34%;border-radius:7px;background:#e4e7ec}
.browser img{width:100%;display:block}
.card{border-radius:14px;overflow:hidden;background:#fff;position:absolute}
.card img{width:100%;display:block}
'''
def page(bg, body): return f'<!doctype html><html><head><style>{CSS}</style></head><body><div class="stage" style="background:{bg}">{body}</div></body></html>'
def laptop(x,y,w,src,pos='top'): return f'<div class="abs laptop" style="left:{x}px;top:{y}px;width:{w}px"><div class="scr sh"><img src="{src}" style="object-position:{pos}"></div><div class="base sh-s"></div></div>'
def phone(x,y,w,src,pos='top',rot=0): return f'<div class="phone sh" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg)"><img src="{src}" style="object-position:{pos}"></div>'
def browser(x,y,w,src,h=None,pos='top',cls='sh'):
    st=f'height:{h}px;object-fit:cover;object-position:{pos}' if h else ''
    return f'<div class="browser {cls}" style="left:{x}px;top:{y}px;width:{w}px"><div class="bar"><i></i><i></i><i></i><b></b></div><img src="{src}" style="{st}"></div>'
def card(x,y,w,src,h=None,pos='center',rot=0,r=14,cls='sh'):
    st=f'height:{h}px;object-fit:cover;object-position:{pos}' if h else ''
    return f'<div class="card {cls}" style="left:{x}px;top:{y}px;width:{w}px;border-radius:{r}px;transform:rotate({rot}deg)"><img src="{src}" style="{st}"></div>'
LIGHT='radial-gradient(120% 90% at 30% 10%,#ffffff 0%,#f4f6fa 55%,#e8ecf3 100%)'
MIST='radial-gradient(110% 90% at 70% 0%,#ffffff 0%,#f1f4f9 50%,#e3e8f1 100%)'
J={}
J['website-design-development']=page(LIGHT,
  browser(860,70,640,p('web-imperial-2400.webp'),h=400,cls='sh-s')+
  laptop(110,150,1040,p('web-sid-2400.webp'))+
  phone(1170,300,250,p('m-subata-720.webp')))
J['search-engine-optimization']=page(MIST,
  browser(90,80,1060,S+'seo-graphs.webp',h=600)+
  card(880,420,640,S+'seo-result.webp',r=12))
J['performance-marketing']=page(LIGHT,
  browser(70,120,880,S+'ads-search.webp',h=560)+
  card(890,70,640,S+'meta-result.webp',r=12)+
  card(1150,450,300,p('cr-trg-900.webp'),r=12))
J['branding-creative-design']=page('radial-gradient(120% 100% at 20% 0%,#ffffff 0%,#f2f3f6 55%,#e6e8ed 100%)',
  card(80,150,720,p('slide-2-924.webp'),r=8)+
  card(860,80,640,p('slide-1-924.webp'),r=8,cls='sh-s')+
  card(860,480,640,p('slide-3-924.webp'),r=8)+
  card(560,470,250,p('cr-sid-900.webp'),r=8,rot=-3))
J['social-media-marketing']=page(MIST,
  card(110,230,330,p('cr-jbbr-900.webp'),r=16,rot=-4)+
  phone(470,90,250,p('yt-hU-pHCMCKqo-405.webp'),pos='center')+
  phone(675,50,280,p('yt-MdluDjATzgA-540.webp'),pos='center')+
  phone(905,90,250,p('yt-tdXNax-PUNQ-405.webp'),pos='center')+
  card(1170,230,330,p('cr-intech-900.webp'),r=16,rot=4))
def reel(x,y,w,src,big=False):
    play='<div style="position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:rgba(255,255,255,.95);display:grid;place-items:center;box-shadow:0 10px 30px rgba(0,0,0,.35)"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#0b0d0d"/></svg></div>' if big else ''
    return f'<div class="card sh" style="left:{x}px;top:{y}px;width:{w}px;aspect-ratio:9/16;border-radius:14px;background:#000"><img src="{src}" style="width:100%;height:100%;object-fit:cover">{play}</div>'
J['video-creative-production']=page('radial-gradient(90% 80% at 50% 30%,#1b2020 0%,#0e1111 60%,#0b0d0d 100%)',
  reel(80,215,240,p('yt-vgsUylyADPY-540.webp'))+
  reel(350,150,280,p('yt-fRnzr1dSYMg-540.webp'))+
  reel(660,80,320,p('yt-vODoeG2QEKQ-540.webp'),big=True)+
  reel(1010,150,280,p('yt-Z1ez2sINaao-540.webp'))+
  reel(1320,215,240,p('yt-0NmdVrMelSQ-540.webp')))
J['ecommerce-solutions']=page(LIGHT,
  laptop(130,150,1060,p('web-mwb-2400.webp'))+
  phone(1210,230,270,p('m-mwb-720.webp')))
J['custom-applications-software']=page(MIST,
  laptop(130,150,1060,p('web-finsckool-2400.webp'))+
  phone(1210,230,270,p('m-finsckool-720.webp')))
os.makedirs('html',exist_ok=True)
for k,v in J.items(): open(f'html/{k}.html','w').write(v)
print(list(J))
