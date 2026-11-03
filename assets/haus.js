/* Kleiststraße 16 · Haus von außen. Modellmaße in Metern aus EG- und DG-Plan (Vektor-PDF) und Ansicht Süd.
   Koordinaten wie im Grundriss: x nach rechts im Plan (= Westen), z nach unten im Plan (= Norden), y nach oben, 0 = Fußboden Küche. */
(function(){
const host=document.getElementById('haus3d');if(!host||!window.THREE)return;
const W=()=>host.clientWidth,H=()=>host.clientHeight;
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.95;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#dfe8ec');
const camera=new THREE.PerspectiveCamera(38,1,0.1,300);
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*0.49;controls.minDistance=8;controls.maxDistance=70;
const rnd=(a,b)=>a+Math.random()*(b-a);
function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t;}
/* Klinker: Langformat rosé (ca. 49 × 4 cm) und Normalformat rot (24 × 7,1 cm); Textur deckt 1 × 1 m */
const PAL={lang:['#a9786c','#b4867a','#9c6d63','#b98d80','#8f675d','#a47f74'],sand:['#c9b8a0','#bfae95','#d3c3ab','#b5a389','#c4b096','#a8977e'],anthra:['#4b4744','#57514c','#3f3c3a','#625b55','#4e4843','#6b635c'],rot:['#a8442f','#b24e36','#9b3f2c','#ba5a40','#8f3a29','#a64a34']};
function brickTex(kind){const lf=kind!=='rot';return tex(1024,1024,(g,w,h)=>{
  g.fillStyle=kind==='anthra'?'#8f8b86':(lf?'#d8cfc6':'#c9c0b4');g.fillRect(0,0,w,h);
  const rows=lf?20:12,bw=lf?w*0.49:w*0.24,bh=h/rows,j=lf?7:5;
  const pal=PAL[kind];
  for(let r=0;r<rows;r++){const off=(r%2)*bw*(lf?0.37:0.5);for(let x=-bw;x<w+bw;x+=bw){const col=pal[(Math.random()*pal.length)|0];
    g.fillStyle=col;g.fillRect(x+off+j/2,r*bh+j/2,bw-j,bh-j);g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x+off+j/2,r*bh+j/2,bw-j,2);
    for(let k=0;k<6;k++){g.fillStyle=`rgba(0,0,0,${rnd(.03,.09)})`;g.fillRect(x+off+rnd(j,bw-j),r*bh+rnd(j,bh-j),rnd(2,9),rnd(1,3));}}}});}
function soldierTex(kind){const lf=kind!=='rot';return tex(512,256,(g,w,h)=>{g.fillStyle=kind==='anthra'?'#8f8b86':'#d8cfc6';g.fillRect(0,0,w,h);
  const pal=PAL[kind];const n=lf?13:7;const bw=w/n;
  for(let i=0;i<n;i++){g.fillStyle=pal[(Math.random()*pal.length)|0];g.fillRect(i*bw+3,3,bw-6,h-6);}});}
const plasterT=tex(512,512,(g,w,h)=>{g.fillStyle='#f1eee8';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){g.fillStyle=`rgba(${rnd(120,180)|0},${rnd(110,170)|0},${rnd(100,160)|0},${rnd(.02,.06)})`;g.fillRect(rnd(0,w),rnd(0,h),2,2);}});
const roofT=tex(512,512,(g,w,h)=>{g.fillStyle='#8e3d2c';g.fillRect(0,0,w,h);const rows=16,rh=h/rows,tw=w/12;
  for(let r=0;r<rows;r++)for(let i=0;i<13;i++){const x=i*tw+(r%2)*tw/2;g.fillStyle=['#a24a35','#9a4532','#ad5540','#94402e','#a84f39'][(Math.random()*5)|0];g.fillRect(x+1,r*rh+1,tw-2,rh-3);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,r*rh+rh-3,tw,3);}});
const woodT=tex(256,512,(g,w,h)=>{g.fillStyle='#c79a63';g.fillRect(0,0,w,h);const n=8,bw=w/n;for(let i=0;i<n;i++){g.fillStyle=['#c99d66','#bf915b','#cfa66f','#c4965f'][i%4];g.fillRect(i*bw,0,bw-3,h);g.fillStyle='rgba(80,50,20,.35)';g.fillRect(i*bw+bw-3,0,3,h);
  for(let k=0;k<10;k++){g.strokeStyle=`rgba(110,70,35,${rnd(.1,.25)})`;g.beginPath();let x=i*bw+rnd(3,bw-6);g.moveTo(x,0);for(let y=0;y<=h;y+=40){x+=rnd(-1.5,1.5);g.lineTo(x,y);}g.stroke();}}});
