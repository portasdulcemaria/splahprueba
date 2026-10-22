/* ════════════════════════════════════════════════════════════════
   ANIDA · Landing v2 · Vanilla JS + GSAP 3 + ScrollTrigger + Lenis
   1 Hero inmersivo (foto + profundidad, la cámara entra a la laptop y la pantalla se vuelve la app)
   2 Cómo funciona en horizontal · 3 Partículas que se ordenan en el isologo · 4 Logo que se teje
   5 Simulador · 6 Chat · 7 Hornero que vuela
   ════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))},lerp=function(a,b,t){return a+(b-a)*t};
var sm=function(t){return t*t*(3-2*t)},io=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},eo=function(t){return 1-Math.pow(1-t,3)};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover: hover) and (pointer: fine)').matches;
var gsap=window.gsap,ST=window.ScrollTrigger,root=document.documentElement;
var GO=!!(gsap&&ST)&&!RM;
var LOOP='M615 40 C615 120 590 200 505 205 C450 208 420 170 390 130 C355 80 310 55 255 58 C180 62 125 120 125 190 C125 260 180 310 250 310 C290 310 320 295 345 270';
var lenis=null;
/* imágenes repetidas: se cargan una vez y se copian */
(function(){var m={photo:$('himg').poster,iso:document.querySelector('.logo .c img').src,word:document.querySelector('.logo .c img+img').src};$$('img[data-src]').forEach(function(i){i.src=m[i.getAttribute('data-src')]})})();

if(GO){
  gsap.registerPlugin(ST);
  if(window.Lenis){lenis=new Lenis({lerp:.09,wheelMultiplier:.9,anchors:{offset:-70}});lenis.on('scroll',ST.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
}
function scrollToEl(el){var y=el.getBoundingClientRect().top+scrollY;lenis?lenis.scrollTo(y,{duration:1.4}):scrollTo({top:y,behavior:RM?'auto':'smooth'})}

/* ── Nav: transparente sobre la foto, claro después ── */
var nav=$('nav'),hero=$('hero'),HP={p:0};
function navTick(){var r=hero.getBoundingClientRect();nav.classList.toggle('solid',r.bottom<80)}
addEventListener('scroll',navTick,{passive:true});navTick();

/* ── Apariciones suaves ── */
var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ob.unobserve(e.target)}})},{threshold:.18});
$$('.rv').forEach(function(el){ob.observe(el)});

/* ════════ 1 · HERO ════════
   La pantalla de la laptop muestra la app de Anida desde el primer cuadro. Al scrollear, la cámara entra
   hasta que esa misma pantalla ocupa la vista; lo que la rodea se desenfoca, como foco de cámara. */
