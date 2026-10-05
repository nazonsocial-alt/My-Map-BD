/* Tracker: real district map, sidebar chips, themes, profile card, panel, zoom/pan, export. */
(()=>{
const svg=$('#map'),g=$('#mg'),lb=$('#lb'),card=$('#mapCard'),M=Object.fromEntries(D.map(d=>[d.id,d])),[VW,VH]=GEO_VB;
let sel=null,q='',dv='',z={k:1,x:0,y:0},drag=false;
svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);
$('#heroMap').setAttribute('viewBox',`0 0 ${VW} ${VH}`);
$('#heroMap').innerHTML=D.map(d=>`<path d="${GEO[d.id].p}"/>`).join('');
g.innerHTML=D.map(d=>`<g class="d" tabindex="0" role="button" data-id="${d.id}"><path d="${GEO[d.id].p}"/></g>`).join('');
lb.innerHTML=D.map(d=>`<text data-id="${d.id}" x="${GEO[d.id].c[0]}" y="${GEO[d.id].c[1]+2}"></text>`).join('');
/* Themes */
const TH=[['#EEF4FB','#D3DEEC','#2563EB',0],['#0F172A','#25314A','#60A5FA',1],['#FFF1EC','#F2D8CD','#EA580C',0],['#ECF8F0','#CDE5D4','#16A34A',0],['#18181B','#2F2F35','#22C55E',1]];
const setTh=i=>{const[b,tl,v,dk]=TH[i];card.style.cssText=`--mbg:${b};--mtile:${tl};--mvis:${v};--mfg:${dk?'#F1F5F9':'#0F172A'};--mmut:${dk?'#94A3B8':'#64748B'}`;
$$('.sw').forEach((s,j)=>s.setAttribute('aria-pressed',j==i));state.mt=i};
$('#sws').innerHTML=TH.map((x,i)=>`<button class="sw" aria-label="Theme ${i+1}" style="background:linear-gradient(135deg,${x[0]} 50%,${x[2]} 50%)"></button>`).join('');
$$('.sw').forEach((s,i)=>s.onclick=()=>{setTh(i);save()});setTh(state.mt||0);
/* Profile: name + photo (resized, stored locally) */
const pimg=$('#pimg2'),pth=$('#pimg');if(state.photo)pimg.src=pth.src=state.photo;$('#un').value=state.name||'';
$('#un').oninput=e=>{state.name=e.target.value;localStorage[KEY]=JSON.stringify(state);card_()};
$('#pi').onchange=e=>{const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=200;const s=Math.min(im.width,im.height);
c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,200,200);state.photo=c.toDataURL('image/jpeg',.85);pimg.src=pth.src=state.photo;save()};im.src=URL.createObjectURL(f)};
$('#rp').onclick=()=>{delete state.photo;pimg.removeAttribute('src');pth.removeAttribute('src');save()};
$('#sn').onchange=e=>svg.classList.toggle('nolb',!e.target.checked);
/* Helpers */
const match=d=>(d.n.toLowerCase().includes(q)||d.bn.includes(q))&&(!dv||d.dv==dv);
const vis=()=>D.filter(d=>get(d.id).v);
const card_=()=>{const n=vis().length,p=Math.round(n/64*100),dc=DIVS.filter(x=>vis().some(d=>d.dv==x)).length;
$('#bc').textContent=nb(n);$('#kk').textContent=(state.name?state.name+' · ':'')+t('kick');pimg.hidden=!state.photo;pth.hidden=!state.photo;
$('#bar').style.width=p+'%';$('#pt').textContent=`${nb(p)}% ${t('explored')}`;
$('#ps').textContent=state.lang=='bn'?`${nb(n)}টি জেলা · ৮টির মধ্যে ${nb(dc)}টি বিভাগ`:`${n} districts · ${dc} of 8 divisions`};
const paint=()=>{$$('.d',g).forEach(e=>{const d=M[e.dataset.id],s=get(d.id),c=e.classList;c.toggle('v',!!s.v);c.toggle('w',!!s.w&&!s.v);c.toggle('f',!!s.f);c.toggle('sel',d.id==sel);c.toggle('dim',!match(d));
e.setAttribute('aria-label',nm(d)+', '+dvn(d.dv)+(s.v?' ✓':''));e.setAttribute('aria-pressed',!!s.v)});
$$('text',lb).forEach(e=>e.textContent=nm(M[e.dataset.id]))};
const side=()=>{$('#cnt').textContent=nb(vis().length)+' / '+nb(64);
$('#chips').innerHTML=DIVS.filter(x=>D.some(d=>d.dv==x&&match(d))).map(x=>{const L=D.filter(d=>d.dv==x),n=L.filter(d=>get(d.id).v).length;
return`<div class="grp"><div class="gh"><b>${dvn(x)}</b><small>${nb(n)}/${nb(L.length)}</small><button class="lnk" data-sa="${x}">${t('selAll')}</button></div><div class="cw">${L.filter(match).map(d=>`<button class="ch" aria-pressed="${!!get(d.id).v}" data-id="${d.id}">${nm(d)}</button>`).join('')}</div></div>`}).join('')||`<p class="mut">${t('none')}</p>`;
$('#dv').innerHTML=`<option value="">${t('allDiv')}</option>`+DIVS.map(x=>`<option value="${x}" ${x==dv?'selected':''}>${dvn(x)}</option>`).join('')};
const act=()=>{const a=D.filter(d=>get(d.id).ts).sort((a,b)=>get(b.id).ts-get(a.id).ts).slice(0,5);
$('#act').innerHTML=a.map(d=>{const s=get(d.id);return`<li>${t(s.v?'av':s.w?'aw':'au')} <b>${nm(d)}</b> <small>${new Date(s.ts).toLocaleDateString(state.lang=='bn'?'bn-BD':undefined)}</small></li>`}).join('')||`<li class="mut">${t('noact')}</li>`};
const refresh=()=>{paint();side();act();card_();if(sel)fill()};
function fill(){const d=M[sel],s=get(sel);$('#pph').hidden=true;$('#pf').hidden=false;$('#pn').textContent=nm(d);$('#pd').textContent=dvn(d.dv);
$('#fv').checked=!!s.v;$('#fw').checked=!!s.w;$('#ff').checked=!!s.f;$('#ft').value=s.t||'';$('#fn').value=s.n||''}
const unlocked=()=>badges().filter(x=>x.ok).length;
function toggle(id){const b=unlocked();sel=id;put(id,{v:!get(id).v,ts:Date.now()});const a=badges().filter(x=>x.ok);if(a.length>b)toast('🏅 '+a[a.length-1].n)}
g.addEventListener('click',e=>{const d=e.target.closest('.d');if(d&&!drag)toggle(d.dataset.id)});
g.addEventListener('keydown',e=>{const d=e.target.closest('.d');if(d&&(e.key=='Enter'||e.key==' ')){e.preventDefault();toggle(d.dataset.id)}});
$('#chips').onclick=e=>{const c=e.target.closest('.ch'),s=e.target.closest('[data-sa]');if(c)toggle(c.dataset.id);
if(s){D.filter(d=>d.dv==s.dataset.sa&&match(d)).forEach(d=>state.d[d.id]={...get(d.id),v:true,ts:Date.now()});save()}};
$('#sa').onclick=()=>{D.filter(match).forEach(d=>state.d[d.id]={...get(d.id),v:true,ts:Date.now()});save()};
$('#ca').onclick=()=>{if(confirm('?')){D.filter(match).forEach(d=>state.d[d.id]={...get(d.id),v:false});save()}};
$('#pf').onsubmit=e=>{e.preventDefault();const b=unlocked();
put(sel,{v:$('#fv').checked,w:$('#fw').checked,f:$('#ff').checked,t:$('#ft').value,n:$('#fn').value.trim(),ts:Date.now()});
toast(nm(M[sel])+' — '+t('saved'));const a=badges().filter(x=>x.ok);if(a.length>b)toast('🏅 '+a[a.length-1].n)};
$('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();refresh()};
$('#dv').onchange=e=>{dv=e.target.value;refresh()};
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&sel){sel=null;$('#pf').hidden=true;$('#pph').hidden=false;paint()}});
/* Zoom & pan */
const ap=()=>g.style.transform=lb.style.transform=`translate(${z.x}px,${z.y}px) scale(${z.k})`;
const zoom=f=>{const k=Math.min(5,Math.max(1,z.k*f)),r=k/z.k,cx=VW/2,cy=VH/2;z.x=cx-(cx-z.x)*r;z.y=cy-(cy-z.y)*r;z.k=k;if(k==1)z.x=z.y=0;ap()};
svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.15:.87)},{passive:false});
let p=null;svg.onpointerdown=e=>{p={x:e.clientX,y:e.clientY};drag=false};
svg.onpointermove=e=>{if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;
if(!drag&&Math.hypot(dx,dy)>5){drag=true;svg.setPointerCapture(e.pointerId)}
if(drag&&z.k>1){const f=VW/svg.clientWidth;z.x+=dx*f;z.y+=dy*f;p={x:e.clientX,y:e.clientY};ap()}};
svg.onpointerup=svg.onpointercancel=()=>{p=null;setTimeout(()=>drag=false)};
$('#zi').onclick=()=>zoom(1.3);$('#zo').onclick=()=>zoom(.77);$('#zr').onclick=()=>{z={k:1,x:0,y:0};ap()};
/* Export & share */
const lib=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>no();document.head.append(s)});
const snap=async()=>{toast('…');try{await lib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
return await html2canvas(card,{backgroundColor:null,scale:2})}catch(e){toast('Export needs an internet connection the first time')}};
const dl=(url,n)=>{const a=document.createElement('a');a.href=url;a.download=n;a.click()};
$('#xp').onclick=async()=>{const c=await snap();c&&dl(c.toDataURL('image/png'),'mapmybangladesh.png')};
$('#xj').onclick=async()=>{const c=await snap();c&&dl(c.toDataURL('image/jpeg',.92),'mapmybangladesh.jpg')};
$('#xf').onclick=async()=>{const c=await snap();if(!c)return;try{await lib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
const P=new jspdf.jsPDF({orientation:c.width>c.height?'l':'p',unit:'px',format:[c.width/2,c.height/2]});P.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,c.width/2,c.height/2);P.save('mapmybangladesh.pdf')}catch(e){toast('PDF export failed')}};
$('#xs').onclick=async()=>{const c=await snap();if(!c)return;c.toBlob(async b=>{const f=new File([b],'mapmybangladesh.png',{type:'image/png'});
if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'MapMyBangladesh'})}catch(e){}}else{dl(URL.createObjectURL(b),f.name);toast('Image downloaded')}})};
$('#xl').onclick=async()=>{const ids=D.map((d,i)=>get(d.id).v?i.toString(36):'').filter(Boolean).join('.');
const u=location.href.split('#')[0]+'#v='+ids;try{await navigator.clipboard.writeText(u);toast('✓')}catch(e){prompt('Link',u)}};
if(location.hash.startsWith('#v=')&&!vis().length){location.hash.slice(3).split('.').forEach(i=>D[parseInt(i,36)]&&(state.d[D[parseInt(i,36)].id]={v:true,ts:Date.now()}));save()}
addEventListener('mmb',refresh);
document.addEventListener('DOMContentLoaded',()=>{applyLang();refresh()});if(document.readyState!='loading'){applyLang();refresh()}
setTimeout(()=>$('#skel')&&$('#skel').remove(),450);
})();