/* Stülpschalung, weiß gestrichen: waagerechte, überlappende Bretter ca. 15 cm, Textur 1 × 1 m */
const whiteBoardT=tex(512,512,(g,w,h)=>{g.fillStyle='#f3f1ec';g.fillRect(0,0,w,h);const n=7,bh=h/n;for(let i=0;i<n;i++){const y=i*bh;const gr=g.createLinearGradient(0,y,0,y+bh);gr.addColorStop(0,'#f7f5f1');gr.addColorStop(.85,'#ebe8e2');gr.addColorStop(1,'#d9d5ce');g.fillStyle=gr;g.fillRect(0,y,w,bh);g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,y+bh-3,w,3);}});
/* Klappläden (Ansicht Ost): dunkel, mit Lamellen */
const shutterT=tex(128,128,(g,w,h)=>{g.fillStyle='#2a2e30';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){g.fillStyle='#3a3f42';g.fillRect(0,y,w,4);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y+6,w,2);}});
const brick={};['lang','sand','anthra','rot'].forEach(k=>brick[k]={w:brickTex(k),s:soldierTex(k)});
const M={brick:new THREE.MeshStandardMaterial({map:brick.lang.w,roughness:.9}),soldier:new THREE.MeshStandardMaterial({map:brick.lang.s,roughness:.9}),
  plaster:new THREE.MeshStandardMaterial({map:plasterT,roughness:.95}),sockel:new THREE.MeshStandardMaterial({color:'#d8b2a6',roughness:.95}),
  roof:new THREE.MeshStandardMaterial({map:roofT,roughness:.8,side:THREE.DoubleSide}),dormer:new THREE.MeshStandardMaterial({map:whiteBoardT,roughness:.7}),
  frame:new THREE.MeshStandardMaterial({color:'#3d4144',roughness:.5}),glass:new THREE.MeshStandardMaterial({color:'#2f3c44',roughness:.06,metalness:.4}),
  zinc:new THREE.MeshStandardMaterial({color:'#a7adb1',roughness:.4,metalness:.6}),flat:new THREE.MeshStandardMaterial({color:'#4a4d50',roughness:.9}),
  grass:new THREE.MeshStandardMaterial({color:'#8ea873',roughness:1}),paving:new THREE.MeshStandardMaterial({color:'#c9c4bb',roughness:.95}),
  door:new THREE.MeshStandardMaterial({color:'#3d4144',roughness:.5}),shutter:new THREE.MeshStandardMaterial({map:shutterT,roughness:.6}),canopy:new THREE.MeshStandardMaterial({color:'#3a3e41',roughness:.45,metalness:.3}),cplate:new THREE.MeshStandardMaterial({color:'#3a3e41',roughness:.45,metalness:.3}),cfascia:new THREE.MeshStandardMaterial({color:'#3a3e41',roughness:.45,metalness:.3}),beton:new THREE.MeshStandardMaterial({color:'#b9b5ad',roughness:.95}),wp:new THREE.MeshStandardMaterial({color:'#d6d8d7',roughness:.6}),gravel:new THREE.MeshStandardMaterial({color:'#cfd2d2',roughness:1}),
  plant:new THREE.MeshStandardMaterial({color:'#5f7f4c',roughness:.9,flatShading:true}),trunk:new THREE.MeshStandardMaterial({color:'#6b5a45',roughness:1})};
/* Welt-UVs: Texturen bleiben auf jeder Fläche im Meter-Maßstab */
function worldUV(mesh,scale){const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv,o=mesh.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i)+o.x,y=p.getY(i)+o.y,z=p.getZ(i)+o.z,nx=Math.abs(n.getX(i)),nz=Math.abs(n.getZ(i));
    if(nx>.5)uv.setXY(i,z/scale,y/scale);else if(nz>.5)uv.setXY(i,x/scale,y/scale);else uv.setXY(i,x/scale,z/scale);}uv.needsUpdate=true;}