(function(){
  var frame=$('frame'),img=$('himg'),cv=$('heroGL'),copy=$('hcopy'),scr=$('scr'),app=$('app'),shade=$('shade'),hint=$('hint'),legal=$('hlegal');
  var SCR={u0:.4684,u1:.5502,v0:.5951,v1:.6875},LAP=[(SCR.u0+SCR.u1)/2,(SCR.v0+SCR.v1)/2];
  var W=0,H=0,dpr=1,I=1376/768,draw=null,dL=0.1,DEPTH=.016,LOOK=[.03,.018];
  var S=window.anidaHero={state:{p:0,mx:0,my:0,intro:0},lenis:lenis};var st=S.state;
  function resize(){W=frame.clientWidth;H=frame.clientHeight;dpr=Math.min(devicePixelRatio||1,1.75);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  addEventListener('resize',resize);resize();
  function cam(t){
    var A=W/H,base=Math.min(1,A/I),k=io(clamp(st.p/.9,0,1));
    var sw=Math.min(W*.9,H*.82*1.525)/W,zE=base*sw/(SCR.u1-SCR.u0)/1,zS=1.04;           // al final, la pantalla ocupa ~90% del ancho
    zE=base/((SCR.u1-SCR.u0)/sw);
    zS*=1+.06*st.intro;                                                                 // zoom lento de entrada, como Mercury
    var z=zS*Math.pow(zE/zS,k),calm=1-k;
    var lx=0,ly=0;                                                                       // sin mirada con el mouse: la escena queda quieta
    var sx=base/z,sy=Math.min(1,I/A)/z;
    var cx=lerp(.5,LAP[0],k)+lx*LOOK[0]*calm,cy=lerp(.46,LAP[1]-sy*.045,k)+ly*LOOK[1]*calm;   // al final la pantalla queda centrada debajo del nav
    cx=sx>=1?.5:clamp(cx,sx/2,1-sx/2);cy=sy>=1?.5:clamp(cy,sy/2,1-sy/2);
    return {cx:cx,cy:cy,sx:sx,sy:sy,lx:lx,ly:ly,k:k,z:z}
  }
  function proj(c,u,v){var lu=c.lx*DEPTH/I,lv=c.ly*DEPTH;return [((u-c.cx-lu*dL)/c.sx+.5)*W,((v-c.cy-lv*dL)/c.sy+.5)*H]}
  function place(c){
    var a=proj(c,SCR.u0,SCR.v0),b=proj(c,SCR.u1,SCR.v1),w=b[0]-a[0],h=b[1]-a[1];
    scr.style.left=a[0]+'px';scr.style.top=a[1]+'px';scr.style.width=w+'px';scr.style.height=h+'px';
    app.style.transform='scale('+(w/1180).toFixed(5)+')';scr.style.setProperty('--gl',Math.max(0,1-c.k*2.2).toFixed(3));var ed=document.querySelector('.edge');if(ed)ed.style.opacity=Math.max(0,1-c.k*2.5).toFixed(3);
  }
  if(!GO){hero.style.height='100vh';hero.style.height='100svh';
    var c0={cx:.5,cy:.5,sx:1,sy:1,lx:0,ly:0,k:0};
    function fit(){W=frame.clientWidth;H=frame.clientHeight;var A=W/H,iw=A>I?W:H*I,ih=iw/I,ox=(W-iw)/2,oy=(H-ih)/2;
      scr.style.left=ox+SCR.u0*iw+'px';scr.style.top=oy+SCR.v0*ih+'px';scr.style.width=(SCR.u1-SCR.u0)*iw+'px';scr.style.height=(SCR.v1-SCR.v0)*ih+'px';app.style.transform='scale('+((SCR.u1-SCR.u0)*iw/1180)+')';scr.style.opacity=1}
    addEventListener('resize',fit);fit();return}
  gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom bottom',scrub:lenis?.6:1.1}});
  gsap.to(st,{intro:1,duration:16,ease:'power1.out'});
  var visible=true,introT=null;ST.create({trigger:hero,start:'top bottom',end:'bottom top',onToggle:function(s){visible=s.isActive;try{s.isActive?img.play():img.pause()}catch(e){}}});
  /* al volver al hero, se repite la entrada: zoom lento y titular que sube */
  ST.create({trigger:hero,start:'top top',end:'15% top',onEnterBack:function(){
    if(introT)introT.kill();st.intro=0;introT=gsap.to(st,{intro:1,duration:10,ease:'power1.out'});
    $$('.hcopy h1 .ln>span').forEach(function(s){s.style.animation='none';void s.offsetWidth;s.style.animation=''});
    $$('.hcopy p,.hcopy .qform').forEach(function(s){s.style.animation='none';void s.offsetWidth;s.style.animation=''})}});
  var lastBlur=-1;
  gsap.ticker.add(function(t){
    if(!visible)return;var p=st.p;HP.p=p;navTick();
    var co=1-clamp(p/.14,0,1);
    copy.style.opacity=co;copy.style.visibility=co<.02?'hidden':'visible';copy.style.transform='translate3d(0,'+(-p*160).toFixed(1)+'px,0)';
    hint.style.opacity=legal.style.opacity=co;shade.style.opacity=co;
    var c=cam(t);
    if(draw){draw(c);var bl=Math.round(clamp((c.z-1.8)*1.6,0,18));if(bl!==lastBlur){lastBlur=bl;cv.style.filter='saturate(.82) contrast(.94) brightness('+(.94-bl*.01).toFixed(3)+')'+(bl?' blur('+bl+'px)':'')}}
    else{var z=c.z,ox=LAP[0]*100+'% '+LAP[1]*100+'%';img.style.transformOrigin=ox;img.style.transform='scale('+z.toFixed(3)+')';var hp=$('hphoto');hp.style.transformOrigin=ox;hp.style.transform=img.style.transform;img.style.filter='saturate(1.02) contrast(1.04) blur('+clamp((z-1.8)*1.6,0,18)+'px)';hp.style.filter=img.style.filter}
    if(draw)place(c);
    else{var iw=W>H*I?W:H*I,ih=iw/I,zz=c.z,px=LAP[0],py=LAP[1],x0=(W-iw)/2,y0=(H-ih)/2,cxp=x0+px*iw,cyp=y0+py*ih;
      scr.style.left=cxp+(x0+SCR.u0*iw-cxp)*zz+'px';scr.style.top=cyp+(y0+SCR.v0*ih-cyp)*zz+'px';var w=(SCR.u1-SCR.u0)*iw*zz;scr.style.width=w+'px';scr.style.height=(SCR.v1-SCR.v0)*ih*zz+'px';app.style.transform='scale('+(w/1180)+')';scr.style.setProperty('--gl',Math.max(0,1-c.k*2.2).toFixed(3));var ed=document.querySelector('.edge');if(ed)ed.style.opacity=Math.max(0,1-c.k*2.5).toFixed(3)}
    scr.style.opacity=1;
    /* luz de la lámpara: sigue la escena al hacer zoom */
    var iw2=W>H*I?W:H*I,ih2=iw2/I,x02=(W-iw2)/2,y02=(H-ih2)/2,cx2=x02+LAP[0]*iw2,cy2=y02+LAP[1]*ih2,z2=c.z;
    function S(u,v){return [cx2+(x02+u*iw2-cx2)*z2,cy2+(y02+v*ih2-cy2)*z2]}
    var lc=S(.624,.692),lw=iw2*.2*z2,lh=lw*.42,lv=Math.max(LIGHT.tod,LIGHT.typed)*(1-c.k),hd=S(.6035,.566),bi=lamp.firstChild;
    lamp.style.width=lw+'px';lamp.style.height=lh+'px';lamp.style.transform='translate3d('+(lc[0]-lw/2).toFixed(1)+'px,'+(lc[1]-lh/2).toFixed(1)+'px,0)';
    if(bi){var bs=iw2*.035*z2;bi.style.width=bi.style.height=bs+'px';bi.style.left=(hd[0]-lc[0]+lw/2-bs/2).toFixed(1)+'px';bi.style.top=(hd[1]-lc[1]+lh/2-bs/2).toFixed(1)+'px'}lamp.style.opacity=lv.toFixed(3);
    tod.style.opacity=(1-c.k).toFixed(3);
    if(WN.length){var ww=Math.max(2,iw2*.0034*z2),wh=ww*1.3;WN.forEach(function(w){var q=S(w.u,w.v);w.el.style.width=ww+'px';w.el.style.height=wh+'px';w.el.style.transform='translate3d('+(q[0]-ww/2).toFixed(1)+'px,'+(q[1]-wh/2).toFixed(1)+'px,0)'});wins.style.opacity=(1-c.k).toFixed(3)}
    scr.style.boxShadow=LIGHT.typed>0?'0 0 '+(40*LIGHT.typed*z2).toFixed(0)+'px '+(8*LIGHT.typed*z2).toFixed(0)+'px rgba(190,215,255,'+(.35*LIGHT.typed*(1-c.k)).toFixed(3)+')':'';
  });
  /* 2 · el cielo y la luz siguen la hora real de Buenos Aires */
  var lamp=$('hlamp'),tod=$('htod'),LIGHT={tod:0,typed:0,tw:{v:0}};
  (function(){var h=new Date().getHours(),bg='',l=0;
    if(h>=20||h<6){bg='linear-gradient(180deg,rgba(28,38,92,.78),rgba(40,46,90,.55) 45%,rgba(30,34,70,.5))';l=1}
    else if(h<10){bg='linear-gradient(180deg,rgba(215,228,255,.9),rgba(245,240,230,.95))';l=0}
    else if(h<17){bg='linear-gradient(180deg,rgba(225,235,255,.92),rgba(250,248,240,1))';l=0}
    else{bg='';l=.35}
    tod.style.background=bg;LIGHT.tod=l;root.setAttribute('data-tod',h>=20||h<6?'noche':h<17?'dia':'tarde')})();
  /* 1 · la escena responde a tu CUIL: con cada número se enciende la lámpara y la pantalla gana luz */
  /* de noche, algunas ventanas de la ciudad se encienden de a una (un detalle, no todas) */
  var wins=$('hwins'),WN=[];
  if(LIGHT.tod===1){[[1167,270],[1185,290],[1175,320],[1195,350],[1035,260],[1050,300],[1030,330],[1220,325],[1240,350],[1330,295],[1340,325],[1130,340],[60,300],[110,350]].forEach(function(p,i){
    var el=document.createElement('i');wins.appendChild(el);var w={u:p[0]/1376,v:p[1]/768,el:el};WN.push(w);
    setTimeout(function on(){el.style.opacity=(.55+Math.random()*.45).toFixed(2);setTimeout(function(){if(Math.random()<.35){el.style.opacity=0;setTimeout(on,4000+Math.random()*9000)}},9000+Math.random()*14000)},1500+i*900+Math.random()*2500)})}
  var q1=$('q1');if(q1)q1.addEventListener('input',function(){var n=(q1.value.replace(/\D/g,'')).length;$('hbox').classList.toggle('ready',n>=11);gsap.to(LIGHT,{typed:Math.min(1,n/11),duration:.8,ease:'power2.out'})});
  /* foto + mapa de profundidad en WebGL (desplazamiento leve: sin deformar) */
  function initGL(photo,depth){
    var gl=cv.getContext('webgl',{antialias:false,alpha:false});if(!gl)return null;
    var VS='attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;v.y=1.-v.y;gl_Position=vec4(a,0.,1.);}';
    var FS='precision mediump float;varying vec2 v;uniform sampler2D tI,tD;uniform vec2 uC,uS,uL;'+
      'void main(){vec2 st=uC+(v-.5)*uS;float d=texture2D(tD,st).r-.45;st+=uL*d;gl_FragColor=vec4(texture2D(tI,st).rgb,1.);}';
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
    var vs=sh(gl.VERTEX_SHADER,VS),fs=sh(gl.FRAGMENT_SHADER,FS);if(!vs||!fs)return null;
    var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var l=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
    function tex(u,im){gl.activeTexture(gl.TEXTURE0+u);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
      [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});
      [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE)});
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im)}
    tex(0,photo);tex(1,depth);
    var U={};['tI','tD','uC','uS','uL'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});gl.uniform1i(U.tI,0);gl.uniform1i(U.tD,1);
    return function(c){gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U.uC,c.cx,c.cy);gl.uniform2f(U.uS,c.sx,c.sy);gl.uniform2f(U.uL,c.lx*DEPTH/I,c.ly*DEPTH);gl.drawArrays(gl.TRIANGLES,0,3)}
  }
  var photo=new Image(),depth=new Image(),n=0;
  function ready(){if(++n<2)return;I=photo.naturalWidth/photo.naturalHeight;
    try{var tc=document.createElement('canvas');tc.width=depth.naturalWidth;tc.height=depth.naturalHeight;var x=tc.getContext('2d');x.drawImage(depth,0,0);
      dL=x.getImageData(Math.round(LAP[0]*tc.width),Math.round(LAP[1]*tc.height),1,1).data[0]/255-.45}catch(e){}
    try{draw=initGL(photo,depth)}catch(e){draw=null}if(draw)root.classList.add('gl-on')}
  /* video: sin WebGL, el zoom se hace sobre el <video> */ try{img.playbackRate=1;var pp=img.play();pp&&pp.catch(function(){})}catch(e){}
})();

