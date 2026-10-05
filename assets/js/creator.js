/* "Made by" footer + creator modal. Edit CREATOR below — nothing else needs to change. */
const CREATOR={
  name:{bn:'আপনার নাম',en:'Your Name'},
  role:{bn:'ডিজাইনার · ভ্রমণপ্রেমী',en:'Designer · Travel lover'},
  bio:{bn:'এই অ্যাপটি শখের বশে বানানো। ঘুরতে ভালোবাসি, তাই নিজের ভ্রমণের ম্যাপ বানাতে গিয়েই আইডিয়াটা এসেছে।',
       en:'I built this app out of passion. I love to travel, and the idea came while making a map of my own journeys.'},
  photo:'assets/images/creator.jpg',            /* put your photo here (square works best) */
  links:[['Facebook','https://facebook.com/'],['Instagram','https://instagram.com/'],['Portfolio','https://example.com/']]
};
document.addEventListener('DOMContentLoaded',()=>{
const L=o=>o[state.lang=='bn'?'bn':'en'],esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let f=$('footer');if(!f){f=document.createElement('footer');document.body.append(f)}
const dlg=document.createElement('dialog');dlg.id='cm';dlg.setAttribute('aria-labelledby','cmn');document.body.append(dlg);
const render=()=>{
 f.innerHTML=`<div>${state.lang=='bn'?'তৈরি করেছেন':'Made by'} <button class="lnk mb" id="mb">${esc(L(CREATOR.name))}</button></div><small>${state.lang=='bn'?'আপনার তথ্য শুধু আপনার ব্রাউজারেই থাকে।':'Your data stays in this browser.'} · Boundaries © geoBoundaries, CC BY 4.0</small>`;
 const ini=esc(L(CREATOR.name).trim().charAt(0));
 dlg.innerHTML=`<button class="x" id="cx" aria-label="Close">×</button><div class="ph"><img src="${CREATOR.photo}" alt="" onerror="this.remove()"><span>${ini}</span></div><div class="cb"><h2 id="cmn">${esc(L(CREATOR.name))}</h2><small>${esc(L(CREATOR.role))}</small><p>${esc(L(CREATOR.bio))}</p><b>${state.lang=='bn'?'যুক্ত থাকুন':'Connect'}</b><div class="soc">${CREATOR.links.map(([n,u])=>`<a class="btn" target="_blank" rel="noopener" href="${esc(u)}">${esc(n)}</a>`).join('')}</div></div>`;
 $('#mb').onclick=()=>dlg.showModal();$('#cx').onclick=()=>dlg.close()};
dlg.addEventListener('click',e=>{if(e.target==dlg)dlg.close()});
render();addEventListener('mmb',render);
});