function B(x0,x1,y0,y1,z0,z1,mat,uvs,parent){const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),mat);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  if(uvs)worldUV(m,uvs);m.castShadow=m.receiveShadow=true;(parent||scene).add(m);return m;}
const G=-0.65; /* Gelände 0,65 m unter Küchenfußboden (Ansichten: drei Stufen à 16 cm) */
/* Gelände, Wege, Garten */
/* Gelände mit Aussparung für den Kellerabgang (West, x 0–1,0 / z 8,63–11,27) */
const gS=new THREE.Shape([new THREE.Vector2(-82,-86),new THREE.Vector2(78,-86),new THREE.Vector2(78,74),new THREE.Vector2(-82,74)]);
gS.holes.push(new THREE.Path([new THREE.Vector2(0,-8.63),new THREE.Vector2(0,-11.27),new THREE.Vector2(1.0,-11.27),new THREE.Vector2(1.0,-8.63)]));
const ground=new THREE.Mesh(new THREE.ShapeGeometry(gS),M.grass);ground.rotation.x=-Math.PI/2;ground.position.set(0,G-0.01,0);ground.receiveShadow=true;scene.add(ground);
B(-11,9,G-0.02,G,-4.5,-0.3,M.paving,1);B(-10.5,-3.9,G-0.02,G,-0.3,14.5,M.gravel,1);
/* Altbau: verputzt, Sockel rosé, Traufe +6,42 m über Gelände (Ansicht Süd) */
const ALT={x0:-7.22,x1:0,z0:2.40,z1:12.0},EAVE=5.77,SOCK=0.15;
B(ALT.x0,ALT.x1,G,SOCK,ALT.z0,ALT.z1,M.sockel);B(ALT.x0,ALT.x1,SOCK,EAVE,ALT.z0,ALT.z1,M.plaster,1.2);
B(ALT.x0-0.12,ALT.x1+0.12,EAVE,EAVE+0.2,ALT.z0-0.12,ALT.z1+0.12,M.plaster);
/* Erker Ostseite (Spielzimmer), Höhe aus Ansicht */
B(-8.42,ALT.x0,G,SOCK,7.6,11.6,M.sockel);B(-8.42,ALT.x0,SOCK,2.48,7.6,11.6,M.plaster,1.2);B(-8.47,ALT.x0,0.80,0.90,7.55,11.65,M.plaster);
B(-8.48,ALT.x0,2.48,3.11,7.54,11.66,M.plaster,1.2);B(-8.62,ALT.x0,3.11,3.19,7.41,11.78,M.zinc);B(-8.3,ALT.x0,3.19,3.35,8.62,10.75,M.zinc);
/* Anbau: Klinker, Flachdach mit Attika +3,82 m über Gelände */
const ATT=3.17;const anbau=new THREE.Group();scene.add(anbau);
B(0,4.0,G,ATT,-0.3,8.45,M.brick,1,anbau);B(-3.89,0,G,ATT,-0.3,2.40,M.brick,1,anbau);
B(-3.89,4.0,ATT,ATT+0.02,-0.3,2.4,M.zinc,null,anbau);B(0,4.0,ATT,ATT+0.02,2.4,8.45,M.zinc,null,anbau);
B(-3.79,3.9,ATT-0.05,ATT-0.03,-0.2,2.3,M.flat,null,anbau);B(0.1,3.9,ATT-0.05,ATT-0.03,2.3,8.35,M.flat,null,anbau);
const domeM=new THREE.MeshStandardMaterial({color:'#e9eef0',roughness:.2,transparent:true,opacity:.8});B(1.5,2.5,ATT,ATT+0.25,5.5,6.5,domeM,null,anbau);
/* kleinere Lichtkuppel im Eingangsbereich beim Gäste-WC, 0,70 × 0,70 m */
B(-2.9,-2.2,ATT,ATT+0.2,1.37,2.07,domeM,null,anbau);
/* Fenster: Rahmen + Glas auf der Fassade. Liste: Fläche, a0..a1 entlang der Wand, y0..y1, Art */
const fr=[];
function win(face,a0,a1,y0,y1,opt){opt=opt||{};const d=opt.d||0.06,t=0.07,g=new THREE.Group();scene.add(g);
  const P=(a,y,off)=>{switch(face){case 'S':return[a,y,face0.S-off];case 'N':return[a,y,face0.N+off];case 'E':return[face0.E-off,y,a];default:return[face0.W+off,y,a];}};
  const face0=opt.f;const box=(aa0,aa1,yy0,yy1,off0,off1,mat)=>{const p0=P(aa0,yy0,off0),p1=P(aa1,yy1,off1);
    B(Math.min(p0[0],p1[0]),Math.max(p0[0],p1[0]),Math.min(p0[1],p1[1]),Math.max(p0[1],p1[1]),Math.min(p0[2],p1[2]),Math.max(p0[2],p1[2]),mat,null,g);};
  box(a0,a1,y0,y1,-0.005,0.01,M.glass);
  [[a0,a0+t,y0,y1],[a1-t,a1,y0,y1],[a0,a1,y0,y0+t],[a0,a1,y1-t,y1]].forEach(([b0,b1,c0,c1])=>{box(b0,b1,c0,c1,-0.005,d,M.frame);});
  const n=opt.n||Math.max(1,Math.round((a1-a0)/0.75));for(let i=1;i<n;i++){const a=a0+(a1-a0)*i/n;box(a-0.035,a+0.035,y0,y1,-0.005,d,M.frame);}
  if(opt.sill)box(a0-0.05,a1+0.05,y0-0.05,y0,-0.005,0.12,M.zinc);
  if(opt.soldier)box(a0,a1,y0-0.32,y0-0.05,-0.002,0.012,M.soldier);
  fr.push(g);return g;}