/* ════════ 2 · CÓMO FUNCIONA: las etapas pasan de costado ════════ */
(function(){
  var sec=$('como'),track=$('howTrack');if(!sec)return;var cards=$$('.st',track);
  if(!GO||innerWidth<1000||innerHeight<640)return;
  sec.classList.add('pinned');
  var fill=sec.querySelector('.how-prog b'),vis=cards.map(function(c){return c.querySelector('.mk,img')});
  var dist=function(){return Math.max(0,track.scrollWidth-innerWidth+parseFloat(getComputedStyle(track).paddingLeft))};
  gsap.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:sec,start:'top top',end:'bottom bottom',scrub:.6,invalidateOnRefresh:true,
    onUpdate:function(s){var p=s.progress,f=p*(cards.length-1),k=Math.round(f);fill.style.transform='scaleX('+p.toFixed(3)+')';
      cards.forEach(function(c,i){c.classList.toggle('on',i===k);vis[i].style.transform='translate3d('+((f-i)*-22).toFixed(1)+'px,0,0)'+(vis[i].tagName==='IMG'?' scale(1.12)':'')})}}});
})();

/* ════════ 3 · PARTÍCULAS ════════
   Polvo fino que flota (como en Mercury). En la sección de Hornero, con el scroll, se ordena en las dos cintas del isologo. */
function Dust(cv,o){
  /* Polvo como el de Mercury: motas mínimas y suaves. Cada mota es una manchita con forma de ave (dos alas apenas abiertas),
     tan chica que se lee como polvo. Flotan lento; con el scroll (form 0→1) se posan sobre las cintas del isologo. */
  var x=cv.getContext('2d'),W=0,H=0,dpr=1,P=[],T=[],mouse={x:-9e3,y:-9e3},self=this,SP=24;
  this.form=0;this.visible=true;
  function mote(col){var c=document.createElement('canvas');c.width=c.height=SP;var g=c.getContext('2d'),m=SP/2;
    g.filter='blur(.6px)';g.fillStyle='rgba('+col+',1)';
    [-1,1].forEach(function(sd){g.save();g.translate(m,m+1);g.rotate(sd*.42);g.beginPath();g.ellipse(sd*SP*.17,0,SP*.2,SP*.075,0,0,6.283);g.fill();g.restore()});
    g.beginPath();g.arc(m,m+1.5,SP*.07,0,6.283);g.fill();return c}
  var SPR=o.dark?{n:mote('169,176,218'),g:mote('127,224,181'),m:mote('110,118,170')}:{n:mote('31,44,107'),g:mote('52,192,138'),m:mote('120,126,148')};
  function targets(){
    T=[];if(!o.loop)return;
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),pa=document.createElementNS('http://www.w3.org/2000/svg','path');
    pa.setAttribute('d',LOOP);svg.appendChild(pa);svg.style.cssText='position:absolute;width:0;height:0';document.body.appendChild(svg);
    var L=pa.getTotalLength(),w=Math.min(W*.58,780,H*.44*1.75),s=w/700,cx=W/2,cy=H*o.cy,M=Math.floor(P.length*.88);
    for(var i=0;i<M;i++){var two=i%2,pt=pa.getPointAtLength((i/M)*L*.9999),px=pt.x,py=pt.y;if(two){px=700-px;py=400-py}
      var j=(Math.random()-.5)*(o.thick||16)*s,a=Math.random()*6.283;
      T.push({x:cx+(px-350)*s+Math.cos(a)*j,y:cy+(py-200)*s+Math.sin(a)*j,c:two})}
    svg.remove();
  }
  function build(){
    W=cv.clientWidth;H=cv.clientHeight;dpr=Math.min(devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;
    var N=Math.round(clamp(W*H/(o.density||900),220,o.max||1700));P=[];
    for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,s:Math.random(),d:Math.random()*.8+.2,k:Math.random(),z:1.8+Math.pow(Math.random(),2.2)*2.8,h:Math.random()*6.283,f:Math.random()*6.283});
    targets();
  }
  build();addEventListener('resize',build);
  if(FINE)cv.parentNode.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
  cv.parentNode.addEventListener('pointerleave',function(){mouse.x=mouse.y=-9e3});
  this.tick=function(t){
    if(!self.visible)return;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);
    var F=self.form,mt=t*.06;
    for(var i=0;i<P.length;i++){var q=P[i];
      var ang=-.4+(Math.sin(q.x*.0025+mt)+Math.cos(q.y*.003-mt*1.2))*.9,sp=.11*q.d,vx=Math.cos(ang)*sp,vy=Math.sin(ang)*sp*.7;
      var dx=q.x-mouse.x,dy=q.y-mouse.y,dd=dx*dx+dy*dy;if(dd<8100){var f=(1-dd/8100)*1.1,m=Math.sqrt(dd+1);vx+=dx/m*f;vy+=dy/m*f}
      q.x+=vx;q.y+=vy;if(q.x<-8)q.x=W+8;if(q.x>W+8)q.x=-8;if(q.y<-8)q.y=H+8;if(q.y>H+8)q.y=-8;
      var X=q.x,Y=q.y,tg=T[i],fi=0;
      if(tg&&F>0){fi=eo(clamp((F-q.s*.4)/.6,0,1));var br=Math.sin(t*1.1+q.k*6.283)*1;X=lerp(q.x,tg.x+br,fi);Y=lerp(q.y,tg.y+br*.6,fi)}
      var head=Math.atan2(vy,vx)+Math.PI/2;q.h+=Math.atan2(Math.sin(head-q.h),Math.cos(head-q.h))*.05;
      var img=tg&&fi>.5?(tg.c?SPR.n:SPR.g):(q.k<.7?SPR.n:q.k<.92?SPR.m:SPR.g);
      var al=fi>.5?.78+.2*q.d:.14+.24*q.d;
      var fl=1+Math.sin(t*(fi>.5?2:5)+q.f)*.18;                                  // un aleteo apenas perceptible
      var sc=q.z/SP*dpr*(fi>.5?1.3:1),cs=Math.cos(q.h)*sc,sn=Math.sin(q.h)*sc;
      x.globalAlpha=al;x.setTransform(cs*fl,sn*fl,-sn,cs,X*dpr,Y*dpr);x.drawImage(img,-SP/2,-SP/2);
    }
    x.globalAlpha=1;
  };
}

