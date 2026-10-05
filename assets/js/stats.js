const fmt=s=>s.t?new Date(s.t+'T00:00').toLocaleDateString(undefined,{dateStyle:'medium'}):new Date(s.ts||0).toLocaleDateString(undefined,{dateStyle:'medium'});
function render(){
const v=D.filter(d=>get(d.id).v),tot=x=>DIVN[x],by=DIVS.map(x=>({x,n:v.filter(d=>d.dv==x).length,t:tot(x)}));
$('#brk').innerHTML=by.map(b=>`<div class="row"><span>${dvn(b.x)}</span><div class="bar"><i style="width:${b.n/b.t*100}%"></i></div><small>${b.n}/${b.t}</small></div>`).join('');
const top=[...by].sort((a,b)=>b.n-a.n)[0];$('#top1').textContent=top.n?`${dvn(top.x)} (${nb(top.n)})`:'—';
const rec=[...v].sort((a,b)=>(get(b.id).ts||0)-(get(a.id).ts||0));
$('#rec').innerHTML=rec.slice(0,5).map(d=>`<li><b>${nm(d)}</b> <small>${dvn(d.dv)}</small></li>`).join('')||'<li class="mut">Nothing yet — visit the map.</li>';
$('#tl').innerHTML=[...v].sort((a,b)=>(get(b.id).t||'').localeCompare(get(a.id).t||'')||(get(b.id).ts||0)-(get(a.id).ts||0)).map(d=>`<li><time>${fmt(get(d.id))}</time><b>${nm(d)}</b>${get(d.id).n?`<p>${get(d.id).n.replace(/</g,'&lt;')}</p>`:''}</li>`).join('')||'<li class="mut">Your timeline will appear here.</li>';
$('#bdg').innerHTML=badges().map(b=>`<div class="badge ${b.ok?'on':''}"><span>${b.ok?'🏅':'🔒'}</span><b>${b.n}</b><small>${b.d}</small></div>`).join('')}
addEventListener('mmb',render);render();