const FA={S:-0.3,N:8.45,E:-3.89,W:4.0},FO={S:ALT.z0,N:ALT.z1,E:ALT.x0,W:ALT.x1},FE={E:-8.42,N:11.6,S:7.6};
/* Anbau (Plan + Ansicht Süd) */
win('S',0.73,2.73,0.73,2.40,{f:FA,n:2,soldier:true});win('S',-3.03,-2.39,0.77,2.36,{f:FA,n:1,soldier:true});
win('W',1.01,2.36,0.74,2.41,{f:FA,n:2,soldier:true});win('W',3.33,7.27,0.0,2.80,{f:FA,n:4});
win('N',0.8,2.8,0.9,2.25,{f:FA,n:2,soldier:true});
B(-3.95,-3.89,-0.17,1.88,1.09,2.19,M.door);win('E',1.09,2.19,1.93,2.40,{f:FA,n:1});B(-3.93,-3.89,1.88,1.93,1.09,2.19,M.frame);
/* Altbau: Fenster nach EG- und OG-Plan sowie Ansichten Ost und West */
/* Süd OG nach OG-Plan (Kind I); EG-Südwand zum neuen Eingang ohne Fenster (bestätigt, Ansicht Süd ist alter Stand) */
win('S',-5.67,-4.22,3.98,5.50,{f:FO,n:2,sill:true});
win('E',3.90,5.90,0.90,2.40,{f:FO,n:3,sill:true});win('E',3.90,5.90,4.00,5.50,{f:FO,n:3,sill:true});win('E',8.60,10.60,4.00,5.50,{f:FO,n:3,sill:true});
[[3.21,3.84,0.90,2.40],[5.96,6.59,0.90,2.40],[3.21,3.84,4.00,5.50],[5.96,6.59,4.00,5.50],[7.90,8.54,4.00,5.50],[10.66,11.29,4.00,5.50]].forEach(([a,b,y0,y1])=>B(ALT.x0-0.05,ALT.x0,y0,y1,a,b,M.shutter,1));
win('W',8.92,9.57,1.24,2.34,{f:FO,n:1,sill:true});win('W',9.97,10.62,1.24,2.34,{f:FO,n:1,sill:true});win('W',8.92,9.57,4.34,5.44,{f:FO,n:1,sill:true});win('W',9.97,10.62,4.34,5.44,{f:FO,n:1,sill:true});win('W',3.92,5.25,3.98,5.50,{f:FO,n:2,sill:true});
/* Nord: im EG nur der Nebeneingang, im OG keine Fenster (EG- und OG-Plan) */
B(ALT.x0+4.39,ALT.x0+5.44,0.34,2.39,ALT.z1,ALT.z1+0.06,M.door);win('N',-2.83,-1.78,2.0,2.39,{f:FO,n:1});
win('E',8.00,8.71,0.90,2.40,{f:FE,n:1});win('E',9.00,10.24,0.90,2.40,{f:FE,n:2});win('E',10.50,11.20,0.90,2.40,{f:FE,n:1});
/* Kellerfenster Ost; West: Kelleraußentreppe (EG-Plan) mit Geländer und Abdach */
win('E',3.94,5.18,-0.60,-0.22,{f:FO,n:2});win('W',8.74,9.64,-0.50,-0.16,{f:FO,n:2});win('W',10.34,10.99,-0.50,-0.16,{f:FO,n:1});
B(0.95,1.05,-2.7,G+0.04,8.58,11.32,M.beton);B(0,1.05,-2.7,G+0.04,8.53,8.63,M.beton);B(0,1.05,-2.7,G+0.04,11.27,11.32,M.beton);B(0,0.95,-2.75,-2.6,8.63,9.77,M.beton);
for(let k=0;k<8;k++){const z=9.77+k*0.1875;B(0,0.95,-2.75,-2.6+(k+1)*0.2438,z,z+0.1875,M.beton);}
B(-0.02,0,-2.6,-0.6,8.75,9.6,M.door);
/* Abdach Kellerabgang: Stahl anthrazit, an der Westwand über den Fenstern */
B(0,1.25,2.50,2.56,8.45,11.45,M.cplate);B(1.19,1.25,2.42,2.56,8.45,11.45,M.cfascia);[8.6,11.3].forEach(z=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,1.4,6),M.canopy);r.position.set(0.62,2.88,z);r.rotation.z=Math.PI/2-Math.atan2(0.7,1.2);scene.add(r);});for(let z=8.63;z<=11.25;z+=0.19)B(0.89,0.91,G,G+0.92,z-0.01,z+0.01,M.frame);B(0.88,0.92,G+0.88,G+0.92,8.63,11.24,M.frame);B(0,0.9,G+0.88,G+0.92,8.62,8.66,M.frame);B(0,0.9,G+0.88,G+0.92,11.21,11.25,M.frame);
/* Haustür-Podest und Stufen, Nebeneingang Nord */
B(-4.85,-3.89,G,-0.17,0.99,2.38,M.paving,1);B(-5.15,-4.85,G,-0.33,0.99,2.38,M.paving,1);B(-5.45,-5.15,G,-0.49,0.99,2.38,M.paving,1);
/* Nebeneingang Nord (EG-Plan): Podest vor der Tür, vier Stufen nach Osten */
B(-3.12,-1.39,G,0.22,12.0,13.3,M.paving,1);[[-3.37,0.0],[-3.63,-0.17],[-3.90,-0.33],[-4.12,-0.49]].forEach(([x,h],i)=>B(x,i?x+0.27:-3.12,G,h,12.0,13.3,M.paving,1));
[-4.08,-2.75,-1.43].forEach(x=>B(x-0.02,x+0.02,x<-3.2?-0.49:0.22,1.14,13.25,13.29,M.frame));B(-4.1,-1.41,1.10,1.14,13.25,13.29,M.frame);
/* Abdach Nebeneingang über Podest und Stufen */
B(-4.25,-1.38,2.56,2.64,12.0,13.5,M.cplate);B(-4.25,-1.38,2.48,2.64,13.44,13.5,M.cfascia);[-3.9,-1.7].forEach(x=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,1.55,6),M.canopy);r.position.set(x,2.97,12.72);r.rotation.x=-Math.atan2(1.44,0.66);scene.add(r);});
/* Wärmepumpe (EG-Plan) */
B(-1.31,-0.10,G,G+1.0,12.07,12.58,M.wp);B(-1.2,-0.62,G+0.25,G+0.85,12.58,12.585,M.frame);