/* ════════ 4 · MANIFIESTO: secuencia tipográfica ════════
   Una frase a la vez, grande. Cada palabra entra desenfocada y se asienta; al irse, se vuelve a desenfocar.
   Cierra "Es posible." y el polvo se ordena en el isologo con "Cuando te decidís, todo se ordena." */
(function(){
  var sec=$('manifiesto');if(!sec)return;
  function eio(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  var lines=$$('#mfLines .mf-line'),N=lines.length,num=$('mfN'),bar=$('mfBar'),claim=$('mfClaim'),logo=$('mfLogo'),cv=$('mfCv');
  lines.forEach(function(l){(function split(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(!w.trim()){f.appendChild(document.createTextNode(w));return}var sp=document.createElement('span');sp.className='w';sp.textContent=w;f.appendChild(sp)});c.replaceWith(f)}else split(c)})})(l);l._w=$$('.w',l)});
  var dust=new Dust($('mfCv'),{loop:true,cy:.46,density:520,max:2800,thick:24});
  function render(p,t){
    var act=0;
    lines.forEach(function(l,i){
      var a=.02+i*.064,last=i===N-1,hold=last?.55:a+.048,vis=false;
      l._w.forEach(function(w,k){
        var tin=eo(clamp((p-a-k*.003)/.018,0,1)),tout=clamp((p-hold)/.014,0,1),o=tin*(1-tout);if(o>.01)vis=true;
        w.style.opacity=o.toFixed(3);w.style.filter=(o<.99)?'blur('+((1-tin)*12+tout*8).toFixed(1)+'px)':'';
        w.style.transform='translate3d(0,'+((1-tin)*20-tout*16).toFixed(1)+'px,0)';
      });
      l.style.visibility=vis?'visible':'hidden';if(p>=a)act=i;
    });
    num.textContent=String(Math.min(7,act+1)).padStart(2,'0');
    bar.style.transform='scaleX('+clamp(p/.55,0,1).toFixed(3)+')';
    var hu=clamp((p-.555)/.07,0,1),hb=clamp((p-.63)/.06,0,1);dust.form=.75*eo(hu)*(1-eo(hb));if(t!=null)dust.tick(t);
    var H=innerHeight,W=innerWidth,w=Math.min(W*.58,780,H*.44*1.75),s0=w/700,ox=W/2+20*s0,oy=H*.46-25*s0;
    var ex=clamp((p-.63)/.09,0,1),eb=eo(ex);
    cv.style.transformOrigin='50% 46%';cv.style.transform='scale('+(1+eb*.9).toFixed(3)+')';cv.style.opacity=(1-clamp((p-.66)/.07,0,1)).toFixed(3);
    var x=eo(clamp((p-.64)/.11,0,1)),lk=logo.parentNode;
    lk.style.transform='translate(-50%,-50%) scale('+(7-6*x).toFixed(3)+')';lk.style.filter=x<1?'blur('+((1-x)*14).toFixed(1)+'px)':'';
    logo.style.opacity=clamp(x*1.6,0,1).toFixed(3);
    var c=eo(clamp((p-.74)/.05,0,1));claim.style.opacity=c;claim.style.transform='translateY('+((1-c)*14)+'px)';
  }
  if(!GO){render(.97);dust.form=1;if(!RM)(function f(t){dust.tick(t/1000);requestAnimationFrame(f)})(0);return}
  var st={p:0};
  ST.create({trigger:sec,start:'top bottom',end:'bottom top',onToggle:function(s){dust.visible=s.isActive}});
  gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:sec,start:'top top',end:'bottom bottom',scrub:.6}});
  gsap.ticker.add(function(time){if(dust.visible)render(st.p*.811,time)});
})();

/* ════════ 4 · HORNERO: manifiesto, partículas y presentación ════════ */
(function(){
  var sec=$('hornero'),cv=$('hnCv');if(!sec)return;
  var t=$('hnT');(function split(n){$$('*',n).length;[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w.trim()){f.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s)});c.replaceWith(f)}else split(c)})})(t);
  var ws=$$('.w',t),bird=$('hnBird'),R=$$('#hnR p'),L=$$('#hnL p'),foot=$('hnF');
  var dust=new Dust(cv,{loop:true,cy:.63,density:700,max:2200,thick:40,splat:.34});
  if(!GO){dust.form=1;ws.forEach(function(w){w.classList.add('on')});dust.tick(0);if(!RM)(function f(t){dust.tick(t/1000);requestAnimationFrame(f)})(0);return}
  var st={p:0};
  ST.create({trigger:sec,start:'top bottom',end:'bottom top',onToggle:function(s){dust.visible=s.isActive}});
  gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:sec,start:'top 70%',end:'bottom bottom',scrub:.6}});
  gsap.ticker.add(function(time){
    var p=st.p;var fb=clamp((p-.3)/.16,0,1);dust.form=.72*Math.pow(Math.sin(fb*Math.PI),2);dust.tick(time);
    var n=Math.round(clamp(p/.36,0,1)*ws.length);ws.forEach(function(w,i){w.classList.toggle('on',i<n)});
    var b=eo(clamp((p-.6)/.1,0,1));bird.style.opacity=b;bird.style.transform='scale('+(.6+.4*b)+')';
    R.concat(L).forEach(function(el,i){var o=eo(clamp((p-.68-i*.05)/.07,0,1));el.style.opacity=o;el.style.transform='translateY('+((1-o)*8)+'px) scale('+(.97+.03*o)+')'});
    $('hnR').style.opacity=$('hnL').style.opacity=1;
    var fo=clamp((p-.82)/.08,0,1);foot.style.opacity=fo;
  });
})();

