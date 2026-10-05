/* Map, panel, explorer, zoom/pan, export, share. */
const hexPts=(x,y,R)=>[0,1,2,3,4,5].map(i=>{const a=Math.PI/180*(60*i-30);return(x+R*Math.cos(a)).toFixed(1)+','+(y+R*Math.sin(a)).toFixed(1)}).join(' ');
const pos=(d,R=26)=>{const W=R*1.732;return[d.c*W+(d.r%2)*W/2+W,d.r*R*1.5+R+4]};
(()=>{
const svg=$('#map'),g=$('#mg'),M=Object.fromEntries(D.map(d=>[d.id,d]));let sel=null,q='',dv='',z={k:1,x:0,y:0},drag=false;
const COL=['#2563EB','#3B82F6','#60A5FA','#22C55E','#4ADE80','#F59E0B','#93C5FD','#0F172A'];
$('#art').innerHTML=D.map(d=>{const[x,y]=pos(d);return`<polygon points="${hexPts(x,y,23)}" fill="${COL[DIVS.indexOf(d.dv)]}" style="animation-delay:${(d.r+d.c)*50}ms"/>`}).join('');
g.innerHTML=D.map(d=>{const[x,y]=pos(d);return`<g class="d" tabindex="0" role="button" data-id="${d.id}" aria-label="${d.n}, ${d.dv} division"><polygon points="${hexPts(x,y,24.5)}"/><text x="${x}" y="${y+2.5}">${d.n.slice(0,3)}</text><title>${d.n}</title></g>`}).join('');
const match=d=>d.n.toLowerCase().includes(q)&&(!dv||d.dv==dv);
const paint=()=>$$('.d',g).forEach(e=>{const s=get(e.dataset.id),c=e.classList;c.toggle('v',!!s.v);c.toggle('w',!!s.w&&!s.v);c.toggle('f',!!s.f);c.toggle('sel',e.dataset.id==sel);c.toggle('dim',!match(M[e.dataset.id]))});
const list=()=>{$('#list').innerHTML=D.filter(match).map(d=>{const s=get(d.id);return`<button class="item" data-id="${d.id}"><b>${d.n}</b><small>${d.dv}</small><span>${s.v?'✓ ':''}${s.w?'☆ ':''}${s.f?'♥':''}</span></button>`}).join('')||'<p class="mut">No districts found.</p>'};
const act=()=>{const a=D.filter(d=>get(d.id).ts).sort((a,b)=>get(b.id).ts-get(a.id).ts).slice(0,5);
$('#act').innerHTML=a.map(d=>{const s=get(d.id);return`<li>${s.v?'Visited':s.w?'Wishlisted':'Updated'} <b>${d.n}</b> <small>${new Date(s.ts).toLocaleDateString()}</small></li>`}).join('')||'<li class="mut">No activity yet.</li>'};
const refresh=()=>{paint();list();act()};
function select(id){sel=id;const d=M[id],s=get(id);$('#ph').hidden=true;$('#pf').hidden=false;$('#pn').textContent=d.n;$('#pd').textContent=d.dv+' Division';
$('#fv').checked=!!s.v;$('#fw').checked=!!s.w;$('#ff').checked=!!s.f;$('#ft').value=s.t||'';$('#fn').value=s.n||'';paint()}
g.addEventListener('click',e=>{const d=e.target.closest('.d');if(d&&!drag)select(d.dataset.id)});
g.addEventListener('keydown',e=>{const d=e.target.closest('.d');if(d&&(e.key=='Enter'||e.key==' ')){e.preventDefault();select(d.dataset.id)}});
$('#list').onclick=e=>{const b=e.target.closest('.item');if(b){select(b.dataset.id);$('#map').scrollIntoView({behavior:'smooth',block:'center'})}};
$('#pf').onsubmit=e=>{e.preventDefault();const b=badges().filter(x=>x.ok).length;
put(sel,{v:$('#fv').checked,w:$('#fw').checked,f:$('#ff').checked,t:$('#ft').value,n:$('#fn').value.trim(),ts:Date.now()});
toast(M[sel].n+' saved');const a=badges().filter(x=>x.ok);if(a.length>b)toast('🏅 Badge unlocked: '+a[a.length-1].n)};
$('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();refresh()};
$('#dv').innerHTML='<option value="">All divisions</option>'+DIVS.map(x=>`<option>${x}</option>`).join('');
$('#dv').onchange=e=>{dv=e.target.value;refresh()};
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&sel){sel=null;$('#pf').hidden=true;$('#ph').hidden=false;paint()}});
const ap=()=>g.style.transform=`translate(${z.x}px,${z.y}px) scale(${z.k})`;
const zoom=f=>{const k=Math.min(4,Math.max(1,z.k*f)),r=k/z.k;z.x=235-(235-z.x)*r;z.y=230-(230-z.y)*r;z.k=k;if(k==1)z.x=z.y=0;ap()};
svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.15:.87)},{passive:false});
let p=null;svg.onpointerdown=e=>{p={x:e.clientX,y:e.clientY};drag=false};
svg.onpointermove=e=>{if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;
if(!drag&&Math.hypot(dx,dy)>5){drag=true;svg.setPointerCapture(e.pointerId)}
if(drag&&z.k>1){const f=470/svg.clientWidth;z.x+=dx*f;z.y+=dy*f;p={x:e.clientX,y:e.clientY};ap()}};
svg.onpointerup=svg.onpointercancel=()=>{p=null;setTimeout(()=>drag=false)};
$('#zi').onclick=()=>zoom(1.3);$('#zo').onclick=()=>zoom(.77);$('#zr').onclick=()=>{z={k:1,x:0,y:0};ap()};
const lib=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>no();document.head.append(s)});
const snap=async()=>{toast('Preparing image…');try{await lib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
return await html2canvas($('#mapCard'),{backgroundColor:getComputedStyle(document.body).backgroundColor,scale:2})}catch(e){toast('Export needs an internet connection the first time')}};
const dl=(url,n)=>{const a=document.createElement('a');a.href=url;a.download=n;a.click()};
$('#xp').onclick=async()=>{const c=await snap();c&&dl(c.toDataURL('image/png'),'mapmybangladesh.png')};
$('#xj').onclick=async()=>{const c=await snap();c&&dl(c.toDataURL('image/jpeg',.92),'mapmybangladesh.jpg')};
$('#xf').onclick=async()=>{const c=await snap();if(!c)return;try{await lib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
const P=new jspdf.jsPDF({orientation:c.width>c.height?'l':'p',unit:'px',format:[c.width/2,c.height/2]});P.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,c.width/2,c.height/2);P.save('mapmybangladesh.pdf')}catch(e){toast('PDF export failed')}};
$('#xs').onclick=async()=>{const c=await snap();if(!c)return;c.toBlob(async b=>{const f=new File([b],'mapmybangladesh.png',{type:'image/png'});
if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'My Bangladesh travel map'})}catch(e){}}else{dl(URL.createObjectURL(b),f.name);toast('Sharing unsupported — image downloaded')}})};
$('#xl').onclick=async()=>{const ids=D.map((d,i)=>get(d.id).v?i.toString(36):'').filter(Boolean).join('.');
const u=location.href.split('#')[0]+'#v='+ids;try{await navigator.clipboard.writeText(u);toast('Link copied')}catch(e){prompt('Copy your link',u)}};
if(location.hash.startsWith('#v=')&&!D.some(d=>get(d.id).v)){location.hash.slice(3).split('.').forEach(i=>D[parseInt(i,36)]&&(state.d[D[parseInt(i,36)].id]={v:true,ts:Date.now()}));save();toast('Shared map loaded')}
addEventListener('mmb',refresh);refresh();
setTimeout(()=>$('#skel').remove(),450);
})();