function F_(v){return v;}
/* Terrasse vor der Glasfront (West), gemauert, mit Stufen und Hochbeet */
B(4.0,7.2,G,-0.21,2.73,8.47,M.brick,1);B(4.0,7.2,-0.21,-0.17,2.73,8.47,M.paving,1);B(7.2,7.5,G,-0.33,2.73,8.47,M.paving,1);B(7.5,7.8,G,-0.49,2.73,8.47,M.paving,1);
B(4.0,7.2,G,-0.17,-0.27,2.73,M.paving,1);B(4.0,7.6,G,0.05,8.47,9.1,M.brick,1);
for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(.15,.28),0),M.plant);s.position.set(rnd(4.2,7.4),0.1+rnd(0,.15),rnd(8.55,9.0));s.castShadow=true;scene.add(s);}
/* Dach: Walmdach, Traufe 5,97 m, First 10,78 m (Ansicht Süd), Überstand 0,78 m */
const roofG=new THREE.Group();scene.add(roofG);
(function(){const ov=0.78,x0=ALT.x0-ov,x1=ALT.x1+ov,z0=ALT.z0-ov,z1=ALT.z1+ov,ye=EAVE+0.2,yr=10.78,hw=(x1-x0)/2,xc=(x0+x1)/2,zr0=5.33,zr1=9.12; /* First 3,79 m lang (Ansichten Ost und West) */
  const v=[[x0,ye,z0],[x1,ye,z0],[x1,ye,z1],[x0,ye,z1],[xc,yr,zr0],[xc,yr,zr1]];
  const faces=[[0,1,4],[1,2,5],[1,5,4],[2,3,5],[3,0,4],[3,4,5]];
  const pos=[],uv=[];faces.forEach(f=>f.forEach(i=>{const p=v[i];pos.push(...p);uv.push(p[0]+p[2]*0.7,p[1]*1.35);}));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv.map(x=>x/2.2),2));g.computeVertexNormals();
  const m=new THREE.Mesh(g,M.roof);m.castShadow=m.receiveShadow=true;roofG.add(m);
  /* Dachrinne */
  [[x0,x1,z0,z0],[x0,x1,z1,z1],[x0,x0,z0,z1],[x1,x1,z0,z1]].forEach(([a,b,c,d])=>B(Math.min(a,b)-0.06,Math.max(a,b)+0.06,ye-0.1,ye,Math.min(c,d)-0.06,Math.max(c,d)+0.06,M.zinc,null,roofG));})();