/* ════════ 4b · LA CASA DESPIEZADA (seguridad) ════════
   Casa isométrica en cuatro capas con luz suave. Al entrar en pantalla se despieza; cada capa flota apenas. */
(function(){
  var box=$('house'),svg=$('houseSvg');if(!box)return;var NS='http://www.w3.org/2000/svg';
  function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
  var OX=490,OY=440;
  function P(x,y,z){return [OX+(x-y)*.866,OY+(x+y)*.5-z]}
  function poly(pts,a,p){a.points=pts.map(function(q){var r=P(q[0],q[1],q[2]);return r[0].toFixed(1)+','+r[1].toFixed(1)}).join(' ');return el('polygon',a,p)}
  var defs=el('defs',{},svg);
  function lg(id,c1,c2,x2,y2){var g=el('linearGradient',{id:id,x1:0,y1:0,x2:x2||0,y2:y2==null?1:y2},defs);el('stop',{offset:0,'stop-color':c1},g);el('stop',{offset:1,'stop-color':c2},g)}
  lg('hT','#E4E6FA','#AEB4E0',1,1);lg('hR','#5E66A3','#3F4680');lg('hL','#8C93CF','#6870AE');lg('hW','#FFE7B8','#F2B970');lg('hG','#7FE0B5','#34C08A',1,1);
  var bl=el('filter',{id:'hBl',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs);el('feGaussianBlur',{stdDeviation:14},bl);
  var ST_={stroke:'rgba(240,242,255,.45)','stroke-width':.8,'stroke-linejoin':'round'};
  function A(o){var r={};for(var k in ST_)r[k]=ST_[k];for(k in o)r[k]=o[k];return r}
  function boxF(g,x0,x1,y0,y1,z0,z1,top){
    poly([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],A({fill:'url(#hL)'}),g);
    poly([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],A({fill:'url(#hR)'}),g);
    if(top!==false)poly([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],A({fill:'url(#hT)'}),g);
  }
  var layers=[],base=[0,16,96,108];
  function shadow(g,w,d){var c=P(0,0,0);el('ellipse',{cx:c[0],cy:c[1]+8,rx:w*1.05,ry:d*.55,fill:'rgba(5,8,25,.45)',filter:'url(#hBl)'},g)}
  // 1 · terreno
  var g1=el('g',{'class':'hl'});shadow(g1,170,170);boxF(g1,-150,150,-150,150,0,14);
  for(var v=-110;v<=110;v+=55){var a=P(v,-150,14),b=P(v,150,14),c=P(-150,v,14),d=P(150,v,14);el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'rgba(63,70,128,.18)'},g1);el('line',{x1:c[0],y1:c[1],x2:d[0],y2:d[1],stroke:'rgba(63,70,128,.18)'},g1)}
  poly([[90,40,14.5],[150,40,14.5],[150,70,14.5],[90,70,14.5]],{fill:'rgba(255,255,255,.35)'},g1);
  [[-110,110],[-120,-60],[120,-120]].forEach(function(q){var c=P(q[0],q[1],14);el('ellipse',{cx:c[0],cy:c[1]-8,rx:13,ry:10,fill:'url(#hG)',opacity:.85},g1)});
  // 2 · planta baja con ventanas iluminadas
  var g2=el('g',{'class':'hl'});shadow(g2,120,100);boxF(g2,-100,100,-80,80,0,78,false);
  poly([[100,-50,20],[100,-10,20],[100,-10,58],[100,-50,58]],{fill:'url(#hW)',opacity:.9},g2);
  poly([[100,20,20],[100,58,20],[100,58,58],[100,20,58]],{fill:'url(#hW)',opacity:.9},g2);
  poly([[-60,80,0],[-30,80,0],[-30,80,52],[-60,80,52]],{fill:'#3A417A'},g2);
  poly([[10,80,22],[60,80,22],[60,80,58],[10,80,58]],{fill:'url(#hW)',opacity:.85},g2);
  poly([[-100,-80,78],[100,-80,78],[100,80,78],[-100,80,78]],{fill:'rgba(30,36,80,.55)',stroke:'rgba(240,242,255,.3)','stroke-width':.8},g2);
  // 3 · losa (estructura)
  var g3=el('g',{'class':'hl'});shadow(g3,124,104);boxF(g3,-110,110,-90,90,0,10);
  for(v=-70;v<=70;v+=35){a=P(v,-90,10.3);b=P(v,90,10.3);el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'rgba(63,70,128,.22)'},g3)}
  // 4 · techo a dos aguas
  var g4=el('g',{'class':'hl'});shadow(g4,124,104);
  poly([[-114,-94,0],[114,-94,0],[114,0,72],[-114,0,72]],A({fill:'url(#hL)'}),g4);
  poly([[-114,0,72],[114,0,72],[114,94,0],[-114,94,0]],A({fill:'url(#hT)'}),g4);
  poly([[114,-94,0],[114,94,0],[114,0,72]],A({fill:'url(#hR)'}),g4);
  boxF(g4,40,64,-30,-6,40,104);
  layers=[g1,g2,g3,g4];layers.forEach(function(g){svg.appendChild(g)});
  // etiquetas mínimas con guías
  var L=[['Capa 1','Tus datos, cifrados','l'],['Capa 2','Profesionales registrados','r'],['Capa 3','Firma digital','l'],['Capa 4','Visibilidad total','r']];
  var labs=L.map(function(t){var d=document.createElement('div');d.className='hlab '+t[2];d.innerHTML='<span>'+t[0].toUpperCase()+'</span>'+t[1];box.appendChild(d);return d});
  var leads=L.map(function(){return el('line',{'class':'hlead'},svg)});
  var st={e:0};
  function draw(t){
    var e=st.e,gaps=[0,48,104,170];
    layers.forEach(function(g,i){var off=-gaps[i]*e+(e>.9?Math.sin(t*.9+i*1.3)*2.2:0);g.setAttribute('transform','translate(0 '+(-base[i]+off).toFixed(1)+')');
      var side=L[i][2],corner=side==='l'?P(-150+i*12,150-i*20,0):P(150-i*12,-150+i*20,0),y=corner[1]-base[i]+off-(i===0?0:6);
      var x1=side==='l'?corner[0]-10:corner[0]+10,x2=side==='l'?220:760;
      leads[i].setAttribute('x1',x1);leads[i].setAttribute('x2',x2);leads[i].setAttribute('y1',y);leads[i].setAttribute('y2',y);leads[i].style.opacity=clamp((e-.6)/.3,0,1)*.8;
      var sc=box.clientWidth/980;labs[i].style.top=((y-18)*sc)+'px';labs[i].style.left=side==='l'?((x2-210)*sc)+'px':((x2+10)*sc)+'px';labs[i].style.opacity=clamp((e-.6)/.3,0,1)});
  }
  if(!GO){st.e=1;draw(0);return}
  gsap.to(st,{e:1,ease:'power2.inOut',scrollTrigger:{trigger:box,start:'top 85%',end:'center 50%',scrub:.8}});
  var vis=false;ST.create({trigger:box,start:'top bottom',end:'bottom top',onToggle:function(s){vis=s.isActive}});
  gsap.ticker.add(function(t){if(vis)draw(t)});draw(0);
})();

