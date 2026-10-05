/* Core: store, theme, nav, toast, ripple, counters, badges. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='mmb:v1';let state;try{state=JSON.parse(localStorage[KEY])}catch(e){}
state=state||{};state.d=state.d||{};state.theme=state.theme||'system';
const save=()=>{localStorage[KEY]=JSON.stringify(state);dispatchEvent(new Event('mmb'))};
const get=id=>state.d[id]||{};
const put=(id,p)=>{state.d[id]={...get(id),...p};save()};
const stat=()=>{const v=D.filter(d=>get(d.id).v).length;return{v,r:64-v,p:Math.round(v/64*100)}};
const theme=t=>{state.theme=t;document.documentElement.dataset.theme=t=='dark'||(t=='system'&&matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'};
theme(state.theme);
const toast=m=>{let b=$('#toasts');if(!b){b=document.createElement('div');b.id='toasts';b.setAttribute('aria-live','polite');document.body.append(b)}
const t=document.createElement('div');t.className='toast';t.textContent=m;b.append(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},2600)};
const countUp=(el,to,suf='')=>{const f=+el.dataset.v||0,t0=performance.now();el.dataset.v=to;
const s=n=>{const k=Math.min(1,(n-t0)/700),e=1-Math.pow(1-k,3);el.textContent=Math.round(f+(to-f)*e)+suf;k<1&&requestAnimationFrame(s)};requestAnimationFrame(s)};
const badges=()=>{const v=D.filter(d=>get(d.id).v),n=v.length,by=x=>v.filter(d=>d.dv==x).length,all=DIVS.every(x=>by(x)>0);
return[['First District','Mark your first district',n>=1],['10 Districts','Visit 10 districts',n>=10],['25 Districts','Visit 25 districts',n>=25],['50 Districts','Visit 50 districts',n>=50],['All 64 Districts','Complete Bangladesh',n==64],['Explorer','Visit every division',all],['Master Explorer','Complete a whole division',DIVS.some(x=>by(x)==RAW[x].split('|').length)],['Legend','Reach 90% (58 districts)',n>=58]].map(([n,d,ok])=>({n,d,ok}))};
const sync=()=>{const s=stat();
$$('[data-stat]').forEach(e=>{const k=e.dataset.stat;countUp(e,k=='pct'?s.p:s[k=='visited'?'v':'r'],k=='pct'?'%':'')});
$$('[data-ring]').forEach(e=>e.style.strokeDashoffset=326.7*(1-s.p/100));
$$('[data-bar]').forEach(e=>e.style.width=s.p+'%')};
addEventListener('mmb',sync);
const NAV=[['Home','index.html'],['Map','index.html#map'],['Explorer','index.html#explorer'],['Statistics','statistics.html'],['About','about.html'],['Settings','settings.html']];
document.addEventListener('DOMContentLoaded',()=>{
const h=$('#top'),cur=location.pathname.split('/').pop()||'index.html';
h.innerHTML=`<a class="logo" href="index.html"><img src="assets/svg/favicon.svg" alt="" width="28" height="28">MapMyBangladesh</a><nav aria-label="Main">${NAV.map(([n,u])=>`<a href="${u}" ${u==cur?'aria-current="page"':''}>${n}</a>`).join('')}</nav><button class="btn icon" id="tt" aria-label="Toggle dark mode">◐</button>`;
$('#tt').onclick=()=>{theme(document.documentElement.dataset.theme=='dark'?'light':'dark');save()};
sync();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
});
document.addEventListener('click',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');
s.className='rp';s.style.cssText=`left:${e.clientX-r.left}px;top:${e.clientY-r.top}px`;b.append(s);setTimeout(()=>s.remove(),600)});