/* Gauben (DG-Plan): Süd = Bad, Nord = Abstell/Ankleide, Ost = Schlafen, West = Treppe; Oberkante 8,85 m */
const TOPD=8.85,gaub=[];
function dormer(x0,x1,z0,z1,face,wins){const g=new THREE.Group();roofG.add(g);
  const b=B(x0,x1,EAVE+0.2,TOPD,z0,z1,M.dormer,1,g);gaub.push(b);B(x0-0.15,x1+0.15,TOPD,TOPD+0.12,z0-0.15,z1+0.15,M.zinc,null,g);
  wins.forEach(w=>{const f={S:{S:z0},N:{N:z1},E:{E:x0},W:{W:x1}}[face];g.add(win(face,w[0],w[1],w[2],w[3],{f,n:w[4]||2,sill:true}));});
  return g;}
dormer(-4.62,-2.43,ALT.z0,ALT.z0+1.4,'S',[[-4.16,-3.05,7.05,8.41,2]]);
/* Nordgaube über dem Nebeneingang: gleiche Größe wie die Südgaube (Angabe Bauherr, DG-Plan Entwurf II zeigt noch die breite Gaube) */
/* Bauamt: Nordgaube wegen Grenzabstand 0,50 m hinter die Außenwand zurückgesetzt. Dachfläche liegt dort bei ca. 7,65 m, daher Fenster niedriger */
/* Plan: Gaubenhöhe bleibt, Fensterbank so tief wie möglich (knapp über dem Dachanschluss), Fenster dafür breiter; innen entsteht eine tiefe Fensterbank */
dormer(-4.62,-2.43,ALT.z1-0.5-1.4,ALT.z1-0.5,'N',[[-4.32,-2.73,7.78,8.66,2]]);
dormer(ALT.x0,ALT.x0+1.77,4.81,9.60,'E',[[5.74,6.84,7.05,8.39,2],[7.56,8.66,7.05,8.39,2]]);
dormer(ALT.x1-1.6,ALT.x1,5.86,8.86,'W',[[6.56,8.16,7.03,8.42,3]]);
/* Bäume als Maßstab */
function tree(x,z,h){const t=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.18,h*0.45,8),M.trunk);t.position.set(x,G+h*0.22,z);t.castShadow=true;scene.add(t);
  for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(h*.14,h*.22),1),M.plant);s.position.set(x+rnd(-h*.18,h*.18),G+h*rnd(.55,.85),z+rnd(-h*.18,h*.18));s.castShadow=true;scene.add(s);}}