if(GO){var sg=$('seguridad');ST.create({trigger:sg,start:'top 76px',end:'bottom 76px',onToggle:function(x){nav.classList.toggle('dark',x.isActive)}})}

/* ════════ 5 · CIERRE: el isologo se teje sobre el polvo ════════ */
(function(){
  var sec=$('cierre');if(!sec)return;
  var gs=$$('.g',sec),b=sec.querySelector('.b'),art=$('art'),copy=[].slice.call($('endIn').querySelector('.wrap').children);
  var dust=new Dust($('endCv'),{density:2400,max:600});
  if(!GO){copy.forEach(function(el){el.style.opacity=1;el.style.transform='none'});art.style.transform='translate(-50%,calc(-50% - 30vh)) scale(.22)';if(!RM)(function f(t){dust.tick(t/1000);requestAnimationFrame(f)})(0);return}
  var L=b.getTotalLength();gs.concat([b]).forEach(function(p){p.style.strokeDasharray=L+' '+L;p.style.strokeDashoffset=L});
  var st={p:0};
  ST.create({trigger:sec,start:'top bottom',end:'bottom top',onToggle:function(s){dust.visible=s.isActive}});
  gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:sec,start:'top 60%',end:'bottom bottom',scrub:.6}});
  gsap.ticker.add(function(time){
    dust.tick(time);var p=st.p;
    var gi=io(clamp(p/.36,0,1)),bi=io(clamp((p-.06)/.36,0,1)),z=io(clamp((p-.48)/.26,0,1));
    gs.forEach(function(x){x.style.strokeDashoffset=L*(1-gi)});b.style.strokeDashoffset=L*(1-bi);
    art.style.transform='translate(-50%,calc(-50% - '+(z*31)+'vh)) scale('+(1-.8*z)+')';
    copy.forEach(function(el,k){var o=eo(clamp((p-.62-k*.05)/.18,0,1));el.style.opacity=o;el.style.transform='translateY('+(22*(1-o))+'px)';el.style.pointerEvents=o>.6?'':'none'});
  });
})();

/* ════════ 6 · SIMULADOR ════════ */
var Sim=(function(){
  var R={ltv:.65,tna:.075,ci:.18};                               // tasa de EJEMPLO: reemplazar cuando Negocio la confirme
  var el=$('sim'),sc=$('stepCuil'),sk=$('stepCalc'),v=$('vIn'),n=$('nIn'),say=$('simSay'),cIn=$('cuilIn'),go=$('cuilGo'),last=null,open=false,tm;
  function usd(x){return 'USD '+Math.round(x).toLocaleString('es-AR')}
  function fill(r){r.style.setProperty('--p',((r.value-r.min)/(r.max-r.min)*100)+'%')}
  function calc(){var val=+v.value,y=+n.value,loan=val*R.ltv,i=R.tna/12,m=y*12,c=loan*i/(1-Math.pow(1+i,-m));
    $('vO').textContent=usd(val);$('nO').textContent=y+' años';
    var ci=Math.floor(c),dec=Math.round((c-ci)*100);$('cO').innerHTML='<small>USD</small>'+ci.toLocaleString('es-AR')+'<sup>,'+(dec<10?'0':'')+dec+'</sup>';
    $('lO').textContent=usd(loan);$('aO').textContent=usd(val-loan);$('iO').textContent=usd(Math.ceil(c/R.ci/10)*10);fill(v);fill(n)}
  function hsay(t,cls){clearTimeout(tm);say.className='';say.innerHTML='<span class="hdots"><i></i><i></i><i></i></span>';tm=setTimeout(function(){say.textContent=t;say.className=cls||''},650)}
  [v,n].forEach(function(r){r.addEventListener('input',function(){calc();clearTimeout(r._t);r._t=setTimeout(function(){hsay('Con un aporte de '+usd(+v.value*(1-R.ltv))+' ya podés empezar.')},450)})});calc();
  function show(cuil){
    last=document.activeElement;open=true;el.classList.add('on');el.removeAttribute('aria-hidden');lenis&&lenis.stop();root.classList.add('sim-on');
    if(cuil){el.classList.remove('ready');el.classList.add('loading');sc.hidden=true;sk.hidden=false;
      setTimeout(function(){el.classList.remove('loading');el.classList.add('ready');hsay('Mové el valor y el plazo: recalculo al instante.');v.focus({preventScroll:true})},RM?0:1400)}
    else{el.classList.add('ready');sc.hidden=false;sk.hidden=true;say.textContent='Solo necesitás tu CUIL para empezar.';setTimeout(function(){cIn.focus({preventScroll:true})},60)}
  }
  function hide(){if(!open)return;open=false;el.classList.remove('on','ready','loading');el.setAttribute('aria-hidden','true');lenis&&lenis.start();root.classList.remove('sim-on');last&&last.focus&&last.focus({preventScroll:true})}
  $$('[data-close]',el).forEach(function(b){b.addEventListener('click',hide)});
  document.addEventListener('keydown',function(e){if(!open)return;if(e.key==='Escape')hide();
    if(e.key==='Tab'){var f=$$('button:not(:disabled),input,a[href]',el).filter(function(x){return x.offsetParent}),a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  /* CUIL: máscara 20-12345678-9; el front solo pide 11 dígitos, la validación real es de backend. No se envía ni se guarda en este prototipo. */
  function digits(i){return i.value.replace(/\D/g,'').slice(0,11)}
  $$('[data-cuil]').forEach(function(i){i.addEventListener('input',function(){var d=digits(i);i.value=d.length>10?d.slice(0,2)+'-'+d.slice(2,10)+'-'+d.slice(10):d.length>2?d.slice(0,2)+'-'+d.slice(2):d;if(i===cIn)go.disabled=d.length!==11;var f=i.closest('form');f&&f.classList.remove('err')})});
  $$('form[data-q]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var i=f.querySelector('[data-cuil]');
    if(digits(i).length!==11){f.classList.add('err');f.querySelector('.qerr').textContent='Ingresá los 11 números de tu CUIL. ';i.focus();window.Hornero&&Hornero.say('Son 11 números, sin puntos ni guiones.',{tone:'alert'});return}
    f.querySelector('.qerr').textContent='';show(true);window.Hornero&&Hornero.signal('sim:cuil')})});
  $('cuilF').addEventListener('submit',function(e){e.preventDefault();if(digits(cIn).length===11){el.classList.remove('ready');setTimeout(function(){show(true)},200)}});
  $$('[data-sim]').forEach(function(b){b.addEventListener('click',function(){var q=$('q1'),r=hero.getBoundingClientRect();if(q&&+getComputedStyle($('hcopy')).opacity>.6&&r.top>-50){q.focus();return}show(false)})});
  return {show:show,hide:hide,isOpen:function(){return open}};
})();

