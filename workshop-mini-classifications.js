/* Workshop Mini — Smart Sections (additive only)
   Adds quick classification panels without changing existing data structures.
*/
(function () {
  'use strict';

  const K = { c:'wf_c', d:'wf_d', r:'wf_r', p:'wf_p', m:'wf_m' };
  const read = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
  const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const activeOrder = r => !['مكتمل','مغلق','ملغي','مؤرشف'].includes(String(r.status || '').trim());
  const workshopDevice = d => ['تم السحب','استلام الورشة','تحت الإصلاح','جاهز للتسليم'].includes(String(d.workshopStatus || '').trim());
  const todayKey = d => { const x = new Date(d); if (isNaN(x)) return ''; return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
  const orderDateKey = r => todayKey(r.createdAt || r.date || r.visitDate || r.visit || '');
  const addressText = c => {
    const a = c?.mainAddress || {};
    return [a.center,a.village,a.street,a.address].filter(Boolean).join(' - ');
  };
  const customerName = id => (read(K.c).find(c => String(c.id) === String(id)) || {}).name || '—';
  const deviceLabel = id => { const d=read(K.d).find(x=>String(x.id)===String(id)); return d ? `${d.type || 'جهاز'} — ${d.brand || '—'}` : '—'; };

  function ensureStyle() {
    if (document.getElementById('mini-smart-sections-style')) return;
    const s = document.createElement('style'); s.id='mini-smart-sections-style';
    s.textContent = `
      .mini-smart-sections{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 12px}
      .mini-smart-card{border:1px solid #dfe5eb;background:#fff;border-radius:12px;padding:11px 8px;text-align:center;cursor:pointer;font-family:inherit;box-shadow:0 1px 4px #0000000a;transition:.15s}
      .mini-smart-card:hover{transform:translateY(-1px)}
      .mini-smart-card.active{outline:2px solid #17324d;background:#f3f6f8}
      .mini-smart-card .ico{font-size:24px;display:block;margin-bottom:3px}.mini-smart-card b{display:block;font-size:13px}.mini-smart-card small{display:block;margin-top:2px}
      .mini-smart-results{background:#fff;border-radius:12px;padding:10px;margin:8px 0;box-shadow:0 2px 10px #0000000d}
      .mini-smart-results-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}.mini-smart-results-head b{font-size:14px}
      .mini-smart-item{border:1px solid #e5e9ed;border-radius:10px;padding:9px;margin:7px 0}.mini-smart-item-top{display:flex;justify-content:space-between;gap:7px;align-items:center}.mini-smart-item a{color:inherit;text-decoration:none}.mini-smart-meta{font-size:12px;color:#687583;margin-top:4px}.mini-smart-actions{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.mini-smart-actions select{padding:6px 8px;font-size:12px;width:auto;min-width:130px}
      .mini-smart-hidden{display:none!important}
      @media(max-width:650px){.mini-smart-sections{grid-template-columns:repeat(2,1fr)}.mini-smart-card{padding:9px 6px}.mini-smart-card .ico{font-size:21px}.mini-smart-card b{font-size:12px}}
    `;
    document.head.appendChild(s);
  }

  function panelHtml(id, cards) {
    return `<section id="${id}" class="mini-smart-results mini-smart-hidden"><div class="mini-smart-results-head"><b id="${id}-title"></b><button type="button" class="secondary small-btn" id="${id}-close">إظهار الكل</button></div><div id="${id}-body"></div></section>`;
  }

  function setupSections(containerId, listId, cards, title) {
    const host=document.getElementById(containerId), list=document.getElementById(listId); if(!host||!list) return null;
    ensureStyle();
    host.innerHTML = `<div class="mini-smart-sections">${cards.map(c=>`<button type="button" class="mini-smart-card" data-mini-key="${esc(c.key)}"><span class="ico">${c.ico}</span><b>${esc(c.label)}</b><small>${c.count()}</small></button>`).join('')}</div>${panelHtml(containerId+'Results',cards)}`;
    const panel=document.getElementById(containerId+'Results'), body=document.getElementById(containerId+'Results-body'), ptitle=document.getElementById(containerId+'Results-title');
    const close=document.getElementById(containerId+'Results-close');
    const refreshCounts=()=>{cards.forEach(c=>{const b=host.querySelector(`[data-mini-key="${CSS.escape(c.key)}"] small`); if(b)b.textContent=c.count();});};
    function show(key){
      const c=cards.find(x=>x.key===key); if(!c)return;
      host.querySelectorAll('.mini-smart-card').forEach(b=>b.classList.toggle('active',b.dataset.miniKey===key));
      const search=(document.getElementById(listId.replace('List','Search'))?.value||'').trim().toLowerCase();
      const rows=c.rows(search);
      ptitle.textContent=`${c.ico} ${c.label} (${rows.length})`;
      body.innerHTML=rows.length?rows.map(c.render).join(''):`<div class="mini-smart-item">لا توجد بيانات في هذا القسم.</div>`;
      panel.classList.remove('mini-smart-hidden'); list.classList.add('mini-smart-hidden');
    }
    cards.forEach(c=>host.querySelector(`[data-mini-key="${CSS.escape(c.key)}"]`)?.addEventListener('click',()=>show(c.key)));
    close?.addEventListener('click',()=>{panel.classList.add('mini-smart-hidden');list.classList.remove('mini-smart-hidden');host.querySelectorAll('.mini-smart-card').forEach(b=>b.classList.remove('active'));});
    return {refreshCounts,show};
  }

  function customerCards(){
    const cs=read(K.c), ds=read(K.d), rs=read(K.r);
    const hasActive=c=>rs.some(r=>String(r.customerId)===String(c.id)&&activeOrder(r));
    const inWorkshop=c=>ds.some(d=>String(d.customerId)===String(c.id)&&workshopDevice(d));
    const searchFilter=(rows,q)=>!q?rows:rows.filter(c=>[c.name,c.phone,c.phone2,c.nickname,addressText(c)].filter(Boolean).join(' ').toLowerCase().includes(q));
    const render=c=>`<div class="mini-smart-item"><div class="mini-smart-item-top"><a href="customer.html?id=${encodeURIComponent(c.id)}"><b>👤 ${esc(c.name||'—')}</b></a><span class="badge">${ds.filter(d=>String(d.customerId)===String(c.id)).length} أجهزة</span></div><div class="mini-smart-meta">📞 ${esc(c.phone||'—')} • 📍 ${esc(addressText(c)||'—')}</div><div class="mini-smart-actions"><a class="primary small-btn" href="customer.html?id=${encodeURIComponent(c.id)}">فتح 360°</a></div></div>`;
    return [
      {key:'no-active',ico:'👤',label:'بدون أمر شغل فعال',count:()=>cs.filter(c=>!hasActive(c)).length,rows:q=>searchFilter(cs.filter(c=>!hasActive(c)),q),render},
      {key:'active',ico:'🛠️',label:'لديه أمر شغل فعال',count:()=>cs.filter(hasActive).length,rows:q=>searchFilter(cs.filter(hasActive),q),render},
      {key:'workshop',ico:'🏭',label:'لديه جهاز في الورشة',count:()=>cs.filter(inWorkshop).length,rows:q=>searchFilter(cs.filter(inWorkshop),q),render}
    ];
  }

  function deviceCards(){
    const cs=read(K.c),ds=read(K.d),rs=read(K.r); const hasActive=d=>rs.some(r=>String(r.deviceId)===String(d.id)&&activeOrder(r));
    const searchFilter=(rows,q)=>!q?rows:rows.filter(d=>[customerName(d.customerId),d.type,d.category,d.brand,d.model,d.desc].filter(Boolean).join(' ').toLowerCase().includes(q));
    const render=d=>`<div class="mini-smart-item"><div class="mini-smart-item-top"><a href="device.html?id=${encodeURIComponent(d.id)}"><b>🔧 ${esc(d.type||'—')} — ${esc(d.brand||'—')}</b></a><span class="badge">${esc(customerName(d.customerId))}</span></div><div class="mini-smart-meta">${esc(d.category||'—')} • ${esc(d.model||'بدون موديل')}</div><div class="mini-smart-actions"><a class="primary small-btn" href="device.html?id=${encodeURIComponent(d.id)}">فتح 360°</a></div></div>`;
    return [
      {key:'no-active',ico:'🔧',label:'بدون أمر شغل فعال',count:()=>ds.filter(d=>!hasActive(d)).length,rows:q=>searchFilter(ds.filter(d=>!hasActive(d)),q),render},
      {key:'active',ico:'🛠️',label:'عليه أمر شغل فعال',count:()=>ds.filter(hasActive).length,rows:q=>searchFilter(ds.filter(hasActive),q),render},
      {key:'workshop',ico:'🏭',label:'داخل الورشة',count:()=>ds.filter(workshopDevice).length,rows:q=>searchFilter(ds.filter(workshopDevice),q),render}
    ];
  }

  function orderCards(){
    const rs=read(K.r);
    const search= r => [r.no,customerName(r.customerId),deviceLabel(r.deviceId),r.status,r.fault,r.executionPlace,r.miniGroup].filter(Boolean).join(' ').toLowerCase();
    const bySearch=(rows,q)=>!q?rows:rows.filter(r=>search(r).includes(q));
    const render=r=>`<div class="mini-smart-item"><div class="mini-smart-item-top"><a href="request.html?id=${encodeURIComponent(r.id)}"><b>🛠️ ${esc(r.no||'أمر شغل')}</b></a><span class="badge">${esc(r.status||'—')}</span></div><div class="mini-smart-meta">👤 ${esc(customerName(r.customerId))} • 🔧 ${esc(deviceLabel(r.deviceId))}</div><div class="mini-smart-actions"><label style="display:flex;align-items:center;gap:6px;font-size:12px">التصنيف اليدوي <select data-mini-order="${esc(r.id)}"><option value="">غير مصنف</option><option value="الورشة" ${r.miniGroup==='الورشة'?'selected':''}>🏭 الورشة</option><option value="غروب" ${r.miniGroup==='غروب'?'selected':''}>🌙 غروب</option><option value="مطاي" ${r.miniGroup==='مطاي'?'selected':''}>📍 مطاي</option></select></label><a class="primary small-btn" href="request.html?id=${encodeURIComponent(r.id)}">فتح 360°</a></div></div>`;
    const dateToday=todayKey(new Date());
    return [
      {key:'completed',ico:'✅',label:'أوامر مكتملة',count:()=>rs.filter(r=>['مكتمل','مغلق'].includes(String(r.status||''))).length,rows:q=>bySearch(rs.filter(r=>['مكتمل','مغلق'].includes(String(r.status||''))),q),render},
      {key:'workshop',ico:'🏭',label:'أوامر الورشة',count:()=>rs.filter(r=>r.miniGroup==='الورشة').length,rows:q=>bySearch(rs.filter(r=>r.miniGroup==='الورشة'),q),render},
      {key:'today',ico:'📅',label:'أوامر اليوم',count:()=>rs.filter(r=>orderDateKey(r)===dateToday).length,rows:q=>bySearch(rs.filter(r=>orderDateKey(r)===dateToday),q),render},
      {key:'ghorob',ico:'🌙',label:'أوامر غروب',count:()=>rs.filter(r=>r.miniGroup==='غروب').length,rows:q=>bySearch(rs.filter(r=>r.miniGroup==='غروب'),q),render},
      {key:'matay',ico:'📍',label:'أوامر مطاي',count:()=>rs.filter(r=>r.miniGroup==='مطاي').length,rows:q=>bySearch(rs.filter(r=>r.miniGroup==='مطاي'),q),render},
      {key:'waiting',ico:'📦',label:'أوامر انتظار قطع غيار',count:()=>rs.filter(r=>r.partsWaiting===true || r.waitingParts===true || r.status==='انتظار قطع غيار').length,rows:q=>bySearch(rs.filter(r=>r.partsWaiting===true || r.waitingParts===true || r.status==='انتظار قطع غيار'),q),render}
    ];
  }

  function partCards(){
    const ps=read(K.p);
    const groups=[
      ['غسالات','🧺',['غسالات','غسالة']],['ثلاجات وفريزرات','🧊',['ثلاجات وفريزرات','ثلاجات','فريزرات','ثلاجة']],['تكييفات','❄️',['تكييف','تكييفات']],['سخانات','🔥',['سخانات','سخان']],['كولديرات','💧',['كولديرات','كولدير']],['أخرى','🔧',['أخرى','أجهزة أخرى']]
    ];
    const match=(p,terms)=>terms.includes(String(p.category||p.partCategory||p.deviceType||'').trim());
    const searchFilter=(rows,q)=>!q?rows:rows.filter(p=>[p.name,p.code,p.location,p.category].filter(Boolean).join(' ').toLowerCase().includes(q));
    const render=p=>`<div class="mini-smart-item"><div class="mini-smart-item-top"><a href="part.html?id=${encodeURIComponent(p.id)}"><b>🔩 ${esc(p.name||'—')}</b></a><span class="badge">${esc(p.qty ?? 0)} ${esc(p.unit||'قطعة')}</span></div><div class="mini-smart-meta">الكود: ${esc(p.code||'—')} • المكان: ${esc(p.location||'—')} • التصنيف: ${esc(p.category||'—')}</div><div class="mini-smart-actions"><a class="primary small-btn" href="part.html?id=${encodeURIComponent(p.id)}">فتح 360°</a></div></div>`;
    return groups.map(([key,ico,labelTerms])=>({key,ico,label:key,count:()=>ps.filter(p=>match(p,labelTerms)).length,rows:q=>searchFilter(ps.filter(p=>match(p,labelTerms)),q),render}));
  }

  function bindOrderSelectors(panel){
    panel?.addEventListener('change',e=>{
      const sel=e.target.closest('[data-mini-order]'); if(!sel)return;
      const id=sel.getAttribute('data-mini-order'), rows=read(K.r), r=rows.find(x=>String(x.id)===String(id)); if(!r)return;
      r.miniGroup=sel.value||''; save(K.r,rows);
      const active=panel.querySelector('.mini-smart-card.active')?.dataset?.miniKey;
      if(active && window.__miniOrderController) window.__miniOrderController.show(active);
    });
  }

  function init(){
    ensureStyle();
    if(document.getElementById('customerList')) window.__miniCustomerController=setupSections('customerSections','customerList',customerCards(),'العملاء');
    if(document.getElementById('deviceList')) window.__miniDeviceController=setupSections('deviceSections','deviceList',deviceCards(),'الأجهزة');
    if(document.getElementById('requestList')) { window.__miniOrderController=setupSections('requestSections','requestList',orderCards(),'أوامر الشغل'); bindOrderSelectors(document.getElementById('requestSectionsResults')); }
    if(document.getElementById('partList')) window.__miniPartController=setupSections('partSections','partList',partCards(),'المخزن');
    const refresh=()=>{ window.__miniCustomerController?.refreshCounts();window.__miniDeviceController?.refreshCounts();window.__miniOrderController?.refreshCounts();window.__miniPartController?.refreshCounts(); };
    setInterval(refresh,1500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,250)); else setTimeout(init,250);
})();
