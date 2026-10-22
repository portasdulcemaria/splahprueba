import base64
def d(p,m): return 'data:%s;base64,'%m+base64.b64encode(open(p,'rb').read()).decode()
LOOP='M615 40 C615 120 590 200 505 205 C450 208 420 170 390 130 C355 80 310 55 255 58 C180 62 125 120 125 190 C125 260 180 310 250 310 C290 310 320 295 345 270'
ISO='<svg class="iso" viewBox="0 0 700 400" aria-hidden="true"><g fill="none" stroke-width="58"><path stroke="#34C08A" d="%s"/><g transform="rotate(180 350 200)"><path stroke="#1F2C6B" d="%s"/></g></g></svg>'%(LOOP,LOOP)
t=open('src/tpl.html').read()
R={'%%HBDEFS%%':open('src/hb_defs.html').read(),'%%APP%%':open('src/app.html').read(),'%%ISO%%':ISO,'%%JS%%':open('src/main.js').read(),'%%LOOP%%':LOOP,
   '%%VIDEO%%':d('assets/slow.mp4','video/mp4'),'%%HBIG%%':d('assets/hb_big.png','image/png'),'%%PHOTO%%':d('assets/base2.jpg','image/jpeg'),'%%ETAPA4%%':d('assets/etapa4.jpg','image/jpeg'),'%%POSTER%%':d('assets/base2.jpg','image/jpeg'),'%%DEPTH%%':'',
   '%%LW_S%%':d('assets/logo0.png','image/png'),'%%LW_W%%':d('assets/logo1.png','image/png'),'%%LC_S%%':d('assets/logo2.png','image/png'),'%%LC_W%%':d('assets/logo3.png','image/png')}
for _ in range(2):
    for k,v in R.items(): t=t.replace(k,v)
assert '%%' not in t.replace('100%%','') , [l for l in t.split('%%')][:3]
open('index.html','w').write(t);print(len(t)//1024,'KB')