/* ════════ 7 · CHAT CON HORNERO ════════ */
var Chat=(function(){
  var KB=[
   {k:['prestar','presta','cuanto me','monto','disponible','puedo pedir','financ'],q:'¿Cuánto me pueden prestar?',a:'Financiamos hasta el 65% del valor de la propiedad, según tus ingresos. Con tu CUIL te doy una primera cifra orientativa en minutos.',cta:'Simular ahora'},
   {k:['necesito','requisito','papeles','documento'],q:'¿Qué necesito?',a:'Para simular, solo tu CUIL. Para la solicitud:<ol><li>DNI y selfie</li><li>Comprobantes de ingresos</li><li>Datos del inmueble y de tu codeudor</li></ol>',cta:'Empezar a simular'},
   {k:['escritura','gastos','costo total','cuesta','escribano','sellos'],q:'¿Cuánto cuesta escriturar?',a:'Además de tu aporte hay gastos: escribanía, sellos (según la zona), tasación e inscripción. En la simulación ves el costo total antes de decidir.',cta:'Ver mi simulación'},
   {k:['scoring','historial','veraz','afecta','consulta'],q:'¿Simular afecta mi scoring?',a:'No. Simular es orientativo: las validaciones formales llegan cuando decidís iniciar la solicitud.',cta:'Simular sin compromiso'}];
  var FB={a:'Todavía estoy aprendiendo sobre eso. Lo que sí puedo hacer es mostrarte cuánto podés financiar. ¿Lo vemos?',cta:'Simular'};
  var log=$('log'),sg=$('sugg'),fm=$('ask'),q=$('askIn'),sb=fm.querySelector('button'),used={},hi=false,last=null;
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function find(t){var n=norm(t);for(var i=0;i<KB.length;i++)if(KB[i].k.some(function(k){return n.indexOf(norm(k))>-1}))return KB[i];return FB}
  function bub(c,h){var d=document.createElement('div');d.className='msg '+c;d.innerHTML=h;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
  function rep(it){var b=bub('ai','<span class="hdots"><i></i><i></i><i></i></span>');setTimeout(function(){b.innerHTML=it.a;if(it.cta){var g=document.createElement('button');g.className='go';g.type='button';g.textContent=it.cta;g.onclick=function(){close();Sim.show(false)};b.appendChild(document.createElement('br'));b.appendChild(g)}log.scrollTop=log.scrollHeight;chips()},RM?0:700)}
  function ask(t){bub('me',t.replace(/</g,'&lt;'));var it=find(t);used[it.q]=1;rep(it)}
  function chips(){sg.innerHTML='';KB.filter(function(x){return !used[x.q]}).slice(0,3).forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x.q;b.onclick=function(){ask(x.q)};sg.appendChild(b)})}
  function openC(first){last=document.activeElement;root.classList.add('chat-on');$('chat').removeAttribute('aria-hidden');lenis&&lenis.stop();if(!hi){hi=true;rep({a:'Hola, soy Hornero. Te ayudo a entender tu crédito antes de decidir. ¿Por dónde arrancamos?'})}if(first)ask(first);setTimeout(function(){q.focus({preventScroll:true})},420)}
  function close(){if(!root.classList.contains('chat-on'))return;root.classList.remove('chat-on');$('chat').setAttribute('aria-hidden','true');lenis&&lenis.start();last&&last.focus&&last.focus({preventScroll:true})}
  $('chatX').onclick=close;$('chatS').onclick=close;document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  q.oninput=function(){sb.disabled=!q.value.trim()};fm.onsubmit=function(e){e.preventDefault();var t=q.value.trim();if(!t)return;q.value='';sb.disabled=true;ask(t)};chips();
  $$('[data-chat]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();openC()})});
  return {open:openC,close:close,isOpen:function(){return root.classList.contains('chat-on')}};
})();

/* ════════ 8 · HORNERO QUE VUELA ════════
   Presencia ambiente de ~30 px en su burbuja. Cada sección declara su ancla (data-hb, data-hb-anchor, data-hb-pos, data-hb-say).
   Vuela de un ancla a otra con el scroll; crece a 40 px cuando habla. Un mensaje a la vez: piensa → saltito → texto.
   Para el modelo de ML: se reemplaza Hornero.brain(signal). Señales: section, stop (3 s quieto), hesitate, sim:cuil. */