tree(-14,-7,9);tree(-22,15,8);tree(10.5,13,7);
/* Höhenkoten am Haus (Maßstab) */
function label(text){const c=document.createElement('canvas');c.width=300;c.height=80;const g=c.getContext('2d');g.fillStyle='rgba(255,255,255,.94)';g.fillRect(2,2,296,76);g.strokeStyle='#1c201e';g.lineWidth=3;g.strokeRect(2,2,296,76);
  g.fillStyle='#1c201e';g.font='600 34px "IBM Plex Mono", ui-monospace, monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(text,150,42);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));s.scale.set(1.9,0.5,1);s.renderOrder=5;return s;}
const marks=new THREE.Group();scene.add(marks);
[[-9.6,10.78-G,'First +11,43'],[-9.6,EAVE-G,'Traufe +6,42'],[-9.6,ATT-G+0.0,'Attika +3,82']].forEach(([x,yy,t],i)=>{
  const z=-1.2,y=yy+G;const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x+0.6,y,z),new THREE.Vector3(x+2.2,y,z)]),new THREE.LineBasicMaterial({color:'#1c201e'}));marks.add(l);
  const s=label(t);s.position.set(x-0.4,y,z);marks.add(s);});
const vl=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-8.4,G,-1.2),new THREE.Vector3(-8.4,10.78,-1.2)]),new THREE.LineBasicMaterial({color:'#1c201e'}));marks.add(vl);
/* Licht */
scene.add(new THREE.HemisphereLight('#f4f7fb','#b9b19f',0.6));
const sun=new THREE.DirectionalLight('#fff1dc',1.25);sun.position.set(14,20,-18);sun.target.position.set(-2,2,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:80});sun.shadow.bias=-0.0005;scene.add(sun);scene.add(sun.target);
/* Ansichten: Süden liegt im Plan oben (z negativ) */
const C={sw:[[16,9,-17],[-2,3.5,5]],s:[[-2,4.5,-26],[-2,4.5,5]],n:[[-2,4.5,36],[-2,4.5,5]],o:[[-34,4.5,5],[-2,4.5,5]],w:[[30,4.5,5],[-2,4.5,5]],ne:[[-18,10,26],[-2,3.5,5]]};
let anim=null;function view(k,instant){const [p,t]=C[k];if(instant){camera.position.set(...p);controls.target.set(...t);return;}anim={p0:camera.position.clone(),t0:controls.target.clone(),p1:new THREE.Vector3(...p),t1:new THREE.Vector3(...t),s:performance.now()};}
view('sw',true);
function resize(){renderer.setSize(W(),H(),false);camera.aspect=W()/H();camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
const RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
(function loop(now){requestAnimationFrame(loop);if(anim){let k=RM?1:Math.min(1,(now-anim.s)/900);k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;camera.position.lerpVectors(anim.p0,anim.p1,k);controls.target.lerpVectors(anim.t0,anim.t1,k);if(k>=1)anim=null;}
  controls.update();renderer.render(scene,camera);})(0);
/* Bedienung */
function seg(id,fn){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b.dataset.v);}));}
seg('h-view',v=>view(v));
seg('h-brick',v=>{M.brick.map=brick[v].w;M.soldier.map=brick[v].s;M.brick.needsUpdate=M.soldier.needsUpdate=true;});
/* Abdächer: Stahl anthrazit | Glas auf Stahlträgern | Holz (Lärche) */
const CAN={stahl:{p:{color:'#3a3e41',opacity:1,map:null,metalness:.3,roughness:.45},f:{color:'#3a3e41',map:null}},glas:{p:{color:'#d4e6ec',opacity:.38,map:null,metalness:.1,roughness:.05},f:{color:'#3a3e41',map:null}},holz:{p:{color:'#ffffff',opacity:1,map:woodT,metalness:0,roughness:.8},f:{color:'#ffffff',map:woodT}}};
seg('h-canopy',v=>{const c=CAN[v];['opacity','map','metalness','roughness'].forEach(k=>M.cplate[k]=c.p[k]);M.cplate.transparent=c.p.opacity<1;M.cplate.color.set(c.p.color);M.cfascia.color.set(c.f.color);M.cfascia.map=c.f.map;M.cplate.needsUpdate=M.cfascia.needsUpdate=true;});
seg('h-frame',v=>{M.frame.color.set(v==='holz'?'#b0814e':'#3d4144');M.door.color.set(v==='holz'?'#b0814e':'#3d4144');});
})();
