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
state.lang=state.lang||'bn';
const T={home:['হোম','Home'],map:['ম্যাপ','Map'],explorer:['জেলা','Districts'],stats:['পরিসংখ্যান','Statistics'],about:['পরিচিতি','About'],settings:['সেটিংস','Settings'],
heroChip:['৬৪ জেলা · ৮ বিভাগ','64 districts · 8 divisions'],heroH:['প্রতিটি জেলায় আপনার <span class="grad">পদচিহ্ন</span>','Track every district <span class="grad">you explore</span>'],
heroP:['যেসব জেলায় গিয়েছেন মানচিত্রে চিহ্নিত করুন, নোট ও তারিখ যোগ করুন, আর আপনার ভ্রমণের সুন্দর ছবি শেয়ার করুন।','Mark the districts you have visited, add notes and dates, and share a beautiful picture of your journey.'],
cta:['জেলা বাছাই শুরু করুন ↓','Start mapping ↓'],s1:['জেলা বাছাই করুন','Pick districts'],s2:['থিম বেছে নিন','Choose a theme'],s3:['PNG, JPG বা PDF নামান','Download PNG, JPG or PDF'],
vis:['ভ্রমণ করা','Visited'],rem:['বাকি','Remaining'],comp:['সম্পন্ন','Complete'],mine:['যেসব জেলায় গিয়েছি','Districts I\'ve visited'],searchPh:['জেলা খুঁজুন…','Search districts…'],
selAll:['সব বাছাই','Select all'],gAll:['সব বাছাই করুন','Select all'],clr:['সব মুছুন','Clear all'],allDiv:['সব বিভাগ','All divisions'],none:['কোনো জেলা পাওয়া যায়নি','No districts found.'],
themeL:['থিম','Theme'],photo:['ছবি বদলান','Change photo'],namePh:['আপনার নাম (ঐচ্ছিক)','Your name (optional)'],showNames:['জেলার নাম','District names'],
kick:['বাংলাদেশ ভ্রমণ ম্যাপ','Bangladesh travel map'],mtitle:['আমার বাংলাদেশ','My Bangladesh'],explored:['বাংলাদেশ ঘোরা হয়েছে','of Bangladesh explored'],
lv:['ঘোরা','Visited'],lw:['ইচ্ছাতালিকা','Wishlist'],lf:['প্রিয়','Favorite'],ln:['বাকি','Not yet'],dlT:['আপনার ম্যাপ ডাউনলোড করুন','Download your map'],shareImg:['ছবি শেয়ার','Share image'],copyL:['লিংক কপি','Copy link'],
tip:['টিপস: ম্যাপের জেলায় ক্লিক করেও বাছাই করতে পারেন।','Tip: click a district on the map to mark it.'],pph:['জেলা বাছাই করলে এখানে নোট ও তারিখ যোগ করতে পারবেন।','Pick a district to add notes and a date.'],
fv:['ঘুরেছি','Visited'],fw:['যেতে চাই','Wishlist'],ff:['প্রিয়','Favorite'],fd:['ভ্রমণের তারিখ','Travel date'],fnn:['ভ্রমণের নোট','Travel notes'],save:['সংরক্ষণ','Save'],recent:['সাম্প্রতিক কার্যকলাপ','Recent activity'],
foot:['আপনার তথ্য শুধু আপনার ব্রাউজারেই থাকে।','Your data stays in this browser.'],noact:['এখনও কিছু নেই।','No activity yet.'],saved:['সংরক্ষিত হয়েছে','saved'],
av:['ঘুরেছেন','Visited'],aw:['ইচ্ছাতালিকায়','Wishlisted'],au:['হালনাগাদ','Updated']};
const t=k=>T[k][state.lang=='bn'?0:1];
const nb=n=>state.lang=='bn'?String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]):String(n);
const nm=d=>state.lang=='bn'?d.bn:d.n,dvn=x=>state.lang=='bn'?DIVBN[x]:x;
const applyLang=()=>{document.documentElement.lang=state.lang;$$('[data-t]').forEach(e=>e.innerHTML=t(e.dataset.t));$$('[data-tp]').forEach(e=>e.placeholder=t(e.dataset.tp))};
const toast=m=>{let b=$('#toasts');if(!b){b=document.createElement('div');b.id='toasts';b.setAttribute('aria-live','polite');document.body.append(b)}
const t=document.createElement('div');t.className='toast';t.textContent=m;b.append(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},2600)};
const countUp=(el,to,suf='')=>{const f=+el.dataset.v||0,t0=performance.now();el.dataset.v=to;
const s=n=>{const k=Math.min(1,(n-t0)/700),e=1-Math.pow(1-k,3);el.textContent=nb(Math.round(f+(to-f)*e))+suf;k<1&&requestAnimationFrame(s)};requestAnimationFrame(s)};
const badges=()=>{const v=D.filter(d=>get(d.id).v),n=v.length,by=x=>v.filter(d=>d.dv==x).length,all=DIVS.every(x=>by(x)>0);
return[['First District','Mark your first district',n>=1],['10 Districts','Visit 10 districts',n>=10],['25 Districts','Visit 25 districts',n>=25],['50 Districts','Visit 50 districts',n>=50],['All 64 Districts','Complete Bangladesh',n==64],['Explorer','Visit every division',all],['Master Explorer','Complete a whole division',DIVS.some(x=>by(x)==DIVN[x])],['Legend','Reach 90% (58 districts)',n>=58]].map(([n,d,ok])=>({n,d,ok}))};
const sync=()=>{const s=stat();
$$('[data-stat]').forEach(e=>{const k=e.dataset.stat;countUp(e,k=='pct'?s.p:s[k=='visited'?'v':'r'],k=='pct'?'%':'')});
$$('[data-ring]').forEach(e=>e.style.strokeDashoffset=326.7*(1-s.p/100));
$$('[data-bar]').forEach(e=>e.style.width=s.p+'%')};
addEventListener('mmb',sync);
const NAV=[['home','index.html'],['map','index.html#map'],['explorer','index.html#explorer'],['stats','statistics.html'],['about','about.html'],['settings','settings.html']];
const hdr=()=>{const cur=location.pathname.split('/').pop()||'index.html';
$('#top').innerHTML=`<a class="logo" href="index.html"><img src="assets/svg/favicon.svg" alt="" width="28" height="28">MapMyBangladesh</a><nav aria-label="Main">${NAV.map(([n,u])=>`<a href="${u}" ${u==cur?'aria-current="page"':''}>${t(n)}</a>`).join('')}</nav><button class="btn icon" id="lg" aria-label="Language">${state.lang=='bn'?'EN':'বাং'}</button><button class="btn icon" id="tt" aria-label="Toggle dark mode">◐</button>`;
$('#tt').onclick=()=>{theme(document.documentElement.dataset.theme=='dark'?'light':'dark');save()};
$('#lg').onclick=()=>{state.lang=state.lang=='bn'?'en':'bn';save();hdr();applyLang()}};
document.addEventListener('DOMContentLoaded',()=>{hdr();applyLang();sync();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
});
document.addEventListener('click',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');
s.className='rp';s.style.cssText=`left:${e.clientX-r.left}px;top:${e.clientY-r.top}px`;b.append(s);setTimeout(()=>s.remove(),600)});