(function(){
  var fly=$('hf'),btn=$('hfB'),bub=$('hfSay'),status=$('hbStatus'),secs=$$('[data-hb]');
  var docked={},queue=[],talking=false,tmr,said={},hovering=false,cur=null,stopT,hop={y:0},out=false;
  function signal(t,d){document.dispatchEvent(new CustomEvent('hornero:signal',{detail:Object.assign({type:t},d||{})}))}
  var DOTS='<span class="hdots"><i></i><i></i><i></i></span>';
  function next(){if(talking||!queue.length)return;var m=queue.shift(),o=m.o;talking=true;if(status)status.textContent=m.text;
    if(!out){talking=false;return}
    bub.className='hf-say '+(o.tone||'');bub.innerHTML=DOTS;fly.classList.add('say','think');
    tmr=setTimeout(function(){bub.innerHTML='';var sp=document.createElement('span');sp.className='tx';sp.textContent=m.text;bub.appendChild(sp);fly.classList.remove('think');
      tmr=setTimeout(function(){fly.classList.remove('say');if(cur)docked[cur.id]=1;tmr=setTimeout(function(){talking=false;next()},320)},o.hold||4200)},o.think==null?900:o.think)}
  var Hn=window.Hornero={
    say:function(t,o){o=o||{};if(queue.length>1)queue.length=1;queue.push({text:t,o:o});next()},
    hush:function(){queue.length=0;clearTimeout(tmr);talking=false;fly.classList.remove('say','think')},
    signal:signal,
    brain:function(s){
      if(s.type==='stop'&&s.say&&!said[s.id]){said[s.id]=1;Hn.say(s.say)}
      else if(s.type==='hesitate'&&!said.hes){said.hes=1;Hn.say('Simular es sin costo ni compromiso. ¿Lo vemos juntos?')}}
  };
  document.addEventListener('hornero:signal',function(e){try{Hn.brain(e.detail)}catch(x){}});
  var hes;document.addEventListener('mouseover',function(e){var b=e.target.closest&&e.target.closest('.btn-p');clearTimeout(hes);if(b&&!Sim.isOpen())hes=setTimeout(function(){signal('hesitate')},2600)});
  document.addEventListener('click',function(){clearTimeout(hes)},true);
  btn.addEventListener('click',function(){Hn.hush();Chat.open()});bub.addEventListener('click',function(){Hn.hush();Chat.open()});
  btn.addEventListener('mouseenter',function(){hovering=true;fly.classList.add('named')});btn.addEventListener('mouseleave',function(){hovering=false;fly.classList.remove('named')});
  if(!GO){fly.style.cssText='opacity:1;visibility:visible;left:auto;top:auto;right:24px;bottom:24px;margin:0;width:56px;height:56px';fly.classList.add('flip');out=true;return}

  var small=innerWidth<900||!FINE,S=window.anidaHero?window.anidaHero.state:{p:1};
  var P={x:innerWidth-80,y:innerHeight*.3,o:0},E={v:.31},D={x:0,y:0},arc={v:0},face=-1,lx=0,ly=0,tgt={x:0,y:0,hide:true},frame=0;
  var toX=gsap.quickTo(P,'x',{duration:.9,ease:'power2.out'}),toY=gsap.quickTo(P,'y',{duration:.9,ease:'power2.out'}),toO=gsap.quickTo(P,'o',{duration:.4}),toE=gsap.quickTo(E,'v',{duration:.5});
  function at(vh){for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect();if(r.top<=vh*.5&&r.bottom>vh*.5)return secs[i]}return null}
  function ok(r,vh){return r&&r.width&&r.top>90&&r.bottom<vh-20}
  function target(){var t=target0();if(!t.hide&&t.sec&&docked[t.sec.id]&&!talking){var W=innerWidth,vh=innerHeight,g=clamp(W*.04,20,48);return {x:W-g-6,y:vh-g-34,face:-1,sec:t.sec,dock:1}}return t}
  function target0(){
    var vh=innerHeight,W=innerWidth,g=clamp(W*.04,20,48);
    if(Chat.isOpen()||Sim.isOpen())return {x:W-g-20,y:vh-g-20,hide:true};
    var sec=at(vh);
    if(small){var fr=document.querySelector('footer').getBoundingClientRect();return {x:W-g-14,y:vh-(sec&&sec.id==='hero'?96:g+20),face:-1,sec:sec,hide:fr.top<vh*.8||(sec&&sec.id==='manifiesto')}}
    if(!sec)return {x:W-g-30,y:vh*.32,face:-1,hide:true};
    if(sec.id==='hornero')return {x:W/2,y:vh*.56,hide:true,sec:sec};
    if(sec.id==='manifiesto')return {x:W/2,y:vh*.62,hide:true,sec:sec};                 // en el manifiesto no interrumpe                     // ahí está en grande: el que vuela se guarda
    if(sec.id==='hero'){var h1=$('hcopy');if(+getComputedStyle(h1).opacity>.4){var gb=h1.querySelector('.btn-glass')||h1.querySelector('.qbox'),r2=gb.getBoundingClientRect();return {x:Math.min(r2.right+120,W-g-30),y:r2.top+r2.height/2,face:-1,sec:sec}   /* junto a los botones, sin tapar el título */}
      return {x:W-g-34,y:vh*.24,face:-1,sec:sec}}
    var an=sec.getAttribute('data-hb-anchor'),a=an&&sec.querySelector(an),r=a&&a.getBoundingClientRect();
    if(!ok(r,vh))return {x:W-g-34,y:vh*.3,face:-1,sec:sec};
    var wr=sec.querySelector('.wrap'),cr=(wr||sec).getBoundingClientRect(),gx=Math.min(W-g-24,Math.max(cr.right+40,r.right+60));
    return {x:gx,y:clamp(r.top+r.height/2,140,vh-140),face:-1,sec:sec};
  }
  function arm(){clearTimeout(stopT);stopT=setTimeout(function(){if(cur&&out)signal('stop',{id:cur.id,say:cur.getAttribute('data-hb-say')})},3000)}
  addEventListener('scroll',arm,{passive:true});arm();
  (function drift(){if(out&&!hovering&&!fly.classList.contains('say')){var a=Math.random()*6.283,r=2+Math.random()*4;gsap.to(D,{x:Math.cos(a)*r,y:Math.sin(a)*r,duration:2.2,ease:'sine.inOut',overwrite:true})}gsap.delayedCall(2.6+Math.random()*2,drift)})();
  gsap.ticker.add(function(t){
    if(frame++%3===0){tgt=target();toX(tgt.x);toY(tgt.y);
      var o=!tgt.hide;if(o!==out){out=o;if(!out)Hn.hush()}
      if(tgt.sec!==cur){if(cur&&out)gsap.fromTo(arc,{v:0},{v:1,duration:.45,ease:'sine.out',yoyo:true,repeat:1});cur=tgt.sec;if(cur)signal('section',{id:cur.id});arm()}}
    var speak=fly.classList.contains('say'),think=fly.classList.contains('think');
    toE(speak?.42:(tgt.dock&&!hovering?.24:(small?.36:.31)));toO(tgt.hide?0:(speak||hovering?1:(tgt.dock?.55:.85)));
    var still=hovering||think,X=P.x+(still?0:D.x),Y=P.y+(still?0:D.y)-arc.v*26+hop.y;
    var vx=X-lx,vy=Y-ly;lx=X;ly=Y;var flying=Math.abs(vx)+Math.abs(vy)>1.1||arc.v>.05;
    Y+=still||flying?0:Math.sin(t*2.244)*3;
    if(flying&&Math.abs(vx)>.9)face=vx>0?1:-1;else if(tgt.face)face=tgt.face;
    var tilt=flying?clamp(Math.abs(vx)*1.2,0,12):still?0:Math.sin(t*1.1)*3;
    var wf=think?'.12s':flying?'.22s':hovering?'1.1s':'.5s';if(wf!==btn._wf){btn._wf=wf;btn.style.setProperty('--wf',wf)}
    fly.classList.toggle('ondark',!!(tgt.sec&&tgt.sec.id==='hero'));fly.style.opacity=P.o.toFixed(3);fly.style.visibility=P.o<.02?'hidden':'visible';
    fly.style.transform='translate3d('+X.toFixed(1)+'px,'+Y.toFixed(1)+'px,0)';
    btn.style.transform='scale('+E.v.toFixed(3)+') scaleX('+face+') rotate('+tilt.toFixed(1)+'deg)';fly.style.setProperty('--e',E.v.toFixed(3));
    if(!speak)fly.classList.toggle('flip',X>innerWidth-300);
  });
})();
})();
