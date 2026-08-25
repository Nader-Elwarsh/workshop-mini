function imageToDataURL(file,max=720,quality=.62){return new Promise((resolve,reject)=>{if(!file){resolve("");return}try{let r=new FileReader();r.onload=()=>{let img=new Image();img.onload=()=>{let scale=Math.min(1,max/Math.max(img.width,img.height)),w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale)),c=document.createElement("canvas");c.width=w;c.height=h;let ctx=c.getContext("2d",{alpha:false});ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);resolve(c.toDataURL("image/jpeg",quality))};img.onerror=reject;img.src=r.result};r.onerror=reject;r.readAsDataURL(file)}catch(e){reject(e)}})}
function saveJSONSafe(k,v){try{put(k,v);return true}catch(e){if(e?.name==="QuotaExceededError")alert("مساحة تخزين الصور في المتصفح امتلأت. جرّب صورة أصغر أو احذف صورة قديمة.");else alert("تعذر حفظ البيانات: "+(e?.message||e));return false}}
function localDateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function orderNo(date=new Date()){let y=String(date.getFullYear()).slice(-2),m=date.getMonth()+1,d=date.getDate(),prefix=`W${y}-${m}-${d}-`,ymd=localDateKey(date);let n=arr(K.r).filter(x=>x.createdAt&&localDateKey(new Date(x.createdAt))===ymd).length+1;while(arr(K.r).some(x=>x.no===prefix+n))n++;return prefix+n}
function normalizeOrderNumbers(){let rs=arr(K.r),used=new Set(),groups={};rs.forEach(r=>{let dt=r.createdAt?new Date(r.createdAt):new Date(),ymd=localDateKey(dt);(groups[ymd]??=[]).push(r)});Object.entries(groups).forEach(([ymd,list])=>{let [yy,mm,dd]=ymd.split("-").map(Number),prefix=`W${String(yy).slice(-2)}-${mm}-${dd}-`;list.forEach((r,i)=>{let n=prefix+(i+1);while(used.has(n))n=prefix+(++i+1);r.no=n;used.add(n)})});put(K.r,rs)}

const K={c:"wf_c",d:"wf_d",r:"wf_r",p:"wf_p",s:"wf_s",m:"wf_m",e:"wf_e",tr:"wf_tr",tasks:"wf_tasks"};
const def={centers:["مطاي","بني مزار"],villages:{مطاي:["مطاي البلد","أبو عزيز","بردنوها","منبال","أبوان","إبوان","حلوة","سيلة الشرقية","سيلة الغربية","عزبة بطرس","عزبة أبو شحاته"],"بني مزار":[]},types:{غسالات:["هاف أوتوماتيك","فوق أوتوماتيك","أمامي أوتوماتيك"],ثلاجات:["عادية","نوفروست","ديب فريزر"],تكييفات:["سبليت","شباك"],سخانات:["كهرباء","غاز"],كولديرات:["كولدير"],أجهزة_أخرى:["عام"]},brands:["Fresh","Unionaire","Tornado","Beko","LG","Samsung","Sharp","Ariston","Zanussi","Whirlpool","Indesit","White Point","Kiriazi","Ideal","Fagor","Daewoo","Hitachi","Panasonic","Carrier","Midea","Haier","Gree","TCL","فريش","توشيبا العربى","كريازى"],partCats:["ثلاجات وفريزرات","غسالات","تكييف","سخانات","كهرباء وإلكترونيات","مواتير","كمبروسرات","أخرى"]};
function get(k,f=[]){try{let x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}} function put(k,v){localStorage.setItem(k,JSON.stringify(v))}
function settings(){let s=get(K.s,null);if(!s)s={};let base=JSON.parse(JSON.stringify(def));for(const k of Object.keys(base)){if(Array.isArray(base[k]))s[k]=Array.isArray(s[k])?s[k]:base[k];else if(base[k]&&typeof base[k]==="object")s[k]=s[k]&&typeof s[k]==="object"?s[k]:base[k]}s.orderStatuses=s.orderStatuses||["جديد","تم التواصل","مجدول","جاري الفحص","انتظار موافقة العميل","تحت الإصلاح","مكتمل","ملغي"];s.priorities=s.priorities||["عادية","عاجلة","أولوية عالية"];s.executionPlaces=s.executionPlaces||["عند العميل","الورشة"];s.workshopStatuses=s.workshopStatuses||["غير مطلوب","مطلوب السحب","تم السحب","استلام الورشة","تحت الإصلاح","جاهز للتسليم","تم التسليم"];s.paymentStatuses=s.paymentStatuses||["غير مكتمل","تم الدفع بالكامل"];s.units=s.units||["قطعة","متر","كيلو","لتر","مجموعة"];s.addressTypes=s.addressTypes||["العنوان الأساسي","العنوان الإضافي"];s.orderTags=s.orderTags||[];s.villageGroups=s.villageGroups||{};s.expenseCategories=s.expenseCategories||["وقود ومواصلات","صيانة عدة وأدوات","إيجار وفواتير","أخرى"];put(K.s,s);return s}
function duplicateCustomerByPhone(phone,excludeId){let normalized=String(phone||"").replace(/\s+/g,"").trim();if(!normalized)return null;return arr(K.c).find(c=>String(c.id)!==String(excludeId||"")&&String(c.phone||"").replace(/\s+/g,"").trim()===normalized)||null}
function arr(k){return get(k,[])} function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))} function id(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function toggle(x){document.getElementById(x)?.classList.toggle("hidden")}
const QUICK_ADD_LABELS={quickCustomerBox:"➕ عميل",quickDeviceBox:"➕ جهاز",quickDeviceCustomerBox:"➕ عميل",qoCustomerBox:"➕ عميل",qoDeviceBox:"➕ جهاز"};
function toggleQuickAdd(boxId){let box=document.getElementById(boxId);if(!box)return;let btn=document.querySelector(`[data-opens="${boxId}"]`);let opening=box.classList.contains("hidden");box.classList.toggle("hidden");if(btn){btn.textContent=opening?"➖ إلغاء الإضافة":(QUICK_ADD_LABELS[boxId]||"➕ إضافة");btn.classList.toggle("quick-add-open",opening)}if(opening)setTimeout(()=>box.scrollIntoView({behavior:"smooth",block:"nearest"}),50)}
function closeQuickAdd(boxId){let box=document.getElementById(boxId);if(!box)return;box.classList.add("hidden");let btn=document.querySelector(`[data-opens="${boxId}"]`);if(btn){btn.textContent=QUICK_ADD_LABELS[boxId]||"➕ إضافة";btn.classList.remove("quick-add-open")}}

/* ---------------------------------------------------------------------
   💵 الخزنة المستقلة:
   الخزنة هنا = درج نقدي مستقل فقط.
   لا تُضاف تحصيلات أوامر الشغل ولا تُخصم مصاريف التشغيل من رصيدها تلقائيًا.
   يمكن عرض ملخص التشغيل للمتابعة فقط، لكنه لا يدخل في رصيد الخزنة.
--------------------------------------------------------------------- */
function treasuryEntries(){return arr(K.tr).filter(x=>!x.deleted)}
function treasuryBalance(){return treasuryEntries().reduce((a,x)=>a+(x.type==="in"?(+x.amount||0):-(+x.amount||0)),0)}
function upsertTreasuryEntry(refKey,data){return null}
function removeTreasuryEntry(refKey){return false}
function syncTreasuryForOrderDeposit(order){return null}
function syncTreasuryForOrderClose(order,collected){return null}
function syncTreasuryForExpense(e){return null}
function addTreasuryManual(type){
  let amountEl=document.getElementById("trAmount"),reasonEl=document.getElementById("trReason"),
      dateEl=document.getElementById("trDate"),timeEl=document.getElementById("trTime"),
      personEl=document.getElementById("trPerson"),placeEl=document.getElementById("trPlace"),
      categoryEl=document.getElementById("trCategory"),noteEl=document.getElementById("trNote");
  let amount=+amountEl.value||0,reason=(reasonEl.value||"").trim(),
      date=dateEl.value||localDateKey(new Date()),time=timeEl.value||new Date().toTimeString().slice(0,5);
  if(amount<=0)return alert("أدخل مبلغ صحيح.");
  if(!reason)return alert("اكتب سبب الحركة.");
  let entry={
    id:id(),refKey:null,manualOverride:true,deleted:false,type,amount,date,time,
    reason,counterparty:(personEl?.value||"").trim(),place:(placeEl?.value||"").trim(),
    category:categoryEl?.value||"أخرى",note:(noteEl?.value||"").trim(),
    source:"cash-drawer",createdAt:new Date().toISOString()
  };
  put(K.tr,arr(K.tr).concat(entry));renderTreasury();
}
function saveOpeningBalance(){
  let el=document.getElementById("trOpening"),amount=Math.abs(+el.value||0),
      dateEl=document.getElementById("trOpeningDate"),date=dateEl?.value||localDateKey(new Date());
  let a=arr(K.tr),existing=a.find(x=>x.refKey==="opening-balance"&&!x.deleted);
  if(existing){existing.amount=amount;existing.date=date;existing.type="in";existing.reason="رصيد افتتاحي";existing.source="cash-drawer"}
  else a.push({id:id(),refKey:"opening-balance",manualOverride:true,deleted:false,type:"in",amount,date,time:"00:00",reason:"رصيد افتتاحي",category:"رصيد افتتاحي",source:"cash-drawer",createdAt:new Date().toISOString()});
  put(K.tr,a);renderTreasury();
}
function editTreasuryEntry(entryId){
  let a=arr(K.tr),e=a.find(x=>x.id===entryId);if(!e)return;
  let newAmount=prompt("المبلغ:",e.amount);if(newAmount===null)return;
  let newReason=prompt("سبب الحركة:",e.reason);if(newReason===null)return;
  let newPerson=prompt("لمن / من؟:",e.counterparty||"");if(newPerson===null)return;
  let newPlace=prompt("فين / المكان؟:",e.place||"");if(newPlace===null)return;
  e.amount=Math.abs(+newAmount)||0;e.reason=(newReason||"").trim()||e.reason;
  e.counterparty=(newPerson||"").trim();e.place=(newPlace||"").trim();e.manualOverride=true;
  put(K.tr,a);renderTreasury();
}
function deleteTreasuryEntry(entryId){
  if(!confirm("حذف هذه الحركة من كشف الخزنة؟"))return;
  let a=arr(K.tr),idx=a.findIndex(x=>x.id===entryId);if(idx<0)return;
  if(a[idx].refKey==="opening-balance"){alert("رصيد الافتتاح يُعدل من قسم الرصيد الافتتاحي ولا يُحذف من هنا.");return}
  a.splice(idx,1);put(K.tr,a);renderTreasury();
}
function operationalTreasurySummary(){
  let deposits=arr(K.r).reduce((a,x)=>a+(+x.deposit||0),0);
  let finalCollections=arr(K.r).filter(x=>x.closed||x.paid).reduce((a,x)=>a+Math.max(0,(+x.total||0)-(+x.deposit||0)),0);
  let expenses=arr(K.e).reduce((a,x)=>a+(+x.amount||0),0);
  return {deposits,finalCollections,orderCollections:deposits+finalCollections,expenses};
}
function renderTreasury(){
  let el=document.getElementById("treasuryPage");if(!el)return;
  let balance=treasuryBalance();
  let list=treasuryEntries().sort((a,b)=>new Date((b.date||"")+"T"+(b.time||"00:00"))-new Date((a.date||"")+"T"+(a.time||"00:00"))||new Date(b.createdAt)-new Date(a.createdAt));
  let opening=arr(K.tr).find(x=>x.refKey==="opening-balance"&&!x.deleted);
  let op=operationalTreasurySummary();
  let today=localDateKey(new Date());
  el.innerHTML=`
    <div class="treasury-balance ${balance<0?"negative":""}">
      <span>رصيد درج الخزنة الحالي</span><b>${balance.toFixed(2)} ج</b>
    </div>
    <div class="hint" style="margin:10px 0">🔒 هذا الرصيد مستقل تمامًا عن حسابات أوامر الشغل وقطع الغيار ومصاريف التشغيل. أي مبلغ هنا لا يتغير إلا بحركة خزنة يدوية أو الرصيد الافتتاحي.</div>
    <div class="treasury-actions">
      <div class="form-grid">
        <label>المبلغ<input id="trAmount" type="number" step="0.01" min="0" placeholder="0.00"></label>
        <label>التاريخ<input id="trDate" type="date" value="${today}"></label>
        <label>الوقت<input id="trTime" type="time" value="${new Date().toTimeString().slice(0,5)}"></label>
        <label>النوع<select id="trCategory"><option>شخصي</option><option>تشغيل</option><option>سلفة</option><option>تحويل</option><option>أخرى</option></select></label>
        <label>لمن / من؟<input id="trPerson" placeholder="مثال: أحمد، المورد، نفسي"></label>
        <label>فين / المكان؟<input id="trPlace" placeholder="مثال: البيت، الورشة، البنك"></label>
        <label class="wide">السبب<input id="trReason" placeholder="مثال: سحب شخصي، فلوس وصلت، دفعت لمحمد..."></label>
        <label class="wide">تفاصيل إضافية<input id="trNote" placeholder="اختياري"></label>
      </div>
      <div class="actions">
        <button type="button" class="primary" onclick="addTreasuryManual('in')">➕ وارد</button>
        <button type="button" class="secondary danger-btn" onclick="addTreasuryManual('out')">➖ صرف</button>
      </div>
    </div>
    <details class="expense-panel">
      <summary>⚙️ الرصيد الافتتاحي${opening?` (${(+opening.amount||0).toFixed(2)} ج)`: ""}</summary>
      <div class="form-grid">
        <label class="wide">الرصيد الافتتاحي (المبلغ الموجود فعليًا في الدرج عند بداية استخدام الحساب)
          <input id="trOpening" type="number" step="0.01" min="0" value="${opening?opening.amount:0}">
        </label>
        <label>تاريخ بداية الرصيد<input id="trOpeningDate" type="date" value="${opening?.date||today}"></label>
      </div>
      <button type="button" class="secondary" onclick="saveOpeningBalance()">💾 حفظ الرصيد الافتتاحي</button>
    </details>
    <details class="expense-panel">
      <summary>📊 عرض حسابات التشغيل (للاطلاع فقط — لا تدخل في رصيد الخزنة)</summary>
      <div class="profile-grid">
        <div class="kv"><b>💵 عربونات أوامر الشغل</b>${op.deposits.toFixed(2)} ج</div>
        <div class="kv"><b>💳 تحصيلات إغلاق الأوامر</b>${op.finalCollections.toFixed(2)} ج</div>
        <div class="kv"><b>🛠️ إجمالي تحصيلات الأوامر</b>${op.orderCollections.toFixed(2)} ج</div>
        <div class="kv"><b>🧯 مصاريف التشغيل</b>${op.expenses.toFixed(2)} ج</div>
      </div>
      <div class="hint">هذه الأرقام للعرض والمراجعة فقط. لا تُضاف ولا تُخصم من درج الخزنة.</div>
    </details>
    <h3 class="treasury-list-title">📋 كشف درج الخزنة</h3>
    ${list.length?list.map(x=>`<div class="treasury-row ${x.type}">
      <div class="treasury-row-main">
        <b>${esc(x.reason||"—")}</b>
        <small>${esc(new Date((x.date||today)+"T"+(x.time||"00:00")).toLocaleString("ar-EG"))} • ${esc(x.category||"أخرى")}${x.counterparty?` • 👤 ${esc(x.counterparty)}`:""}${x.place?` • 📍 ${esc(x.place)}`:""}</small>
        ${x.note?`<small>📝 ${esc(x.note)}</small>`:""}
      </div>
      <div class="treasury-row-amount ${x.type}">${x.type==="in"?"+":"−"}${(+x.amount||0).toFixed(2)} ج</div>
      <div class="treasury-row-actions"><button type="button" class="mini-action" onclick="editTreasuryEntry('${x.id}')">✏️</button><button type="button" class="mini-action" onclick="deleteTreasuryEntry('${x.id}')">🗑️</button></div>
    </div>`).join(""):`<div class="hint">لا توجد حركات في درج الخزنة بعد.</div>`}
  `;
}

/* ---------------------------------------------------------------------
   📋 المهام والمتابعة: قسم مستقل عن الدورة الأساسية.
--------------------------------------------------------------------- */
function taskRows(){return arr(K.tasks).filter(x=>!x.deleted)}
function taskDateTime(t){return `${t.date||""}${t.time?"T"+t.time:""}`}
function taskPriorityClass(p){return p==="عاجلة"?"negative":p==="عالية"?"high":""}
function saveTask(){
  let title=(document.getElementById("taskTitle")?.value||"").trim();
  if(!title)return alert("اكتب عنوان المهمة.");
  let t={
    id:id(),title,
    note:(document.getElementById("taskNote")?.value||"").trim(),
    date:document.getElementById("taskDate")?.value||localDateKey(new Date()),
    time:document.getElementById("taskTime")?.value||"",
    priority:document.getElementById("taskPriority")?.value||"عادية",
    customerId:document.getElementById("taskCustomer")?.value||"",
    requestId:document.getElementById("taskRequest")?.value||"",
    completed:false,createdAt:new Date().toISOString()
  };
  put(K.tasks,taskRows().concat(t));clearTaskForm();renderTasks();
}
function clearTaskForm(){
  ["taskTitle","taskNote","taskTime","taskCustomer","taskRequest"].forEach(idv=>{let e=document.getElementById(idv);if(e)e.value=""});
  let d=document.getElementById("taskDate");if(d)d.value=localDateKey(new Date());
  let p=document.getElementById("taskPriority");if(p)p.value="عادية";
}
function toggleTask(idv){
  let a=arr(K.tasks),t=a.find(x=>x.id===idv);if(!t)return;t.completed=!t.completed;t.completedAt=t.completed?new Date().toISOString():"";put(K.tasks,a);renderTasks();
}
function deleteTask(idv){
  let a=arr(K.tasks),t=a.find(x=>x.id===idv);if(!t)return;
  if(!confirm(`حذف المهمة «${t.title||""}»؟`))return;
  put(K.tasks,a.filter(x=>x.id!==idv));renderTasks();
}
function editTask(idv){
  let a=arr(K.tasks),t=a.find(x=>x.id===idv);if(!t)return;
  let title=prompt("عنوان المهمة:",t.title);if(title===null)return;
  let note=prompt("التفاصيل:",t.note||"");if(note===null)return;
  let date=prompt("التاريخ YYYY-MM-DD:",t.date||localDateKey(new Date()));if(date===null)return;
  let time=prompt("الوقت HH:MM (اختياري):",t.time||"");if(time===null)return;
  let priority=prompt("الأولوية (عادية / عالية / عاجلة):",t.priority||"عادية");if(priority===null)return;
  t.title=title.trim()||t.title;t.note=note.trim();t.date=date.trim()||t.date;t.time=time.trim();t.priority=priority.trim()||t.priority;
  put(K.tasks,a);renderTasks();
}
function renderTasks(){
  let el=document.getElementById("taskList");if(!el)return;
  let q=(document.getElementById("taskSearch")?.value||"").toLowerCase().trim(),
      filter=document.getElementById("taskFilter")?.value||"open",
      today=localDateKey(new Date());
  let rows=taskRows().filter(t=>{
    let text=(t.title+" "+t.note+" "+customerName(t.customerId)).toLowerCase();
    if(q&&!text.includes(q))return false;
    if(filter==="open"&&t.completed)return false;
    if(filter==="done"&&!t.completed)return false;
    if(filter==="today"&&t.date!==today)return false;
    if(filter==="overdue"&&(t.completed||!t.date||t.date>=today))return false;
    return true;
  }).sort((a,b)=>Number(a.completed)-Number(b.completed)||String(a.date||"").localeCompare(String(b.date||""))||String(a.time||"").localeCompare(String(b.time||"")));
  let open=taskRows().filter(x=>!x.completed).length,done=taskRows().filter(x=>x.completed).length;
  let stats=document.getElementById("taskStats");if(stats)stats.innerHTML=`<div class="compact-stats"><div class="stat"><b>${open}</b><span>مفتوحة</span></div><div class="stat"><b>${done}</b><span>مكتملة</span></div><div class="stat"><b>${taskRows().filter(x=>!x.completed&&x.date===today).length}</b><span>مهام اليوم</span></div><div class="stat"><b>${taskRows().filter(x=>!x.completed&&x.date&&x.date<today).length}</b><span>متأخرة</span></div></div>`;
  el.innerHTML=rows.length?rows.map(t=>{
    let c=t.customerId?customerName(t.customerId):"";
    let r=t.requestId?arr(K.r).find(x=>x.id===t.requestId):null;
    return `<div class="item record-card ${t.completed?"task-done":""}">
      <div class="card-side-actions">
        <button class="primary small-btn" type="button" onclick="toggleTask('${t.id}')">${t.completed?"↩️ إعادة فتح":"✅ مكتملة"}</button>
        <button class="secondary small-btn" type="button" onclick="editTask('${t.id}')">✏️ تعديل</button>
        <button class="danger-btn small-btn" type="button" onclick="deleteTask('${t.id}')">🗑️ حذف</button>
      </div>
      <div class="record-main">
        <div class="item-head"><b>${t.completed?"✅":"📋"} ${esc(t.title)}</b><span class="badge ${taskPriorityClass(t.priority)}">${esc(t.priority||"عادية")}</span></div>
        <div>📅 ${esc(t.date||"بدون تاريخ")}${t.time?" • ⏰ "+esc(t.time):""}${t.date&&t.date<today&&!t.completed?" • ⚠️ متأخرة":""}</div>
        ${c?`<div>👤 <a href="customer.html?id=${t.customerId}">${esc(c)}</a></div>`:""}
        ${r?`<div>🛠️ <a href="request.html?id=${r.id}">${esc(r.no)}</a></div>`:""}
        ${t.note?`<div>📝 ${esc(t.note)}</div>`:""}
      </div>
    </div>`;
  }).join(""):'<div class="item">لا توجد مهام بهذا الفلتر.</div>';
}
function initTasks(){
  if(!document.getElementById("taskList"))return;
  let d=document.getElementById("taskDate");if(d&&!d.value)d.value=localDateKey(new Date());
  let c=document.getElementById("taskCustomer"),r=document.getElementById("taskRequest");
  if(c){fillCustomer(c);c.onchange=()=>{if(r)fillTaskRequests(r,c.value)}}
  if(r)fillTaskRequests(r,c?.value||"");
  document.getElementById("taskSearch")?.addEventListener("input",renderTasks);
  document.getElementById("taskFilter")?.addEventListener("change",renderTasks);
  let qsf=new URLSearchParams(location.search).get("filter");if(qsf&&document.getElementById("taskFilter"))document.getElementById("taskFilter").value=qsf;
  renderTasks();
}
function fillTaskRequests(el,cid){
  if(!el)return;
  let rows=arr(K.r).filter(x=>!cid||x.customerId===cid);
  el.innerHTML='<option value="">بدون ربط بأمر شغل</option>'+rows.map(x=>`<option value="${x.id}">${esc(x.no)} — ${esc(customerName(x.customerId))}</option>`).join("");
}
function customerName(i){return arr(K.c).find(x=>x.id===i)?.name||"—"} function deviceName(i){let d=arr(K.d).find(x=>x.id===i);return d?`${d.type} - ${d.brand}`:"—"}
function addresses(c){let e=c.extraAddress||{};let hasExtra=!!(e.center||e.village||e.street||e.address);return [{key:"main",label:"العنوان الأساسي",...c.mainAddress},...(hasExtra?[{key:"extra",label:"العنوان الإضافي",...e}]:[])]}
function addressText(a){return `${a.center||""}${a.village?" - "+a.village:""}${a.address?" - "+a.address:""}${a.street?" - "+a.street:""}`}
function fillCenters(el,selected=""){if(!el)return;let s=settings();el.innerHTML='<option value="">اختر المركز</option>'+s.centers.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function fillVillages(el,center,selected=""){if(!el)return;let vs=settings().villages[center]||[];el.innerHTML='<option value="">اختر القرية</option>'+vs.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function fillCustomer(el,selected=""){if(!el)return;el.innerHTML='<option value="">اختر العميل</option>'+arr(K.c).map(x=>`<option value="${x.id}" ${x.id===selected?"selected":""}>${esc(x.name)} - ${esc(x.phone)}</option>`).join("")}
function fillAddress(el,cid,selected=""){let c=arr(K.c).find(x=>x.id===cid);if(!el){return}el.innerHTML='<option value="">اختر العنوان</option>'+(c?addresses(c).map(a=>`<option value="${a.key}" ${a.key===selected?"selected":""}>${esc(a.label)} — ${esc(addressText(a))}</option>`).join(""):"")}
function fillList(el,key,selected="",placeholder="اختر"){if(!el)return;let a=settings()[key]||[];el.innerHTML=`<option value="">${placeholder}</option>`+a.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function addOrderTagInline(){let el=document.getElementById("rTag");if(!el)return;let v=prompt("اكتب اسم التصنيف الجديد:");if(!v||!v.trim())return;v=v.trim();let s=settings();s.orderTags=s.orderTags||[];if(!s.orderTags.includes(v))s.orderTags.push(v);put(K.s,s);fillList(el,"orderTags",v,"🏷️ بدون تصنيف")}
function fillTypes(el,selected=""){let t=settings().types;el.innerHTML='<option value="">اختر النوع</option>'+Object.keys(t).map(x=>`<option ${x===selected?"selected":""}>${esc(x.replace("_"," "))}</option>`).join("")}
function fillCats(el,type,selected=""){let t=settings().types[type]||[];el.innerHTML='<option value="">اختر التصنيف</option>'+t.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function fillBrands(el,selected=""){el.innerHTML='<option value="">اختر الماركة</option>'+settings().brands.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function dayKeyLocal(v){let d=new Date(v);return Number.isNaN(d.getTime())?"":`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function renderDash(){let el=document.getElementById("dashboard");if(!el)return;let c=arr(K.c),d=arr(K.d),r=arr(K.r),p=arr(K.p);let today=dayKeyLocal(new Date());let openOrders=r.filter(x=>x.status!=="مكتمل"&&x.status!=="ملغي");let todayOrders=openOrders.filter(x=>x.visit&&dayKeyLocal(x.visit)===today);let overdue=openOrders.filter(x=>x.visit&&dayKeyLocal(x.visit)<today);let waitingParts=openOrders.filter(x=>x.partsWaiting);let inWorkshop=openOrders.filter(x=>x.executionPlace==="الورشة"||(x.workshopStatus&&x.workshopStatus!=="غير مطلوب"&&x.workshopStatus!=="تم التسليم"));let low=p.filter(x=>+x.qty<=+x.min).length;let ym=new Date().toISOString().slice(0,7);let monthOrders=r.filter(x=>(x.closedAt||x.createdAt||"").slice(0,7)===ym);let monthLabor=monthOrders.filter(x=>x.closed).reduce((a,x)=>a+(+x.labor||0),0);let monthRevenue=monthLabor+monthOrders.reduce((a,x)=>a+(+x.partsTotal||0),0);let unpaidRemain=r.filter(x=>!x.closed).reduce((a,x)=>a+Math.max(0,(+x.total||0)-(+x.deposit||0)),0);let newCustomers=c.filter(x=>(x.createdAt||"").slice(0,7)===ym).length;el.innerHTML=`<div class="compact-stats">
<a class="stat" href="requests.html?bucket=today">📅 <b>${todayOrders.length}</b><span>أوامر اليوم</span></a>
<a class="stat" href="requests.html?bucket=overdue">⚠️ <b>${overdue.length}</b><span>متأخرة</span></a>
<a class="stat" href="requests.html?bucket=parts">📦 <b>${waitingParts.length}</b><span>انتظار قطع</span></a>
<a class="stat" href="requests.html?bucket=workshop">🏭 <b>${inWorkshop.length}</b><span>في الورشة</span></a>
<a class="stat" href="requests.html?bucket=open">🛠️ <b>${openOrders.length}</b><span>أوامر مفتوحة</span></a>
<a class="stat" href="inventory.html?bucket=low">📉 <b>${low}</b><span>قطع منخفضة</span></a>
<a class="stat" href="customers.html?bucket=all">👤 <b>${c.length}</b><span>عملاء (+${newCustomers})</span></a>
<a class="stat" href="devices.html?bucket=all">🔧 <b>${d.length}</b><span>أجهزة</span></a>
<a class="stat" href="#reportSection">💰 <b>${monthRevenue.toFixed(0)} ج</b><span>إيراد الشهر</span></a>
<a class="stat" href="requests.html?bucket=unpaid">🧾 <b>${unpaidRemain.toFixed(0)} ج</b><span>متبقي غير محصل</span></a>
<a class="stat" href="treasury.html">💵 <b>${treasuryBalance().toFixed(0)} ج</b><span>رصيد الخزنة</span></a>
<a class="stat" href="tasks.html?filter=today">📋 <b>${taskRows().filter(x=>!x.completed&&x.date===today).length}</b><span>مهام اليوم</span></a>
</div>`}
function isoWeekMonday(y,w){let jan4=new Date(y,0,4);let jan4Day=jan4.getDay()||7;let week1Monday=new Date(jan4);week1Monday.setDate(jan4.getDate()-jan4Day+1);let monday=new Date(week1Monday);monday.setDate(week1Monday.getDate()+(w-1)*7);return monday}
function inRange(dateStr,start,end){if(!dateStr)return false;let d=new Date(dateStr);if(Number.isNaN(d.getTime()))return false;return d>=start&&d<=end}
function getReportRange(){let mode=(document.getElementById("reportMode")||{}).value||"month";if(mode==="week"){let wEl=document.getElementById("reportWeek"),val=wEl&&wEl.value,start;if(val){let[y,w]=val.split("-W").map(Number);start=isoWeekMonday(y,w)}else{let now=new Date(),dow=now.getDay()||7;start=new Date(now.getFullYear(),now.getMonth(),now.getDate()-(dow-1))}let startClean=new Date(start.getFullYear(),start.getMonth(),start.getDate(),0,0,0,0);let end=new Date(start.getFullYear(),start.getMonth(),start.getDate()+5,23,59,59,999);return{start:startClean,end,label:`الأسبوع: ${startClean.toLocaleDateString("ar-EG",{day:"2-digit",month:"2-digit"})} (الاثنين) ← ${end.toLocaleDateString("ar-EG",{day:"2-digit",month:"2-digit"})} (السبت)`}}let mEl=document.getElementById("reportMonth"),ym=mEl&&mEl.value?mEl.value:new Date().toISOString().slice(0,7),parts=ym.split("-").map(Number),y=parts[0],m=parts[1];let start=new Date(y,m-1,1,0,0,0,0),end=new Date(y,m,0,23,59,59,999);return{start,end,label:`شهر ${ym}`}}
function setReportMode(mode){let hidden=document.getElementById("reportMode");if(!hidden){hidden=document.createElement("input");hidden.type="hidden";hidden.id="reportMode";document.querySelector(".report")?.appendChild(hidden)}hidden.value=mode;document.getElementById("reportMonth")?.classList.toggle("hidden",mode!=="month");document.getElementById("reportWeek")?.classList.toggle("hidden",mode!=="week");document.getElementById("modeMonthBtn")?.classList.toggle("active-track",mode==="month");document.getElementById("modeWeekBtn")?.classList.toggle("active-track",mode==="week");financeReport()}
function financeReport(){let el=document.getElementById("monthlyReport");if(!el)return;let m=document.getElementById("reportMonth");if(m&&!m.value)m.value=new Date().toISOString().slice(0,7);let{start,end,label}=getReportRange();let r=arr(K.r).filter(x=>inRange(x.closedAt,start,end)||inRange(x.createdAt,start,end));let laborOrders=r.filter(x=>x.closed);let labor=laborOrders.reduce((a,x)=>a+(+x.labor||0),0),partsSell=r.reduce((a,x)=>a+(+x.partsTotal||0),0),partsCost=r.reduce((a,x)=>a+(+x.partsCost||0),0),revenue=labor+partsSell,grossProfit=revenue-partsCost,partsProfit=partsSell-partsCost,partsProfitPct=partsSell>0?(partsProfit/partsSell*100):0,deposits=r.reduce((a,x)=>a+(+x.deposit||0),0),remain=r.reduce((a,x)=>a+(x.closed?0:Math.max(0,(+x.total||0)-(+x.deposit||0))),0),completedList=r.filter(x=>x.status==="مكتمل"||x.closed),completedCount=completedList.length,avgTicket=completedList.length?completedList.reduce((a,x)=>a+(x.closed?(+x.labor||0):0),0)/completedList.length:0;let exp=arr(K.e).filter(x=>inRange(x.date,start,end)),totalExpenses=exp.reduce((a,x)=>a+(+x.amount||0),0),netProfit=grossProfit-totalExpenses;let expByCat={};exp.forEach(x=>{let k=x.category||"أخرى";expByCat[k]=(expByCat[k]||0)+(+x.amount||0)});el.innerHTML=`<div class="hint report-range">${label} • ${r.length} أمر</div><div class="hint report-click-hint">💡 اضغط على أي بند لعرض تفاصيله ومصدره</div><table class="month-table report-table">
<tr class="report-row-clickable" onclick="showReportDetail('labor')"><td>🔨 المصنعية</td><td>${labor.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('partsSell')"><td>🔧 قطع الغيار المحصلة</td><td>${partsSell.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('partsCost')"><td>📦 تكلفة القطع</td><td>${partsCost.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('partsProfitPct')"><td>📈 نسبة ربح قطع الغيار</td><td>${partsProfitPct.toFixed(1)}%</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('revenue')"><td>💰 الإيراد</td><td>${revenue.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('grossProfit')"><td>📈 مكسب قبل المصاريف</td><td>${grossProfit.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('expenses')"><td>🧯 مصاريف التشغيل</td><td>${totalExpenses.toFixed(2)} ج</td></tr>
<tr class="total-row report-row-clickable" onclick="showReportDetail('netProfit')"><td>✅ صافي المكسب</td><td>${netProfit.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('deposits')"><td>💵 العربون المحصّل</td><td>${deposits.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('remain')"><td>🧾 المتبقي على العملاء</td><td>${remain.toFixed(2)} ج</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('count')"><td>🛠️ عدد الأوامر</td><td>${r.length}</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('completed')"><td>✅ أوامر مكتملة</td><td>${completedCount}</td></tr>
<tr class="report-row-clickable" onclick="showReportDetail('avgTicket')"><td>📊 متوسط قيمة الأمر (المصنعية فقط)</td><td>${avgTicket.toFixed(2)} ج</td></tr>
</table><div id="reportDetail" class="report-detail hidden"></div>${exp.length?`<h3 class="expense-subtitle">🧯 تفاصيل المصاريف (${exp.length})</h3><table class="month-table">${Object.entries(expByCat).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${v.toFixed(2)} ج</td></tr>`).join("")}</table>`:""}`;renderExpenseList()}
function reportOrders(){let{start,end}=getReportRange();return arr(K.r).filter(x=>inRange(x.closedAt,start,end)||inRange(x.createdAt,start,end))}
function reportExpensesInRange(){let{start,end}=getReportRange();return arr(K.e).filter(x=>inRange(x.date,start,end))}
function reportOrderLine(o,val){return `<a class="report-detail-row" href="request.html?id=${o.id}"><span>${esc(o.no||"—")} • ${esc(customerName(o.customerId))}${o.closed?" 🔒":""}</span><b>${(+val||0).toFixed(2)} ج</b></a>`}
function reportRowMeta(key){let r=reportOrders();
if(key==="labor"){let list=r.filter(x=>x.closed&&(+x.labor||0)>0);return{title:"🔨 تفاصيل المصنعية",note:"المصنعية تدخل هذا البند فقط بعد إغلاق أمر الشغل نهائيًا.",rows:list.map(x=>reportOrderLine(x,x.labor)),empty:"لا توجد مصنعية محسوبة بعد؛ ستظهر هنا الأوامر بعد إغلاقها نهائيًا."}}
if(key==="partsSell"){let list=r.filter(x=>(+x.partsTotal||0)>0);return{title:"🔧 تفاصيل قطع الغيار المحصلة",rows:list.map(x=>reportOrderLine(x,x.partsTotal)),empty:"لا توجد قطع غيار محصلة في هذه الفترة."}}
if(key==="partsCost"){let list=r.filter(x=>(+x.partsCost||0)>0);return{title:"📦 تفاصيل تكلفة القطع",rows:list.map(x=>reportOrderLine(x,x.partsCost)),empty:"لا توجد تكلفة قطع مسجلة في هذه الفترة."}}
if(key==="deposits"){let list=r.filter(x=>(+x.deposit||0)>0);return{title:"💵 تفاصيل العربون المحصّل",rows:list.map(x=>reportOrderLine(x,x.deposit)),empty:"لا يوجد عربون محصل في هذه الفترة."}}
if(key==="remain"){let list=r.filter(x=>!x.closed&&Math.max(0,(+x.total||0)-(+x.deposit||0))>0);return{title:"🧾 تفاصيل المتبقي على العملاء",note:"الأوامر المقفولة نهائيًا لا تُحتسب هنا حتى لو كان إجماليها أكبر من العربون وقت الفتح.",rows:list.map(x=>reportOrderLine(x,Math.max(0,(+x.total||0)-(+x.deposit||0)))),empty:"لا يوجد متبقي على العملاء."}}
if(key==="count"){return{title:"🛠️ كل أوامر الفترة",rows:r.map(x=>reportOrderLine(x,x.total)),empty:"لا توجد أوامر في هذه الفترة."}}
if(key==="completed"){let list=r.filter(x=>x.status==="مكتمل"||x.closed);return{title:"✅ الأوامر المكتملة / المغلقة",rows:list.map(x=>reportOrderLine(x,x.total)),empty:"لا توجد أوامر مكتملة أو مغلقة في هذه الفترة."}}
if(key==="expenses"){let list=reportExpensesInRange();return{title:"🧯 تفاصيل مصاريف التشغيل",rows:list.map(x=>`<div class="report-detail-row"><span>${esc(new Date(x.date).toLocaleDateString("ar-EG"))} • ${esc(x.category)}${x.note?" — "+esc(x.note):""}</span><b>${(+x.amount||0).toFixed(2)} ج</b></div>`),empty:"لا توجد مصاريف مسجلة في هذه الفترة."}}
if(key==="revenue"){let labor=r.filter(x=>x.closed).reduce((a,x)=>a+(+x.labor||0),0),partsSell=r.reduce((a,x)=>a+(+x.partsTotal||0),0);return{title:"💰 مكوّنات الإيراد",rows:[`<div class="report-detail-row"><span>🔨 المصنعية (الأوامر المقفولة)</span><b>${labor.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>🔧 قطع الغيار المحصلة</span><b>${partsSell.toFixed(2)} ج</b></div>`,`<div class="report-detail-row total-row"><span>= الإيراد</span><b>${(labor+partsSell).toFixed(2)} ج</b></div>`],empty:""}}
if(key==="grossProfit"){let labor=r.filter(x=>x.closed).reduce((a,x)=>a+(+x.labor||0),0),partsSell=r.reduce((a,x)=>a+(+x.partsTotal||0),0),partsCost=r.reduce((a,x)=>a+(+x.partsCost||0),0),revenue=labor+partsSell;return{title:"📈 مكوّنات المكسب قبل المصاريف",rows:[`<div class="report-detail-row"><span>💰 الإيراد</span><b>${revenue.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>− 📦 تكلفة القطع</span><b>${partsCost.toFixed(2)} ج</b></div>`,`<div class="report-detail-row total-row"><span>= المكسب قبل المصاريف</span><b>${(revenue-partsCost).toFixed(2)} ج</b></div>`],empty:""}}
if(key==="netProfit"){let labor=r.filter(x=>x.closed).reduce((a,x)=>a+(+x.labor||0),0),partsSell=r.reduce((a,x)=>a+(+x.partsTotal||0),0),partsCost=r.reduce((a,x)=>a+(+x.partsCost||0),0),grossProfit=labor+partsSell-partsCost,exp=reportExpensesInRange(),totalExpenses=exp.reduce((a,x)=>a+(+x.amount||0),0);return{title:"✅ مكوّنات صافي المكسب",rows:[`<div class="report-detail-row"><span>📈 مكسب قبل المصاريف</span><b>${grossProfit.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>− 🧯 مصاريف التشغيل</span><b>${totalExpenses.toFixed(2)} ج</b></div>`,`<div class="report-detail-row total-row"><span>= صافي المكسب</span><b>${(grossProfit-totalExpenses).toFixed(2)} ج</b></div>`],empty:""}}
if(key==="avgTicket"){let completedList=r.filter(x=>x.status==="مكتمل"||x.closed),completedLabor=completedList.reduce((a,x)=>a+(x.closed?(+x.labor||0):0),0);return{title:"📊 متوسط قيمة الأمر (المصنعية فقط)",note:"يُحسب من المصنعية (للأوامر المقفولة) فقط ÷ عدد الأوامر المنتهية — قطع الغيار مش داخلة في الحساب ده لأنها منفصلة تمامًا عن أجر الفني.",rows:[`<div class="report-detail-row"><span>🔨 إجمالي المصنعية (المقفولة)</span><b>${completedLabor.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>÷ ✅ عدد الأوامر المنتهية</span><b>${completedList.length}</b></div>`,`<div class="report-detail-row total-row"><span>= متوسط قيمة الأمر</span><b>${(completedList.length?completedLabor/completedList.length:0).toFixed(2)} ج</b></div>`],empty:""}}
if(key==="partsProfitPct"){let partsSell=r.reduce((a,x)=>a+(+x.partsTotal||0),0),partsCost=r.reduce((a,x)=>a+(+x.partsCost||0),0),profit=partsSell-partsCost,pct=partsSell>0?(profit/partsSell*100):0;return{title:"📈 نسبة ربح قطع الغيار",note:"النسبة = (قطع الغيار المحصلة − تكلفة القطع) ÷ قطع الغيار المحصلة × 100.",rows:[`<div class="report-detail-row"><span>🔧 قطع الغيار المحصلة</span><b>${partsSell.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>− 📦 تكلفة القطع</span><b>${partsCost.toFixed(2)} ج</b></div>`,`<div class="report-detail-row"><span>= مكسب قطع الغيار</span><b>${profit.toFixed(2)} ج</b></div>`,`<div class="report-detail-row total-row"><span>= نسبة الربح</span><b>${pct.toFixed(1)}%</b></div>`],empty:partsSell>0?"":"لا توجد مبيعات قطع غيار في هذه الفترة لحساب النسبة."}}
return null}
function showReportDetail(key){let el=document.getElementById("reportDetail");if(!el)return;let meta=reportRowMeta(key);if(!meta)return;el.innerHTML=`<div class="report-detail-head"><b>${meta.title}</b><button type="button" class="secondary small-btn" onclick="closeReportDetail()">✖ إغلاق</button></div>${meta.note?`<div class="hint report-detail-note">${meta.note}</div>`:""}<div class="report-detail-list">${meta.rows&&meta.rows.length?meta.rows.join(""):`<div class="hint">${meta.empty||""}</div>`}</div>`;el.classList.remove("hidden");el.scrollIntoView({behavior:"smooth",block:"nearest"})}
function closeReportDetail(){document.getElementById("reportDetail")?.classList.add("hidden")}
function fillExpenseCategories(){let el=document.getElementById("expCategory");if(!el)return;let s=settings();el.innerHTML=(s.expenseCategories||[]).map(x=>`<option>${esc(x)}</option>`).join("")}
function addExpense(){let dEl=document.getElementById("expDate"),cEl=document.getElementById("expCategory"),aEl=document.getElementById("expAmount"),nEl=document.getElementById("expNote");let amount=+aEl.value||0;if(amount<=0)return alert("أدخل قيمة المصروف.");let date=dEl.value||new Date().toISOString().slice(0,10);let e={id:id(),date,category:cEl.value||"أخرى",amount,note:(nEl.value||"").trim(),createdAt:new Date().toISOString()};put(K.e,arr(K.e).concat(e));syncTreasuryForExpense(e);aEl.value="";nEl.value="";financeReport()}
function deleteExpense(i){let a=arr(K.e);if(!confirm("حذف هذا المصروف؟"))return;put(K.e,a.filter(x=>x.id!==i));removeTreasuryEntry("expense-"+i);financeReport()}
function renderExpenseList(){let el=document.getElementById("expenseList");if(!el)return;let{start,end}=getReportRange();let exp=arr(K.e).filter(x=>inRange(x.date,start,end)).sort((a,b)=>new Date(b.date)-new Date(a.date));el.innerHTML=exp.length?exp.map(x=>`<div class="expense-row"><span>${esc(new Date(x.date).toLocaleDateString("ar-EG"))}</span><span>${esc(x.category)}</span><b>${(+x.amount||0).toFixed(2)} ج</b><span class="expense-note">${esc(x.note||"")}</span><button type="button" class="mini-action" onclick="deleteExpense('${x.id}')">🗑️</button></div>`).join(""):`<div class="hint">لا توجد مصاريف مسجلة في هذه الفترة.</div>`}
function monthReport(){if(!document.getElementById("monthlyReport"))return;fillExpenseCategories();let dEl=document.getElementById("expDate");if(dEl&&!dEl.value)dEl.value=new Date().toISOString().slice(0,10);if(!document.getElementById("reportMode"))setReportMode("month");else financeReport()}function initCustomers(){let f=document.getElementById("customerForm");if(!f)return;let q=new URLSearchParams(location.search),editId=q.get("edit"),existing=editId?arr(K.c).find(x=>x.id===editId):null;fillCenters(cCenter,existing?.mainAddress?.center||"");fillCenters(aCenter,existing?.extraAddress?.center||"");function sync(){fillVillages(cVillage,cCenter.value,existing?.mainAddress?.village||"");fillVillages(aVillage,aCenter.value,existing?.extraAddress?.village||"")}cCenter.onchange=()=>fillVillages(cVillage,cCenter.value);aCenter.onchange=()=>fillVillages(aVillage,aCenter.value);if(existing){cName.value=existing.name||"";cPhone.value=existing.phone||"";cStreet.value=existing.mainAddress?.street||"";aStreet.value=existing.extraAddress?.street||"";document.querySelector("#customerForm").classList.remove("hidden");document.querySelector("#customerForm .primary").textContent="💾 حفظ التعديلات وفتح الملف";setTimeout(sync,0)}else{if(q.get("add"))document.querySelector("#customerForm").classList.remove("hidden");sync()}f.onsubmit=e=>{e.preventDefault();let c=existing||{id:id(),createdAt:new Date().toISOString()};c.name=cName.value.trim();c.phone=cPhone.value.trim();let duplicate=duplicateCustomerByPhone(c.phone,existing?.id||"");if(duplicate){if(!confirm(`⚠️ رقم الهاتف ${c.phone} مسجل بالفعل للعميل: ${duplicate.name||"—"}.\n\nهل تريد المتابعة وإنشاء/حفظ عميل آخر بنفس الرقم؟`))return;}c.mainAddress={center:cCenter.value,village:cVillage.value,address:"",street:cStreet.value.trim()};c.extraAddress={center:aCenter.value,village:aVillage.value,address:"",street:aStreet.value.trim()};let a=arr(K.c);if(existing){put(K.c,a.map(x=>x.id===c.id?c:x))}else{a.push(c);put(K.c,a)}location.href=`customer.html?id=${c.id}`};customerSearch.oninput=renderCustomers;if(document.getElementById("customerCenterFilter")){let cf=document.getElementById("customerCenterFilter");cf.innerHTML='<option value="">🗺️ كل المراكز</option>'+(settings().centers||[]).map(x=>`<option>${esc(x)}</option>`).join("");cf.onchange=renderCustomers}renderCustomers()}
function psActions(title){return window.psInlineActions?window.psInlineActions(title):`<span class="ps-inline-actions no-print"><button type="button" class="ps-icon-btn" title="طباعة" onclick="printWorkshopTarget(this)">🖨️</button><button type="button" class="ps-icon-btn" title="مشاركة" onclick="shareWorkshopTarget(this)">↗️</button></span>`}
function renderCustomers(){let el=document.getElementById("customerList");if(!el)return;let q=(customerSearch?.value||"").toLowerCase(),cf=document.getElementById("customerCenterFilter")?.value||"",a=arr(K.c).filter(c=>(c.name+" "+c.phone+" "+addressText(c.mainAddress)).toLowerCase().includes(q)&&(!cf||c.mainAddress?.center===cf));el.innerHTML=a.length?a.map(c=>`<div class="item record-card ps-context-target" data-ps-title="العميل ${esc(c.name)}"><div class="card-side-actions"><a class="primary small-btn" href="customer.html?id=${c.id}">فتح 360°</a><button class="danger-btn small-btn" type="button" onclick="deleteCustomerRecord('${c.id}')">🗑️ حذف</button></div><div class="record-main"><div class="item-head"><a href="customer.html?id=${c.id}"><b>👤 ${esc(c.name)}</b></a><span class="badge">🔧 ${arr(K.d).filter(d=>d.customerId===c.id).length} أجهزة • 🛠️ ${arr(K.r).filter(r=>r.customerId===c.id).length} أوامر</span></div><div>📞 ${esc(c.phone)}</div><div>📍 ${esc(addressText(c.mainAddress))}</div></div></div>`).join(""):'<div class="item">لا توجد نتائج.</div>'}
function customerProfile(){let el=document.getElementById("customerProfile");if(!el)return;let c=arr(K.c).find(x=>x.id===new URLSearchParams(location.search).get("id"));if(!c){el.innerHTML="<div class='item'>العميل غير موجود.</div>";return}let ds=arr(K.d).filter(d=>d.customerId===c.id),rs=arr(K.r).filter(r=>r.customerId===c.id);el.innerHTML=`<div class="profile ps-context-target" data-ps-title="العميل ${esc(c.name)}"><div class="page-head"><h1 class="profile-title">👤 ${esc(c.name)}</h1><div class="compact-actions"><button class="secondary" onclick="editCustomer('${c.id}')">✏️ تعديل</button>${psActions("العميل "+c.name)}<a class="primary" href="devices.html?customer=${c.id}">➕ جهاز</a> <a class="primary" href="requests.html?customer=${c.id}">➕ أمر شغل</a></div></div><div class="profile-grid"><div class="kv"><b>📞 التليفون</b>${contactLinksHtml(c.phone)}</div><div class="kv"><b>📍 العنوان الأساسي</b>${esc(addressText(c.mainAddress))}</div><div class="kv"><b>📍 العنوان الإضافي</b>${(c.extraAddress&&(c.extraAddress.center||c.extraAddress.village||c.extraAddress.street))?esc(addressText(c.extraAddress)):"—"}</div><div class="kv"><b>📊 الملخص</b>${ds.length} أجهزة • ${rs.length} أوامر</div></div></div><h2>🔧 الأجهزة</h2>${ds.length?ds.map(d=>`<div class="item"><a href="device.html?id=${d.id}"><b>${esc(d.type)} — ${esc(d.brand)}</b></a><div>${esc(d.category)} • ${esc(d.model||"بدون موديل")}</div><a class="secondary" href="requests.html?customer=${c.id}&device=${d.id}">🛠️ أمر شغل</a></div>`).join(""):"<div class='item'>لا توجد أجهزة.</div>"}<h2>🛠️ أوامر الشغل</h2>${rs.length?rs.map(r=>`<div class="item"><a href="request.html?id=${r.id}"><b>${esc(r.no)}</b></a> <span class="badge">${esc(r.status)}${r.closed?" 🔒":""}</span><div>${esc(deviceName(r.deviceId))} • الإجمالي ${(+r.total||0).toFixed(2)} ج</div></div>`).join(""):"<div class='item'>لا توجد أوامر.</div>"}`}
function initDevices(){let f=document.getElementById("deviceForm");if(!f)return;let q=new URLSearchParams(location.search),editId=q.get("edit"),existing=editId?arr(K.d).find(x=>x.id===editId):null;fillCustomer(dCustomer,existing?.customerId||q.get("customer")||"");fillTypes(dType,existing?.type||"");fillBrands(dBrand,existing?.brand||"");function syncAddr(){fillAddress(dAddress,dCustomer.value,existing?.addressKey||"main")}function syncCat(){fillCats(dCategory,dType.value,existing?.category||"")}dCustomer.onchange=()=>{syncAddr()};dType.onchange=syncCat;dPhoto.onchange=previewImage;syncAddr();syncCat();if(existing){dModel.value=existing.model||"";dDesc.value=existing.desc||"";if(existing.photo)photoPreview.innerHTML=`<img class="photo" src="${existing.photo}">`;document.querySelector("#deviceForm").classList.remove("hidden");document.getElementById("deviceSubmitBtn").textContent="💾 حفظ التعديلات وفتح الملف"}else if(q.get("customer")||q.get("add")){document.querySelector("#deviceForm").classList.remove("hidden")}f.onsubmit=e=>saveDevice(e,existing);document.getElementById("deviceSearch")?.addEventListener("input",renderDevices);if(document.getElementById("deviceCenterFilter")){let cf=document.getElementById("deviceCenterFilter");cf.innerHTML='<option value="">🗺️ كل المراكز</option>'+(settings().centers||[]).map(x=>`<option>${esc(x)}</option>`).join("");cf.onchange=renderDevices}renderDevices()}
function previewImage(e){let file=e.target.files[0],out=document.getElementById("photoPreview");if(!file)return;let r=new FileReader();r.onload=()=>out.innerHTML=`<img class="photo" src="${r.result}">`;r.readAsDataURL(file)}
async function saveDevice(e,existing=null){e.preventDefault();try{let photo=dPhoto.files[0]?await imageToDataURL(dPhoto.files[0]):(existing?.photo||"");let d=existing||{id:id(),createdAt:new Date().toISOString()};Object.assign(d,{customerId:dCustomer.value,addressKey:dAddress.value,type:dType.value,category:dCategory.value,brand:dBrand.value,model:dModel.value,desc:dDesc.value,photo});let a=arr(K.d);if(!saveJSONSafe(K.d,existing?a.map(x=>x.id===d.id?d:x):a.concat(d)))return;location.href=`device.html?id=${d.id}`}catch(err){alert("تعذر حفظ صورة الجهاز. جرّب صورة أخرى أصغر.")}}
function renderDevices(){let el=document.getElementById("deviceList");if(!el)return;let q=(document.getElementById("deviceSearch")?.value||"").toLowerCase().trim();let cf=document.getElementById("deviceCenterFilter")?.value||"";let a=arr(K.d).filter(d=>{let c=arr(K.c).find(x=>x.id===d.customerId)||{};let text=(c.name||"")+" "+(c.phone||"")+" "+addressText(c.mainAddress||{})+" "+addressText(c.extraAddress||{});return text.toLowerCase().includes(q)&&(!cf||c.mainAddress?.center===cf)});el.innerHTML=a.length?a.map(d=>`<div class="item record-card ps-context-target" data-ps-title="${esc(d.type)} ${esc(d.brand)}"><div class="card-side-actions"><a class="primary small-btn" href="device.html?id=${d.id}">فتح 360°</a><button class="danger-btn small-btn" type="button" onclick="deleteDeviceRecord('${d.id}')">🗑️ حذف</button></div><div class="record-main"><div class="item-head"><a href="device.html?id=${d.id}"><b>🔧 ${esc(d.type)} — ${esc(d.brand)}</b></a><span class="badge">${esc(customerName(d.customerId))}</span></div><div>📍 ${esc(addressText((arr(K.c).find(c=>c.id===d.customerId)||{}).mainAddress||{}))}</div><div>${esc(d.category)} • ${esc(d.model||"—")}</div></div></div>`).join(""):'<div class="item">لا توجد أجهزة.</div>'}

function deviceProfile(){let el=document.getElementById("deviceProfile");if(!el)return;let d=arr(K.d).find(x=>x.id===new URLSearchParams(location.search).get("id"));if(!d){el.innerHTML="<div class='item'>الجهاز غير موجود.</div>";return}let rs=arr(K.r).filter(r=>r.deviceId===d.id);el.innerHTML=`<div class="profile ps-context-target" data-ps-title="${esc(d.type)} — ${esc(d.brand)}"><div class="page-head"><h1 class="profile-title">🔧 ${esc(d.type)} — ${esc(d.brand)}</h1><div class="compact-actions"><button class="secondary" onclick="editDevice('${d.id}')">✏️ تعديل</button>${psActions(d.type+" — "+d.brand)}<a class="primary" href="requests.html?customer=${d.customerId}&device=${d.id}">➕ أمر شغل</a></div></div><div class="profile-grid"><div class="kv"><b>👤 العميل</b><a href="customer.html?id=${d.customerId}">${esc(customerName(d.customerId))}</a></div><div class="kv"><b>📞 التليفون</b>${contactLinksHtml((arr(K.c).find(c=>c.id===d.customerId)||{}).phone)}</div><div class="kv"><b>📍 العنوان</b>${esc(addressText((arr(K.c).find(c=>c.id===d.customerId)||{}).mainAddress||{}))}</div><div class="kv"><b>النوع / التصنيف</b>${esc(d.type)} / ${esc(d.category)}</div><div class="kv"><b>الموديل</b>${esc(d.model)||"—"}</div></div>${d.photo?`<img class="photo" src="${d.photo}">`:""}<h2>🛠️ سجل أوامر الشغل</h2>${rs.length?rs.map(r=>`<div class="item"><a href="request.html?id=${r.id}"><b>${esc(r.no)}</b></a> <span class="badge">${esc(r.status)}</span>${r.workshopStatus&&r.workshopStatus!=="غير مطلوب"?`<span class="badge workshop-badge">🏭 ${esc(r.workshopStatus)}</span>`:""}<div>${esc(r.fault)}</div></div>`).join(""):"<div class='item'>لا يوجد سجل.</div>"}</div>`}
function initRequests(){let f=document.getElementById("requestForm");if(!f)return;let q=new URLSearchParams(location.search),editId=q.get("edit"),existing=editId?arr(K.r).find(x=>x.id===editId):null;if(existing?.closed){alert("أمر الشغل مغلق نهائيًا ولا يمكن تعديله.");location.href=`request.html?id=${existing.id}`;return}currentParts=existing?.parts?existing.parts.map(x=>({...x})):[];fillCustomer(rCustomer,existing?.customerId||q.get("customer")||"");fillAddress(rAddress,rCustomer.value,existing?.addressKey||"main");fillDevice(rDevice,rCustomer.value,existing?.deviceId||q.get("device")||"");let s=settings(),defPriority=existing?.priority||(s.priorities||[])[0]||"عادية",defPlace=existing?.executionPlace||(s.executionPlaces||[])[0]||"عند العميل",defWs=existing?.workshopStatus||(s.workshopStatuses||[])[0]||"غير مطلوب",defStatus=existing?.status||(s.orderStatuses||[])[0]||"جديد";fillList(rPriority,"priorities",defPriority,"اختر الأولوية");fillList(rExecutionPlace,"executionPlaces",defPlace,"اختر مكان التنفيذ");fillList(rWorkshopStatus,"workshopStatuses",defWs,"اختر حالة الورشة");fillList(rStatus,"orderStatuses",defStatus,"اختر الحالة");if(document.getElementById("rTag"))fillList(rTag,"orderTags",existing?.tag||"","🏷️ بدون تصنيف");rCustomer.onchange=()=>{fillAddress(rAddress,rCustomer.value,"main");fillDevice(rDevice,rCustomer.value,"")};rVisit.onchange=()=>{if(rVisit.value&&rStatus.value==="جديد")rStatus.value="مجدول"};rLabor.oninput=calc;rDeposit.oninput=calc;rPart.innerHTML='<option value="">اختر قطعة</option>'+arr(K.p).map(p=>`<option value="${p.id}">${esc(p.name)} — ${p.use||0} ج — ${p.qty} متاح</option>`).join("");if(existing){rVisit.value=existing.visit||"";rFault.value=existing.fault||"";rWork.value=existing.work||"";rLabor.value=(+existing.labor||0).toFixed(2);rDeposit.value=existing.deposit||0;renderOrderParts();f.classList.remove("hidden");f.querySelector("#requestSubmitBtn").textContent="💾 حفظ التعديلات وفتح أمر الشغل"}else if(q.get("customer")||q.get("device")||q.get("add")){f.classList.remove("hidden")}f.onsubmit=e=>saveRequest(e,existing);document.getElementById("requestSearch")?.addEventListener("input",renderRequests);document.getElementById("statusFilter")?.addEventListener("change",renderRequests);document.getElementById("workshopFilter")?.addEventListener("change",renderRequests);renderRequests();calc()}
function fillDevice(el,cid,selected=""){el.innerHTML='<option value="">اختر الجهاز</option>'+arr(K.d).filter(d=>d.customerId===cid).map(d=>`<option value="${d.id}" ${d.id===selected?"selected":""}>${esc(d.type)} — ${esc(d.brand)}</option>`).join("")}
let currentParts=[];
function partsStockTotal(list){return (list||[]).reduce((a,x)=>a+(+x.qty||0)*(+x.sell||0),0)}
function partsStockCost(list){return (list||[]).reduce((a,x)=>a+(+x.qty||0)*(+x.cost||0),0)}
function addPartToOrder(){let select=document.getElementById("rPart"),option=select?.selectedOptions?.[0],pid=select?.value||select?.dataset.selectedPart||option?.dataset.partId||"",q=+(document.getElementById("rPartQty")?.value||1),p=arr(K.p).find(x=>x.id===pid);if(!pid||!p)return alert("اختر قطعة الغيار أولًا.");if(!Number.isFinite(q)||q<1)return alert("اكتب كمية صحيحة.");if(q>+(p.qty||0))return alert(`الكمية المطلوبة ${q} أكبر من المتاح ${p.qty||0}.`);let existing=currentParts.find(x=>!x.external&&x.partId===pid&&+x.sell===+p.use&&+x.cost===+p.buy);if(existing)existing.qty=(+existing.qty||0)+q;else currentParts.push({partId:pid,qty:q,sell:+p.use||0,cost:+p.buy||0});renderOrderParts();calc();if(select){select.value="";select.dataset.selectedPart=""}if(document.getElementById("rPartQty"))document.getElementById("rPartQty").value=1}
function addExternalPartToOrder(){let nameEl=document.getElementById("rExtName"),buyEl=document.getElementById("rExtBuy"),sellEl=document.getElementById("rExtSell"),qtyEl=document.getElementById("rExtQty");let name=(nameEl?.value||"").trim();if(!name)return alert("اكتب اسم القطعة.");let cost=+(buyEl?.value||0),sell=+(sellEl?.value||0),q=+(qtyEl?.value||1);if(!Number.isFinite(q)||q<1)q=1;if(!Number.isFinite(cost)||cost<0||!Number.isFinite(sell)||sell<0)return alert("اكتب أسعار صحيحة.");currentParts.push({external:true,name,qty:q,sell,cost});renderOrderParts();calc();if(nameEl)nameEl.value="";if(buyEl)buyEl.value="";if(sellEl)sellEl.value="";if(qtyEl)qtyEl.value=1}
function renderOrderParts(){let el=document.getElementById("orderParts");el.innerHTML=currentParts.map((x,i)=>{let p=x.external?null:arr(K.p).find(z=>z.id===x.partId);let nm=x.external?(x.name||"قطعة خارجية"):(p?.name||"قطعة محذوفة");let amount=x.qty*x.sell;let amountLabel=`${amount.toFixed(2)} ج`;return `<div class="part-row${x.external?" part-row-external":""}"><span>${x.external?"🧳 ":""}${esc(nm)}${x.external?` <small class="ext-badge">خارج المخزن</small>`:""}</span><input type="number" min="1" value="${x.qty}" onchange="currentParts[${i}].qty=+this.value;calc();renderOrderParts()"><span title="${x.external?`سعر الشراء ${(+x.cost||0).toFixed(2)} ج`:""}">${amountLabel}</span><button type="button" class="secondary" onclick="currentParts.splice(${i},1);renderOrderParts();calc()">🗑️</button></div>`}).join("")}
function calc(){let ps=partsStockTotal(currentParts),t=ps+(+rLabor.value||0),dep=+rDeposit.value||0;rPartsTotal.value=ps.toFixed(2);rTotal.value=t.toFixed(2);remainBox.classList.toggle("hidden",dep<=0);rRemain.value=Math.max(0,t-dep).toFixed(2)}
function adjustStockForOrder(oldParts,newParts,requestId){let stock=arr(K.p),moves=arr(K.m),delta={};oldParts.filter(x=>x.partId&&!x.external).forEach(x=>delta[x.partId]=(delta[x.partId]||0)+x.qty);newParts.filter(x=>x.partId&&!x.external).forEach(x=>delta[x.partId]=(delta[x.partId]||0)-x.qty);for(let [pid,d] of Object.entries(delta)){if(!d)continue;let p=stock.find(z=>z.id===pid);if(!p)continue;if(d>0)p.qty=(+p.qty||0)+d;else{let need=-d;if(need>(+p.qty||0))return false;p.qty=(+p.qty||0)-need}moves.push({id:id(),partId:pid,type:d>0?"إرجاع بسبب تعديل أمر":"خروج بسبب تعديل أمر",qty:Math.abs(d),requestId,at:new Date().toISOString()})}put(K.p,stock);put(K.m,moves);return true}
function saveRequest(e,existing=null){e.preventDefault();let t=+rTotal.value||0,dep=+rDeposit.value||0,tag=document.getElementById("rTag")?rTag.value:(existing?.tag||"");let partsCost=partsStockCost(currentParts);let laborTotal=(+rLabor.value||0);if(existing){let oldParts=existing.parts||[];let backup=JSON.stringify(arr(K.p));if(!adjustStockForOrder(oldParts,currentParts,existing.id)){put(K.p,JSON.parse(backup));return alert("الكمية الجديدة غير متاحة في المخزن.")}Object.assign(existing,{customerId:rCustomer.value,deviceId:rDevice.value,addressKey:rAddress.value,priority:rPriority.value,visit:rVisit.value,status:rStatus.value,executionPlace:rExecutionPlace.value,workshopStatus:rWorkshopStatus.value,partsWaiting:!!document.getElementById("rPartsWaiting")?.checked,tag,fault:rFault.value,work:rWork.value,labor:laborTotal,parts:currentParts,partsTotal:+rPartsTotal.value||0,partsCost,total:t,deposit:dep,remain:Math.max(0,t-dep)});applyStatusTimestamp(existing,existing.status);put(K.r,arr(K.r).map(x=>x.id===existing.id?existing:x));syncTreasuryForOrderDeposit(existing);location.href=`request.html?id=${existing.id}`;return}let r={id:id(),no:orderNo(),customerId:rCustomer.value,deviceId:rDevice.value,addressKey:rAddress.value,priority:rPriority.value,visit:rVisit.value,status:rStatus.value,executionPlace:rExecutionPlace.value,workshopStatus:rWorkshopStatus.value,partsWaiting:!!document.getElementById("rPartsWaiting")?.checked,tag,fault:rFault.value,work:rWork.value,labor:laborTotal,parts:currentParts,partsTotal:+rPartsTotal.value||0,partsCost,total:t,deposit:dep,remain:Math.max(0,t-dep),closed:false,createdAt:new Date().toISOString()};applyStatusTimestamp(r,r.status);let stock=arr(K.p),moves=arr(K.m);currentParts.filter(x=>!x.external).forEach(x=>{let p=stock.find(z=>z.id===x.partId);if(p){p.qty=Math.max(0,(+p.qty||0)-x.qty);moves.push({id:id(),partId:p.id,type:"خروج",qty:x.qty,requestId:r.id,at:new Date().toISOString()})}});put(K.p,stock);put(K.m,moves);put(K.r,arr(K.r).concat(r));syncTreasuryForOrderDeposit(r);location.href=`request.html?id=${r.id}`}
function requestScheduleSummary(){let el=document.getElementById("requestSchedule");if(!el)return;let today=new Date();today.setHours(0,0,0,0);let groups={};arr(K.r).filter(r=>r.visit&&!r.closed&&r.status!=="ملغي").forEach(r=>{let d=new Date(r.visit);if(Number.isNaN(d.getTime()))return;d.setHours(0,0,0,0);if(d<today)return;let k=localDateKey(d);(groups[k]??=[]).push(r)});let keys=Object.keys(groups).sort();if(!keys.length){el.innerHTML=`<div class="schedule-empty">📅 لا توجد مواعيد مجدولة قادمة.</div>`;return}el.innerHTML=`<div class="schedule-head"><b>📅 المواعيد القادمة</b><span>عدد المواعيد: ${keys.reduce((n,k)=>n+groups[k].length,0)}</span></div><div class="schedule-table"><div class="schedule-row schedule-header"><span>التاريخ</span><span>العدد</span><span>الأوامر</span></div>${keys.map(k=>{let ds=groups[k],d=new Date(k+"T00:00:00");return `<div class="schedule-row"><strong>${d.toLocaleDateString("ar-EG",{day:"2-digit",month:"2-digit"})}</strong><b>${ds.length}</b><span>${ds.map(r=>`<a href="request.html?id=${r.id}">${esc(r.no)}</a>`).join(" • ")}</span></div>`}).join("")}</div>`}
function workshopBadge(r){return r.workshopStatus&&r.workshopStatus!=="غير مطلوب"?`<span class="badge workshop-badge">🏭 ${esc(r.workshopStatus)}</span>`:""}
function requestBucketMatch(r,b){
  const today=new Date().toISOString().slice(0,10), visit=String(r.visit||"").slice(0,10);
  if(b==="completed") return !!r.closed || r.status==="مكتمل";
  if(b==="workshop") return r.executionPlace==="الورشة" || (r.workshopStatus&&r.workshopStatus!=="غير مطلوب");
  if(b==="today") return !!r.visit && visit===today;
  if(b==="parts") return r.partsWaiting===true || r.partsWaiting==="yes";
  if(b==="overdue") return !!r.visit && visit<today && !r.closed && r.status!=="مكتمل" && r.status!=="ملغي";
  return true;
}
function renderRequestFolders(){
  const el=document.getElementById("requestFolders"); if(!el)return;
  const all=arr(K.r), today=new Date().toISOString().slice(0,10);
  const counts={completed:all.filter(r=>requestBucketMatch(r,"completed")).length,workshop:all.filter(r=>requestBucketMatch(r,"workshop")).length,today:all.filter(r=>requestBucketMatch(r,"today")).length,parts:all.filter(r=>requestBucketMatch(r,"parts")).length,overdue:all.filter(r=>requestBucketMatch(r,"overdue")).length};
  el.innerHTML=`<div class="request-folders-grid"><a class="request-folder" href="requests.html?bucket=completed"><span>✅</span><b>الأوامر المكتملة</b><small>${counts.completed} أمر</small></a><a class="request-folder" href="requests.html?bucket=workshop"><span>🏭</span><b>أوامر الورشة</b><small>${counts.workshop} أمر</small></a><a class="request-folder" href="requests.html?bucket=today"><span>📅</span><b>أوامر اليوم</b><small>${counts.today} موعد</small></a><a class="request-folder" href="requests.html?bucket=parts"><span>📦</span><b>انتظار قطع غيار</b><small>${counts.parts} أمر</small></a><a class="request-folder" href="requests.html?bucket=overdue"><span>⚠️</span><b>متأخر / لم يُنفذ</b><small>${counts.overdue} أمر</small></a></div>`;
}
function renderRequests(){let el=document.getElementById("requestList");if(!el)return;renderRequestFolders();let q=(document.getElementById("requestSearch")?.value||"").toLowerCase(),sf=document.getElementById("statusFilter")?.value||"",wf=document.getElementById("workshopFilter")?.value||"",bucket=new URLSearchParams(location.search).get("bucket")||"";let a=arr(K.r).filter(r=>{let text=(r.no+" "+customerName(r.customerId)+" "+r.fault).toLowerCase();let okW=wf===""||(wf==="workshop"&&r.executionPlace==="الورشة")||(wf==="pull"&&r.workshopStatus&&r.workshopStatus!=="غير مطلوب"&&r.workshopStatus!=="تم التسليم")||(wf==="inside"&&["تم السحب","استلام الورشة","تحت الإصلاح","جاهز للتسليم"].includes(r.workshopStatus));return text.includes(q)&&(sf===""||r.status===sf)&&okW&&requestBucketMatch(r,bucket)});let statuses=["جديد","تم التواصل","مجدول","جاري الفحص","انتظار موافقة العميل","تحت الإصلاح","مكتمل","ملغي"];el.innerHTML=a.length?a.map(r=>`<div class="item record-card ps-context-target" data-ps-title="أمر الشغل ${esc(r.no)}"><div class="card-side-actions"><a class="primary small-btn" href="request.html?id=${r.id}">فتح 360°</a>${!r.closed&&!r.paid?`<a class="secondary small-btn" href="requests.html?edit=${r.id}">✏️ تعديل</a>`:""}<button class="danger-btn small-btn" type="button" onclick="deleteRequestRecord('${r.id}')">🗑️ حذف</button></div><div class="record-main"><div class="item-head"><a href="request.html?id=${r.id}"><b>🛠️ ${esc(r.no)}</b></a>${r.closed?'<span class="badge">🔒 مغلق</span>':`<select class="inline-status" onchange="changeRequestStatus('${r.id}',this.value)">${statuses.map(x=>`<option ${r.status===x?"selected":""}>${x}</option>`).join("")}</select>`}${requestBucketMatch(r,"overdue")?'<span class="badge">⚠️ لم يُنفذ</span>':""}${requestBucketMatch(r,"parts")?'<span class="badge">📦 انتظار قطع غيار</span>':""}</div><div>👤 ${esc(customerName(r.customerId))} • 🔧 ${esc(deviceName(r.deviceId))}</div><div>📅 ${r.visit?new Date(r.visit).toLocaleString("ar-EG",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"بدون موعد"} • ${r.executionPlace==="الورشة"?"🏭 الورشة":"🏠 عند العميل"}</div>${workshopBadge(r)}<div>💰 الإجمالي ${(+r.total||0).toFixed(2)} ج • 💵 العربون ${(+r.deposit||0).toFixed(2)} ج</div></div></div>`).join(""):'<div class="item">لا توجد أوامر.</div>';requestScheduleSummary()}

function requestProfile(){let el=document.getElementById("requestProfile");if(!el)return;let r=arr(K.r).find(x=>x.id===new URLSearchParams(location.search).get("id"));if(!r){el.innerHTML="<div class='item'>الأمر غير موجود.</div>";return}let parts=(r.parts||[]).map(x=>{let p=x.external?null:arr(K.p).find(z=>z.id===x.partId);let nm=x.external?(x.name||"قطعة خارجية"):(p?.name||"قطعة محذوفة");let amount=(x.qty||0)*(x.sell||0);let amountLabel=`${amount.toFixed(2)} ج`;let extCost=x.external?`<div class="ext-cost-note">💵 سعر الشراء: ${(+x.cost||0).toFixed(2)} ج × ${x.qty} = ${((+x.cost||0)*(x.qty||0)).toFixed(2)} ج</div>`:"";return `<div class="part-row compact-part${x.external?" part-row-external":""}"><span>${x.external?"🧳":"🔧"} ${esc(nm)}${x.external?' <small class="ext-badge">خارج المخزن</small>':""}${extCost}</span><span>× ${x.qty}</span><strong>${amountLabel}</strong></div>`}).join("");let canEdit=!r.closed&&!r.paid;let cust=arr(K.c).find(c=>c.id===r.customerId)||{};let custPhone=(cust.phone||"").trim();let stockOptions=arr(K.p).map(p=>`<option value="${esc(p.id)}" data-part-id="${esc(p.id)}" data-qty="${+p.qty||0}">${esc(p.name)} — ${(+p.use||0).toFixed(2)} ج — ${+p.qty||0} متاح</option>`).join("");let paid=!!r.paid;let ws=r.workshopStatus||"غير مطلوب";let workshopTrack=ws!=="غير مطلوب"?`<div class="workshop-track"><h3>🏭 متابعة الجهاز داخل الورشة</h3><div class="workshop-state"><b>${esc(ws)}</b>${r.workshopAt?`<small>آخر تحديث: ${new Date(r.workshopAt).toLocaleString("ar-EG")}</small>`:""}${r.pulledAt?`<small>📦 تم سحب الجهاز: ${new Date(r.pulledAt).toLocaleString("ar-EG")}</small>`:""}</div><div class="workshop-actions">${["تم السحب","استلام الورشة","تحت الإصلاح","جاهز للتسليم","تم التسليم"].map(x=>`<button type="button" class="secondary mini-action ${ws===x?"active-track":""}" onclick="setWorkshopStatus('${r.id}','${x}')">${x}</button>`).join("")}</div></div>`:`<div class="workshop-track"><h3>🏭 سحب الجهاز للورشة</h3><div class="hint">لو الجهاز يحتاج إصلاح داخل الورشة، سجّل سحبه هنا وسيظهر في أوامر الورشة ويمكن متابعة حالته حتى التسليم.</div><button type="button" class="secondary mini-action workshop-pull" onclick="requestWorkshopPull('${r.id}')">📦 سحب الجهاز للورشة</button></div>`;el.innerHTML=`<div class="profile request-one-page ps-context-target" data-ps-title="أمر الشغل ${esc(r.no)}"><div class="request-top"><div><h1 class="profile-title request-title">🛠️ ${esc(r.no)}</h1>${psActions("أمر الشغل "+r.no)}<span class="badge">${paid?"مدفوع بالكامل":esc(r.status)}${r.closed?" 🔒":""}</span></div><div class="compact-actions">${canEdit?`<button class='secondary mini-action' onclick="editRequest('${r.id}')">✏️ تعديل</button>`:""}</div></div><div class="request-grid"><div class="kv"><b>👤 العميل</b><a href="customer.html?id=${r.customerId}">${esc(customerName(r.customerId))}</a></div><div class="kv"><b>📞 التليفون</b>${contactLinksHtml(custPhone)}</div><div class="kv"><b>🔧 الجهاز</b><a href="device.html?id=${r.deviceId}">${esc(deviceName(r.deviceId))}</a></div><div class="kv"><b>📍 العنوان</b>${esc(addressText((arr(K.c).find(c=>c.id===r.customerId)||{}).mainAddress||{}))}</div><div class="kv"><b>⭐ الأولوية</b>${esc(r.priority||"عادية")}</div><div class="kv"><b>🏷️ التصنيف اليدوي</b>${canEdit?`<select class="inline-status" onchange="changeRequestTag('${r.id}',this.value)"><option value="" ${!r.tag?"selected":""}>بدون تصنيف</option>${(settings().orderTags||[]).map(x=>`<option ${r.tag===x?"selected":""}>${esc(x)}</option>`).join("")}<option value="__add__">➕ إضافة تصنيف جديد…</option></select>`:(esc(r.tag)||"بدون تصنيف")}</div><div class="kv"><b>📅 موعد الزيارة</b>${canEdit?`<input type="datetime-local" class="inline-status" value="${r.visit||""}" onchange="changeRequestVisit('${r.id}',this.value)">`:(r.visit?esc(new Date(r.visit).toLocaleString("ar-EG")) : "—")}</div><div class="kv"><b>🏠 التنفيذ</b>${r.executionPlace==="الورشة"?"🏭 الورشة":"🏠 عند العميل"}</div><div class="kv"><b>🧾 الحالة</b>${canEdit?`<select class="inline-status" onchange="changeRequestStatus('${r.id}',this.value)">${(settings().orderStatuses||[]).map(x=>`<option ${r.status===x?"selected":""}>${esc(x)}</option>`).join("")}</select>`:esc(r.status)}</div><div class="kv"><b>✅ تاريخ الانتهاء</b>${r.completedAt?esc(new Date(r.completedAt).toLocaleString("ar-EG")):"—"}</div><div class="kv"><b>🏭 حالة الورشة</b>${esc(ws)}</div><div class="kv request-wide"><b>📝 العطل</b>${esc(r.fault)||"—"}</div><div class="kv request-wide"><b>🔨 الأعمال</b>${esc(r.work)||"—"}</div><div class="request-account"><h3>💰 الحساب</h3><table class="month-table compact-money"><tr><td>🔨 المصنعية</td><td>${(+r.labor||0).toFixed(2)} ج</td></tr><tr><td>🔧 قطع الغيار</td><td>${(+r.partsTotal||0).toFixed(2)} ج</td></tr><tr class="total-row"><td>💰 الإجمالي</td><td>${(+r.total||0).toFixed(2)} ج</td></tr><tr><td>💵 العربون</td><td>${(+r.deposit||0).toFixed(2)} ج</td></tr><tr><td>💳 حالة الدفع</td><td>${paid?"تم الدفع بالكامل":"غير مكتمل"}</td></tr></table>${!r.closed&&r.status==="مكتمل"&&!paid?`<button type="button" class="primary pay-close-btn" onclick="markPaidAndClose('${r.id}')">💳 تم الدفع بالكامل وإغلاق الأمر</button>`:""}</div><div class="request-parts"><h3>🔧 قطع الغيار المستخدمة</h3>${parts||"<div class='empty-inline'>لا توجد قطع غيار مضافة.</div>"}${canEdit?`<div class="part-add request-part-add"><select id="rpPart" onchange="syncRequestPartQty()"><option value="">اختر قطعة</option>${stockOptions}</select><input id="rpQty" type="number" min="1" value="1" inputmode="numeric"><button type="button" class="primary mini-action" onclick="confirmAddPartToRequest('${r.id}')">➕ إضافة من المخزن</button></div><div id="rpStockHint" class="hint">اختر قطعة لمعرفة الكمية المتاحة.</div><div class="part-add request-part-add part-add-external"><input id="rpExtName" type="text" placeholder="اسم القطعة (خارج المخزن)"><input id="rpExtBuy" type="number" min="0" step=".01" placeholder="سعر الشراء"><input id="rpExtSell" type="number" min="0" step=".01" placeholder="سعر البيع"><input id="rpExtQty" type="number" min="1" value="1" inputmode="numeric"><button type="button" class="secondary mini-action" onclick="confirmAddExternalPartToRequest('${r.id}')">🧳 إضافة قطعة خارج المخزن</button></div><div class="hint">قطعة خارج المخزن: بتتسجل بسعر البيع بالكامل ضمن "قطع الغيار" واحتساب الإجمالي زي أي قطعة عادية بالظبط، وسعر الشراء بيظهر كملاحظة بس للمرجعية. مالهاش أي علاقة بكمية المخزن أو رصيده أو بند "المصنعية".</div>`:""}</div>${workshopTrack}</div></div>`}
function requestWorkshopPull(i){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;if(r.workshopStatus&&r.workshopStatus!=="غير مطلوب")return;if(!confirm("تأكيد سحب الجهاز إلى الورشة؟"))return;r.executionPlace="الورشة";r.workshopStatus="تم السحب";r.workshopAt=new Date().toISOString();r.pulledAt=r.workshopAt;put(K.r,a);requestProfile()}
function setWorkshopStatus(i,status){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;r.executionPlace="الورشة";r.workshopStatus=status;r.workshopAt=new Date().toISOString();put(K.r,a);requestProfile()}

function syncRequestPartQty(){let s=document.getElementById("rpPart"),q=document.getElementById("rpQty"),h=document.getElementById("rpStockHint"),o=s?.selectedOptions?.[0],selectedId=s?.value||s?.dataset.selectedPart||o?.dataset.partId||"",available=o?+(o.dataset.qty||0):+(arr(K.p).find(x=>x.id===selectedId)?.qty||0);if(s)s.dataset.selectedPart=selectedId;if(q&&selectedId){q.max=Math.max(1,available);q.value=Math.min(Math.max(1,+q.value||1),Math.max(1,available));if(available<1)q.value=0}if(h)h.textContent=selectedId?`المتاح في المخزن: ${available} قطعة — سيتم استخدام الكمية المكتوبة فقط.`:"اختر قطعة لمعرفة الكمية المتاحة."}
function confirmAddPartToRequest(requestId){let rs=arr(K.r),r=rs.find(x=>x.id===requestId);if(!r)return alert("أمر الشغل غير موجود.");if(r.closed||r.paid)return alert("الأمر مغلق أو مدفوع بالكامل ولا يمكن إضافة قطع غيار.");let select=document.getElementById("rpPart"),option=select?.selectedOptions?.[0],pid=select?.value||select?.dataset.selectedPart||option?.dataset.partId||"";if(!pid)return alert("اختر قطعة الغيار أولًا ثم اضغط تأكيد إضافة القطعة.");let q=+(document.getElementById("rpQty")?.value||1),stock=arr(K.p),p=stock.find(x=>x.id===pid),available=+(p?.qty||0);if(!p)return alert("قطعة الغيار المختارة غير موجودة في المخزن.");if(!Number.isFinite(q)||q<1)return alert("اكتب كمية صحيحة.");if(available<q)return alert(`الكمية المطلوبة ${q} أكبر من المتاح ${available}.`);let updatedParts=(r.parts||[]).map(x=>({...x})),existing=updatedParts.find(x=>!x.external&&x.partId===pid&&+x.sell===+p.use&&+x.cost===+p.buy);if(existing)existing.qty=(+existing.qty||0)+q;else updatedParts.push({partId:pid,qty:q,sell:+p.use||0,cost:+p.buy||0});let partsTotal=partsStockTotal(updatedParts),partsCost=partsStockCost(updatedParts),total=(+r.labor||0)+partsTotal;let newStock=stock.map(x=>x.id===pid?{...x,qty:(+x.qty||0)-q}:x),moves=arr(K.m);moves.push({id:id(),partId:pid,type:"خروج بسبب إضافة قطعة لأمر شغل",qty:q,requestId:r.id,at:new Date().toISOString()});let updated={...r,parts:updatedParts,partsTotal,partsCost,total,remain:Math.max(0,total-(+r.deposit||0))};try{put(K.p,newStock);put(K.m,moves);put(K.r,rs.map(x=>x.id===r.id?updated:x))}catch(e){alert("تعذر حفظ إضافة قطعة الغيار: "+(e?.message||e));return}requestProfile()}
function confirmAddExternalPartToRequest(requestId){let rs=arr(K.r),r=rs.find(x=>x.id===requestId);if(!r)return alert("أمر الشغل غير موجود.");if(r.closed||r.paid)return alert("الأمر مغلق أو مدفوع بالكامل ولا يمكن إضافة قطع غيار.");let nameEl=document.getElementById("rpExtName"),buyEl=document.getElementById("rpExtBuy"),sellEl=document.getElementById("rpExtSell"),qtyEl=document.getElementById("rpExtQty");let name=(nameEl?.value||"").trim();if(!name)return alert("اكتب اسم القطعة.");let cost=+(buyEl?.value||0),sell=+(sellEl?.value||0),q=+(qtyEl?.value||1);if(!Number.isFinite(q)||q<1)q=1;if(!Number.isFinite(cost)||cost<0||!Number.isFinite(sell)||sell<0)return alert("اكتب أسعار صحيحة.");let updatedParts=(r.parts||[]).map(x=>({...x}));updatedParts.push({external:true,name,qty:q,sell,cost});let partsTotal=partsStockTotal(updatedParts),partsCost=partsStockCost(updatedParts),total=(+r.labor||0)+partsTotal;let updated={...r,parts:updatedParts,partsTotal,partsCost,total,remain:Math.max(0,total-(+r.deposit||0))};try{put(K.r,rs.map(x=>x.id===r.id?updated:x))}catch(e){alert("تعذر حفظ إضافة القطعة: "+(e?.message||e));return}if(nameEl)nameEl.value="";if(buyEl)buyEl.value="";if(sellEl)sellEl.value="";if(qtyEl)qtyEl.value=1;requestProfile()}
function markPaidAndClose(i){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;if(r.status!=="مكتمل"){alert("اجعل حالة أمر الشغل «مكتمل» أولًا.");return}if(!confirm("تأكيد استلام كامل قيمة الأمر وإغلاقه نهائيًا؟ بعد التأكيد لن يمكن التعديل."))return;let collected=Math.max(0,(+r.total||0)-(+r.deposit||0));r.paid=true;r.remain=0;r.paidAt=new Date().toISOString();r.closed=true;r.closedAt=r.paidAt;put(K.r,a);syncTreasuryForOrderClose(r,collected);location.reload()}
function closeOrder(i){markPaidAndClose(i)}
function editCustomer(i){location.href="customers.html?edit="+encodeURIComponent(i)}
function editDevice(i){location.href="devices.html?edit="+encodeURIComponent(i)}
function editPart(i){location.href="inventory.html?edit="+encodeURIComponent(i)}
function applyStatusTimestamp(r,newStatus){if(newStatus==="مكتمل"){if(!r.completedAt)r.completedAt=new Date().toISOString()}else{r.completedAt=null}}
function changeRequestStatus(i,status){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;r.status=status;applyStatusTimestamp(r,status);put(K.r,a);renderRequests();renderDash();requestProfile()}
function changeRequestVisit(i,val){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;r.visit=val;if(val&&r.status==="جديد")r.status="مجدول";put(K.r,a);requestProfile();renderRequests()}
function changeRequestTag(i,val){if(val==="__add__"){let s=settings(),v=prompt("اكتب اسم التصنيف الجديد:");if(!v||!v.trim()){requestProfile();return}v=v.trim();s.orderTags=s.orderTags||[];if(!s.orderTags.includes(v))s.orderTags.push(v);put(K.s,s);val=v}let a=arr(K.r),r=a.find(x=>x.id===i);if(!r||r.closed||r.paid)return;r.tag=val;put(K.r,a);requestProfile();renderRequests()}
function editRequest(i){location.href="requests.html?edit="+encodeURIComponent(i)}
function addVillage(center){let s=settings(),v=prompt("اسم القرية الجديدة داخل "+center);if(!v)return;v=v.trim();s.villages[center]=s.villages[center]||[];if(!s.villages[center].includes(v))s.villages[center].push(v);put(K.s,s);settingsPage()}
function renameVillage(center,v){let s=settings(),n=prompt("الاسم الجديد للقرية",v);if(!n||n===v)return;let a=s.villages[center]||[],i=a.indexOf(v);if(i>=0)a[i]=n;put(K.s,s);settingsPage()}
function moveVillage(center,i,d){let s=settings(),a=s.villages[center]||[],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];s.villages[center]=a;put(K.s,s);settingsPage()}
function setVillagePosition(center,i,pos){let s=settings(),a=[...(s.villages[center]||[])];let n=parseInt(pos,10);if(!Number.isFinite(n))return settingsPage();n=Math.max(1,Math.min(a.length,n));if(i<0||i>=a.length||i===n-1)return;let item=a.splice(i,1)[0];a.splice(n-1,0,item);s.villages[center]=a;put(K.s,s);settingsPage()}function deleteVillage(center,v){if(!confirm("حذف القرية؟"))return;let s=settings();s.villages[center]=(s.villages[center]||[]).filter(x=>x!==v);if(s.villageGroups&&s.villageGroups[center])delete s.villageGroups[center][v];put(K.s,s);settingsPage()}
function villageGroupOf(center,village){let s=settings();return (s.villageGroups&&s.villageGroups[center]&&s.villageGroups[center][village])||"village"}
function toggleVillageGroup(center,village){let s=settings();s.villageGroups=s.villageGroups||{};s.villageGroups[center]=s.villageGroups[center]||{};let cur=s.villageGroups[center][village]||"village";s.villageGroups[center][village]=cur==="city"?"village":"city";put(K.s,s);settingsPage()}
function editTypeOptions(x){let s=settings(),v=prompt("التصنيفات مفصولة بفاصلة",(s.types[x]||[]).join(", "));if(v===null)return;s.types[x]=v.split(",").map(a=>a.trim()).filter(Boolean);put(K.s,s);settingsPage()}
function moveBrand(i,d){let s=settings(),a=s.brands,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];put(K.s,s);settingsPage()}
function movePartCategory(i,d){let s=settings(),a=s.partCats,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];put(K.s,s);settingsPage()}
function renameBrand(x){let n=prompt("الاسم الجديد للماركة",x);if(!n||n===x)return;let s=settings(),i=s.brands.indexOf(x);if(i>=0)s.brands[i]=n;put(K.s,s);settingsPage()}
function renamePartCategory(x){let n=prompt("الاسم الجديد للتصنيف",x);if(!n||n===x)return;let s=settings(),i=s.partCats.indexOf(x);if(i>=0)s.partCats[i]=n;put(K.s,s);settingsPage()}

function initParts(){let f=document.getElementById("partForm");if(!f)return;let q=new URLSearchParams(location.search),editId=q.get("edit"),existing=editId?arr(K.p).find(x=>x.id===editId):null;fillPartCats(pCategory,existing?.category||"");pPhoto.onchange=e=>previewPart(e);if(existing){pName.value=existing.name||"";pCode.value=existing.code||"";pLocation.value=existing.location||"";pQty.value=existing.qty||0;pMin.value=existing.min||0;pBuy.value=existing.buy||0;pUse.value=existing.use||0;if(existing.photo)partPhotoPreview.innerHTML=`<img class="photo" src="${existing.photo}">`;f.classList.remove("hidden");f.querySelector(".primary").textContent="💾 حفظ التعديلات وفتح الملف"}f.onsubmit=e=>savePart(e,existing);partSearch.oninput=renderParts;renderParts()}
function fillPartCats(el,selected=""){el.innerHTML='<option value="">اختر التصنيف</option>'+settings().partCats.map(x=>`<option ${x===selected?"selected":""}>${esc(x)}</option>`).join("")}
function previewPart(e){let f=e.target.files[0];if(!f)return;imageToDataURL(f).then(x=>{partPhotoPreview.innerHTML=`<img class="photo" src="${x}">`;partPhotoPreview.dataset.image=x})}
async function savePart(e,existing=null){e.preventDefault();try{let photo=pPhoto.files[0]?await imageToDataURL(pPhoto.files[0]):(existing?.photo||"");let p=existing||{id:id(),createdAt:new Date().toISOString()};Object.assign(p,{name:pName.value,code:pCode.value,category:pCategory.value,location:pLocation.value,qty:+pQty.value||0,min:+pMin.value||0,buy:+pBuy.value||0,use:+pUse.value||0,photo});let a=arr(K.p);if(!saveJSONSafe(K.p,existing?a.map(x=>x.id===p.id?p:x):a.concat(p)))return;location.href=`part.html?id=${p.id}`}catch(err){alert("تعذر حفظ صورة القطعة. جرّب صورة أخرى أصغر.")}}
function renderParts(){let el=document.getElementById("partList");if(!el)return;let q=(partSearch?.value||"").toLowerCase();let a=arr(K.p).filter(p=>(p.name+" "+p.code+" "+p.location).toLowerCase().includes(q));el.innerHTML=a.length?a.map(p=>{let pct=(+p.use||0)>0?(((+p.use||0)-(+p.buy||0))/(+p.use||0)*100):0;return `<div class="item ps-context-target" data-ps-title="قطعة ${esc(p.name)}"><div class="item-head"><a href="part.html?id=${p.id}"><b>📦 ${esc(p.name)}</b></a>${psActions("قطعة "+p.name)}<span class="badge">${p.qty} قطعة</span></div><div>${esc(p.category)} • 📍 ${esc(p.location)||"—"}</div><div>شراء ${p.buy} ج • استخدام ${p.use} ج • 📈 ربح ${pct.toFixed(1)}%</div></div>`}).join(""):'<div class="item">لا توجد قطع.</div>'}
function partProfile(){let el=document.getElementById("partProfile");if(!el)return;let p=arr(K.p).find(x=>x.id===new URLSearchParams(location.search).get("id"));if(!p){el.innerHTML="<div class='item'>القطعة غير موجودة.</div>";return}let moves=arr(K.m).filter(x=>x.partId===p.id).slice(-10).reverse();let profitVal=(+p.use||0)-(+p.buy||0),profitPct=(+p.use||0)>0?(profitVal/(+p.use||0)*100):0;el.innerHTML=`<div class="profile ps-context-target" data-ps-title="قطعة ${esc(p.name)}"><div class="page-head"><h1 class="profile-title">📦 ${esc(p.name)}</h1><div class="compact-actions"><button class="secondary" onclick="editPart('${p.id}')">✏️ تعديل</button>${psActions("قطعة "+p.name)}</div></div><div class="profile-grid"><div class="kv"><b>الكود</b>${esc(p.code)||"—"}</div><div class="kv"><b>التصنيف</b>${esc(p.category)}</div><div class="kv"><b>المكان</b>📍 ${esc(p.location)||"—"}</div><div class="kv"><b>الكمية</b>${p.qty}</div><div class="kv"><b>الحد الأدنى</b>${p.min}</div><div class="kv"><b>سعر الشراء</b>${p.buy} ج</div><div class="kv"><b>سعر الاستخدام</b>${p.use} ج</div><div class="kv"><b>📈 مكسب القطعة</b>${profitVal.toFixed(2)} ج (${profitPct.toFixed(1)}%)</div></div>${p.photo?`<img class="photo" src="${p.photo}">`:""}<h2>🔄 آخر حركات المخزن</h2>${moves.length?moves.map(x=>`<div class="item">${esc(x.type)} • ${x.qty} • ${new Date(x.at).toLocaleString("ar-EG")}</div>`).join(""):"<div class='item'>لا توجد حركات.</div>"}</div>`}
function listEditorHtml(title,key,icon){
  let a=settings()[key]||[];
  return `<section class="panel setting-list-panel"><div class="page-head"><h2>${icon} ${title}</h2><button class="secondary mini-action" onclick="addSettingItem('${key}')">➕ إضافة</button></div><div class="drag-hint">☷ اسحب أي عنصر وأفلته في المكان المطلوب</div><div id="list-${key}" class="sortable-list">${a.map((x,i)=>`<div class="setting-row drag-item" draggable="true" data-drag-kind="list" data-drag-key="${esc(key)}" data-drag-index="${i}"><span class="drag-handle" title="سحب للترتيب">☷</span><span class="setting-name"><b>${i+1}.</b> ${esc(x)}</span><span class="compact-actions"><input class="order-number" type="number" min="1" max="${a.length}" value="${i+1}" title="رقم الترتيب" onchange="setListPosition('${key}',${i},this.value)"><button class="secondary mini-action" onclick="renameSettingItem('${key}',${i})">✏️</button><button class="secondary mini-action" onclick="deleteSettingItem('${key}',${i})">🗑️</button></span></div>`).join("")}</div></section>`
}
function reorderSetting(kind,key,from,to){
  let s=settings();
  if(from===to||from<0||to<0)return;
  if(kind==='types'){
    let entries=Object.entries(s.types||{});if(from>=entries.length||to>=entries.length)return;
    let item=entries.splice(from,1)[0];entries.splice(to,0,item);s.types=Object.fromEntries(entries);
  }else{
    let a=kind==='villages'?(s.villages[key]||[]):(s[kind]||[]);
    if(from>=a.length||to>=a.length)return;
    let item=a.splice(from,1)[0];a.splice(to,0,item);
    if(kind==='villages')s.villages[key]=a;else s[kind]=a;
  }
  put(K.s,s);settingsPage();
}
function setListPosition(key,i,pos){
  let s=settings(),a=[...(s[key]||[])],n=parseInt(pos,10);
  if(!Number.isFinite(n))return settingsPage();n=Math.max(1,Math.min(a.length,n));
  if(i<0||i>=a.length||i===n-1)return;
  let item=a.splice(i,1)[0];a.splice(n-1,0,item);s[key]=a;put(K.s,s);settingsPage();
}
function bindSortableSettings(){
  document.querySelectorAll('.drag-item[draggable="true"]').forEach(el=>{
    el.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',JSON.stringify({kind:el.dataset.dragKind,key:el.dataset.dragKey||'',index:+el.dataset.dragIndex}));el.classList.add('dragging')});
    el.addEventListener('dragend',()=>el.classList.remove('dragging'));
    el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drag-over');e.dataTransfer.dropEffect='move'});
    el.addEventListener('dragleave',()=>el.classList.remove('drag-over'));
    el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drag-over');let raw=e.dataTransfer.getData('text/plain');if(!raw)return;try{let d=JSON.parse(raw);if(d.kind===el.dataset.dragKind&&(d.key||'')===(el.dataset.dragKey||''))reorderSetting(d.kind,d.kind==='villages'?d.key:(d.key||d.kind),d.index,+el.dataset.dragIndex)}catch(_){}});
  });
  // Touch/pointer fallback for phones where native HTML5 drag-and-drop is limited.
  document.querySelectorAll('.drag-handle').forEach(handle=>{
    let state=null;
    handle.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse')return;
      let row=handle.closest('.drag-item');if(!row)return;
      state={row,startX:e.clientX,startY:e.clientY,kind:row.dataset.dragKind,key:row.dataset.dragKey||'',index:+row.dataset.dragIndex,moved:false};
      handle.setPointerCapture?.(e.pointerId);row.classList.add('dragging');e.preventDefault();
    });
    handle.addEventListener('pointermove',e=>{
      if(!state)return;
      if(Math.abs(e.clientY-state.startY)>6)state.moved=true;
      if(!state.moved)return;
      let target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.drag-item');
      document.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));
      if(target&&target!==state.row&&target.dataset.dragKind===state.kind&&(target.dataset.dragKey||'')===state.key)target.classList.add('drag-over');
      e.preventDefault();
    });
    handle.addEventListener('pointerup',e=>{
      if(!state)return;let target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.drag-item');
      let d=state;state=null;d.row.classList.remove('dragging');document.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));
      if(target&&target!==d.row&&d.moved&&target.dataset.dragKind===d.kind&&(target.dataset.dragKey||'')===d.key)reorderSetting(d.kind,d.kind==='villages'?d.key:(d.key||d.kind),d.index,+target.dataset.dragIndex);
      e.preventDefault();
    });
    handle.addEventListener('pointercancel',()=>{if(state){state.row.classList.remove('dragging');state=null;document.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'))}});
  });
}
function settingsPage(){
  if(!document.getElementById("centerSettings"))return;
  let s=settings();
  centerSettings.innerHTML=s.centers.map((c,i)=>`<div class="setting-row drag-item" draggable="true" data-drag-kind="centers" data-drag-index="${i}"><span class="drag-handle" title="سحب للترتيب">☷</span><span class="setting-name"><b>${i+1}. 📍 ${esc(c)}</b></span><span class="compact-actions"><input class="order-number" type="number" min="1" max="${s.centers.length}" value="${i+1}" title="رقم الترتيب" onchange="setListPosition('centers',${i},this.value)"><button class="secondary mini-action" onclick="renameCenter('${esc(c)}')">✏️</button><button class="secondary mini-action" onclick="deleteCenter('${esc(c)}')">🗑️</button></span></div><div class="village-box">${(s.villages[c]||[]).map((v,j)=>`<div class="village-row drag-item" draggable="true" data-drag-kind="villages" data-drag-key="${esc(c)}" data-drag-index="${j}"><span class="drag-handle" title="سحب للترتيب">☷</span><input class="order-number" type="number" min="1" max="${(s.villages[c]||[]).length}" value="${j+1}" title="رقم ترتيب القرية" onchange="setVillagePosition('${esc(c)}',${j},this.value)"><span class="village-name">${esc(v)}</span><span class="compact-actions"><button class="mini-action" title="تصنيف الخط: مدينة أو قرية — دوس للتبديل" onclick="toggleVillageGroup('${esc(c)}','${esc(v)}')">${villageGroupOf(c,v)==="city"?"🏙️":"🌾"}</button><button class="mini-action" title="تعديل الاسم" onclick="renameVillage('${esc(c)}','${esc(v)}')">✏️</button><button class="mini-action" title="حذف" onclick="deleteVillage('${esc(c)}','${esc(v)}')">🗑️</button></span></div>`).join("")}<button class="secondary mini-action" onclick="addVillage('${esc(c)}')">➕ قرية</button></div>`).join("");
  typeSettings.innerHTML=Object.entries(s.types).map(([t,c],i)=>`<div class="setting-row drag-item" draggable="true" data-drag-kind="types" data-drag-index="${i}"><span class="drag-handle" title="سحب للترتيب">☷</span><span class="setting-name"><b>${i+1}. ${esc(t)}</b></span><span class="compact-actions"><input class="order-number" type="number" min="1" max="${Object.keys(s.types).length}" value="${i+1}" title="رقم الترتيب" onchange="setTypePosition(${i},this.value)"><button class="secondary mini-action" onclick="renameType('${esc(t)}')">✏️</button><button class="secondary mini-action" onclick="deleteType('${esc(t)}')">🗑️</button></span></div><div class="hint type-options">${c.join("، ")||"لا توجد"} <button class="secondary mini-action" onclick="editTypeOptions('${esc(t)}')">✏️ تعديل التصنيفات</button></div>`).join("");
  brandSettings.innerHTML=s.brands.map((b,i)=>`<div class="setting-row drag-item" draggable="true" data-drag-kind="brands" data-drag-index="${i}"><span class="drag-handle" title="سحب للترتيب">☷</span><span class="setting-name"><b>${i+1}. ${esc(b)}</b></span><span class="compact-actions"><input class="order-number" type="number" min="1" max="${s.brands.length}" value="${i+1}" title="رقم الترتيب" onchange="setListPosition('brands',${i},this.value)"><button class="secondary mini-action" onclick="renameBrand('${esc(b)}')">✏️</button><button class="secondary mini-action" onclick="deleteBrand('${esc(b)}')">🗑️</button></span></div>`).join("");
  partCategorySettings.innerHTML=s.partCats.map((b,i)=>`<div class="setting-row drag-item" draggable="true" data-drag-kind="partCats" data-drag-index="${i}"><span class="drag-handle" title="سحب للترتيب">☷</span><span class="setting-name"><b>${i+1}. ${esc(b)}</b></span><span class="compact-actions"><input class="order-number" type="number" min="1" max="${s.partCats.length}" value="${i+1}" title="رقم الترتيب" onchange="setListPosition('partCats',${i},this.value)"><button class="secondary mini-action" onclick="renamePartCategory('${esc(b)}')">✏️</button><button class="secondary mini-action" onclick="deletePartCategory('${esc(b)}')">🗑️</button></span></div>`).join("");
  let host=document.getElementById("settingsDynamic");
  if(host)host.innerHTML=[["orderStatuses","حالات أوامر الشغل","🛠️"],["priorities","الأولويات","⭐"],["executionPlaces","أماكن التنفيذ","📍"],["workshopStatuses","حالات الورشة","🏭"],["paymentStatuses","حالات الدفع","💳"],["units","وحدات القياس","📏"],["addressTypes","أنواع العناوين","🏠"],["orderTags","التصنيف اليدوي لأوامر الشغل","🏷️"],["expenseCategories","تصنيفات المصاريف","🧯"]].map(x=>listEditorHtml(...x)).join("");
  let rtHost=document.getElementById("routeThemeSettings");
  if(rtHost)rtHost.innerHTML=routeThemeSettingsHtml();
  bindSortableSettings();
}
function routeThemeSettingsHtml(){
  let s=settings(),theme=s.routeTheme||"dark",color=s.routeThemeColor||"#17181b";
  let opt=(val,label,emoji)=>`<button type="button" class="secondary mini-action route-theme-opt${theme===val?" active-opt":""}" onclick="setRouteTheme('${val}')">${emoji} ${label}</button>`;
  return `<div class="compact-actions">${opt("auto","تلقائي (حسب النظام)","📱")}${opt("dark","داكن","🌙")}${opt("light","فاتح","☀️")}${opt("custom","لون مخصص","🎨")}</div>`
    +(theme==="custom"?`<div class="inline" style="margin-top:8px;align-items:center"><input type="color" id="routeThemeColorInput" value="${color}" onchange="setRouteThemeColor(this.value)"><span class="hint">اختر أي لون تفضله للخلفية</span></div>`:"");
}
function setRouteTheme(v){let s=settings();s.routeTheme=v;put(K.s,s);settingsPage()}
function setRouteThemeColor(v){let s=settings();s.routeTheme="custom";s.routeThemeColor=v;put(K.s,s);settingsPage()}
function setTypePosition(i,pos){let n=parseInt(pos,10),entries=Object.entries(settings().types||{});if(!Number.isFinite(n))return settingsPage();n=Math.max(1,Math.min(entries.length,n));if(i<0||i>=entries.length||i===n-1)return;let item=entries.splice(i,1)[0];entries.splice(n-1,0,item);let s=settings();s.types=Object.fromEntries(entries);put(K.s,s);settingsPage()}
function addCenter(){let el=document.getElementById("newCenter"),v=el&&el.value?el.value:prompt("اسم المركز الجديد");if(!v)return;v=v.trim();if(!v)return;let s=settings();if(!s.centers.includes(v)){s.centers.push(v);s.villages[v]=s.villages[v]||[]}put(K.s,s);if(el)el.value="";settingsPage()}
function renameCenter(c){let n=prompt("الاسم الجديد للمركز",c);if(!n||n===c)return;n=n.trim();if(!n)return;let s=settings(),i=s.centers.indexOf(c);if(i<0)return;s.centers[i]=n;s.villages[n]=s.villages[c]||[];if(n!==c)delete s.villages[c];put(K.s,s);settingsPage()}
function deleteCenter(c){if(!confirm(`حذف المركز «${c}» وكل قراه؟`))return;let s=settings();s.centers=s.centers.filter(x=>x!==c);delete s.villages[c];put(K.s,s);settingsPage()}
function addType(){let t=prompt("اسم نوع الجهاز الجديد");if(!t)return;t=t.trim();if(!t)return;let s=settings();if(!(t in s.types))s.types[t]=[];put(K.s,s);settingsPage()}
function renameType(t){let n=prompt("الاسم الجديد للنوع",t);if(!n||n===t)return;n=n.trim();if(!n)return;let s=settings();if(!(t in s.types))return;if(n in s.types&&n!==t){alert("هذا النوع موجود بالفعل");return}let entries=Object.entries(s.types).map(([k,v])=>[k===t?n:k,v]);s.types=Object.fromEntries(entries);put(K.s,s);settingsPage()}
function deleteType(t){if(!confirm(`حذف نوع الجهاز «${t}» وكل تصنيفاته؟`))return;let s=settings();delete s.types[t];put(K.s,s);settingsPage()}
function addBrand(){let v=prompt("اسم الماركة الجديدة");if(!v)return;v=v.trim();if(!v)return;let s=settings();if(!s.brands.includes(v))s.brands.push(v);put(K.s,s);settingsPage()}
function deleteBrand(b){if(!confirm(`حذف الماركة «${b}»؟`))return;let s=settings();s.brands=s.brands.filter(x=>x!==b);put(K.s,s);settingsPage()}
function addPartCategory(){let v=prompt("اسم تصنيف القطع الجديد");if(!v)return;v=v.trim();if(!v)return;let s=settings();if(!s.partCats.includes(v))s.partCats.push(v);put(K.s,s);settingsPage()}
function deletePartCategory(c){if(!confirm(`حذف تصنيف «${c}»؟`))return;let s=settings();s.partCats=s.partCats.filter(x=>x!==c);put(K.s,s);settingsPage()}
function addSettingItem(key){let v=prompt("أضف عنصر جديد");if(!v)return;v=v.trim();if(!v)return;let s=settings();s[key]=s[key]||[];if(!s[key].includes(v))s[key].push(v);put(K.s,s);settingsPage()}
function renameSettingItem(key,i){let s=settings(),a=s[key]||[];if(i<0||i>=a.length)return;let n=prompt("الاسم الجديد",a[i]);if(!n||n===a[i])return;n=n.trim();if(!n)return;a[i]=n;s[key]=a;put(K.s,s);settingsPage()}
function deleteSettingItem(key,i){let s=settings(),a=s[key]||[];if(i<0||i>=a.length)return;if(!confirm(`حذف «${a[i]}»؟`))return;a.splice(i,1);s[key]=a;put(K.s,s);settingsPage()}


function deleteCustomerRecord(cid){let c=arr(K.c).find(x=>x.id===cid);if(!c)return;if(arr(K.d).some(d=>d.customerId===cid)||arr(K.r).some(r=>r.customerId===cid)){alert("لا يمكن حذف العميل الآن لأن له أجهزة أو أوامر شغل مرتبطة به. احذف البيانات المرتبطة أولاً أو استخدم الحذف العام.");return}if(!confirm(`حذف العميل «${c.name||""}» نهائيًا؟`))return;put(K.c,arr(K.c).filter(x=>x.id!==cid));renderCustomers()}
function deleteDeviceRecord(did){let d=arr(K.d).find(x=>x.id===did);if(!d)return;if(arr(K.r).some(r=>r.deviceId===did)){alert("لا يمكن حذف الجهاز لأنه مرتبط بأمر شغل. احذف أمر الشغل المرتبط أولًا أو استخدم الحذف العام.");return}if(!confirm("حذف الجهاز نهائيًا؟"))return;put(K.d,arr(K.d).filter(x=>x.id!==did));renderDevices()}
function deleteRequestRecord(rid){let r=arr(K.r).find(x=>x.id===rid);if(!r)return;if(r.closed||r.paid){alert("هذا الأمر مغلق أو مدفوع بالكامل ولا يُحذف من الحذف الخاص. استخدم إدارة البيانات إذا كنت تريد مسح بيانات قديمة بشكل عام.");return}if(!confirm(`حذف أمر الشغل ${r.no||""} نهائيًا؟`))return;let stock=arr(K.p),parts=r.parts||[];parts.forEach(x=>{let p=stock.find(z=>z.id===x.partId);if(p)p.qty=(+p.qty||0)+(+x.qty||0)});put(K.p,stock);put(K.m,arr(K.m).filter(x=>x.requestId!==rid));put(K.r,arr(K.r).filter(x=>x.id!==rid));removeTreasuryEntry("order-deposit-"+rid);renderRequests()}
function deleteAllCustomers(){let c=arr(K.c);if(!c.length)return alert("لا توجد بيانات عملاء للحذف.");if(!confirm(`حذف جميع العملاء (${c.length}) وما يرتبط بهم من أجهزة وأوامر شغل؟`))return;if(!confirm("تأكيد نهائي: لا يمكن التراجع عن الحذف."))return;put(K.c,[]);put(K.d,[]);put(K.r,[]);put(K.m,[]);renderCustomers?.();renderDevices?.();renderRequests?.();alert("تم حذف جميع العملاء والبيانات المرتبطة بهم.")}
function deleteAllDevices(){let d=arr(K.d);if(!d.length)return alert("لا توجد أجهزة للحذف.");if(!confirm(`حذف جميع الأجهزة (${d.length}) وأوامر الشغل المرتبطة بها؟`))return;if(!confirm("تأكيد نهائي: لا يمكن التراجع عن الحذف."))return;put(K.d,[]);put(K.r,[]);put(K.m,[]);renderDevices?.();renderRequests?.();alert("تم حذف جميع الأجهزة وأوامر الشغل المرتبطة بها.")}
function deleteAllRequests(){let r=arr(K.r);if(!r.length)return alert("لا توجد أوامر شغل للحذف.");if(!confirm(`حذف جميع أوامر الشغل (${r.length}) وإرجاع قطع الغيار المصروفة للمخزن؟`))return;if(!confirm("تأكيد نهائي: لا يمكن التراجع عن الحذف."))return;let stock=arr(K.p);r.forEach(o=>(o.parts||[]).forEach(x=>{let p=stock.find(z=>z.id===x.partId);if(p)p.qty=(+p.qty||0)+(+x.qty||0)}));put(K.p,stock);put(K.r,[]);put(K.m,[]);renderRequests?.();renderDash?.();monthReport?.();alert("تم حذف جميع أوامر الشغل وإرجاع القطع للمخزن.")}
function resolveRequestAddress(r){let c=arr(K.c).find(x=>x.id===r.customerId);if(!c)return{};let list=addresses(c);return list.find(a=>a.key===r.addressKey)||list[0]||{}}

// خط سير اليوم: تجميع أوامر الشغل اللي لها موعد زيارة (اليوم/المتأخرة) حسب المركز والقرية.
function toggleVisited(i){let a=arr(K.r),r=a.find(x=>x.id===i);if(!r)return;let today=dayKeyLocal(new Date());if(r.visitedAt&&dayKeyLocal(r.visitedAt)===today)r.visitedAt=null;else r.visitedAt=new Date().toISOString();put(K.r,a);renderRoute()}
function renderRoute(){
  let el=document.getElementById("routeList");if(!el)return;
  let today=dayKeyLocal(new Date());
  let cf=document.getElementById("routeCenterFilter")?.value||"";
  let mode=document.getElementById("routeMode")?.value||"today";
  let summaryEl=document.getElementById("routeSummary");
  if(summaryEl){
    let scheduledToday=arr(K.r).filter(x=>x.visit&&dayKeyLocal(x.visit)===today);
    let closedToday=scheduledToday.filter(x=>x.closed);
    let visitedNotClosed=scheduledToday.filter(x=>!x.closed&&x.status!=="ملغي"&&x.visitedAt&&dayKeyLocal(x.visitedAt)===today);
    let notVisited=scheduledToday.filter(x=>!x.closed&&x.status!=="ملغي"&&!(x.visitedAt&&dayKeyLocal(x.visitedAt)===today));
    let collectedToday=arr(K.r).filter(x=>x.paidAt&&dayKeyLocal(x.paidAt)===today).reduce((a,x)=>a+Math.max(0,(+x.total||0)-(+x.deposit||0)),0);
    summaryEl.innerHTML=`<div class="route-summary"><div class="stat"><b>${scheduledToday.length}</b><span>📅 مجدول النهاردة</span></div><div class="stat"><b>${closedToday.length}</b><span>✅ اتقفل واتحصّل</span></div><div class="stat"><b>${visitedNotClosed.length}</b><span>🚶 اتزار ولسه شغال</span></div><div class="stat"><b>${notVisited.length}</b><span>⏳ لسه محدش راح</span></div><div class="stat"><b>${collectedToday.toFixed(2)} ج</b><span>💰 المحصّل النهاردة</span></div></div>`;
  }
  let list=arr(K.r).filter(x=>x.visit).filter(x=>{
    let k=dayKeyLocal(x.visit);
    let pending=x.status!=="مكتمل"&&x.status!=="ملغي"&&!x.closed;
    if(mode==="today")return k===today;
    if(mode==="overdue")return k<today&&pending;
    return k===today||(k<today&&pending);
  }).map(x=>({...x,_c:arr(K.c).find(z=>z.id===x.customerId)||{},_addr:resolveRequestAddress(x)}));
  if(cf)list=list.filter(x=>x._addr.center===cf);
  list.sort((a,b)=>(a._addr.center||"").localeCompare(b._addr.center||"","ar")||(a._addr.village||"").localeCompare(b._addr.village||"","ar")||new Date(a.visit)-new Date(b.visit));
  if(!list.length){el.innerHTML='<div class="item">لا يوجد مواعيد ضمن الاختيار الحالي.</div>';return}
  let groups={};
  list.forEach(x=>{let k=x._addr.center||"بدون مركز";(groups[k]=groups[k]||[]).push(x)});
  el.innerHTML=Object.keys(groups).map(center=>`<h3 class="route-group-title">🗺️ ${esc(center)} <span class="badge">${groups[center].length}</span></h3>`+groups[center].map(x=>{
    let visitedToday=!!(x.visitedAt&&dayKeyLocal(x.visitedAt)===today);
    let stateBadge=x.closed?'<span class="badge route-badge-done">✅ اتقفل</span>':x.status==="ملغي"?'<span class="badge">🚫 ملغي</span>':visitedToday?'<span class="badge route-badge-visited">🚶 اتزار</span>':'<span class="badge route-badge-pending">⏳ لسه</span>';
    let lateBadge=dayKeyLocal(x.visit)<today&&!x.closed&&x.status!=="ملغي"?'<span class="badge">⚠️ متأخر</span>':"";
    let toggleBtn=(!x.closed&&x.status!=="ملغي")?`<button type="button" class="secondary mini-action" onclick="toggleVisited('${x.id}')">${visitedToday?"↩️ إلغاء تسجيل الزيارة":"✅ سجّل إني زرته"}</button>`:"";
    return `<div class="item record-card"><div class="item-head"><a href="request.html?id=${x.id}"><b>🛠️ ${esc(x.no)}</b></a>${stateBadge}${lateBadge}</div><div>👤 <a href="customer.html?id=${x.customerId}">${esc(x._c.name||"")}</a></div><div>${contactLinksHtml(x._c.phone)}</div><div>📍 ${esc(addressText(x._addr))}</div><div>🔧 ${esc(deviceName(x.deviceId))} — ${esc(x.fault||"")}</div><div>⏰ ${x.visit?new Date(x.visit).toLocaleString("ar-EG",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""}</div>${x.closed?`<div>💰 المحصّل: ${Math.max(0,(+x.total||0)-(+x.deposit||0)).toFixed(2)} ج</div>`:""}${toggleBtn?`<div class="actions">${toggleBtn}</div>`:""}</div>`;
  }).join("")).join("");
}
function initRoutePage(){
  let cfEl=document.getElementById("routeCenterFilter");if(!cfEl)return;
  cfEl.innerHTML='<option value="">🗺️ كل المراكز</option>'+(settings().centers||[]).map(x=>`<option>${esc(x)}</option>`).join("");
  cfEl.onchange=renderRoute;
  document.getElementById("routeMode").onchange=renderRoute;
  renderRoute();
}

// متابعة العملاء الساكتين: عملاء عندهم أمر شغل سابق ومفيش أمر جديد من مدة معينة.
function renderFollowup(){
  let el=document.getElementById("followupList");if(!el)return;
  let days=+(document.getElementById("followupDays")?.value||60);
  let now=new Date();
  let rows=arr(K.c).map(cu=>{
    let orders=arr(K.r).filter(x=>x.customerId===cu.id);
    let last=orders.reduce((a,x)=>{let d=x.createdAt||"";return d>a?d:a},"");
    let daysSince=last?Math.floor((now-new Date(last))/86400000):null;
    return {c:cu,ordersCount:orders.length,last,daysSince};
  }).filter(x=>x.ordersCount>0&&x.daysSince!==null&&x.daysSince>=days);
  rows.sort((a,b)=>b.daysSince-a.daysSince);
  el.innerHTML=rows.length?rows.map(x=>`<div class="item record-card"><div class="item-head"><a href="customer.html?id=${x.c.id}"><b>👤 ${esc(x.c.name)}</b></a><span class="badge">⏳ ${x.daysSince} يوم</span></div><div>${contactLinksHtml(x.c.phone)}</div><div>📍 ${esc(addressText(x.c.mainAddress||{}))}</div><div>🛠️ ${x.ordersCount} أمر سابق • آخر أمر ${new Date(x.last).toLocaleDateString("ar-EG")}</div><div class="actions"><a class="primary small-btn" href="requests.html?customer=${x.c.id}&add=1">➕ أمر شغل جديد</a></div></div>`).join(""):'<div class="item">لا يوجد عملاء ساكتين ضمن المدة المختارة 🎉</div>';
}
function initFollowupPage(){
  let dEl=document.getElementById("followupDays");if(!dEl)return;
  dEl.onchange=renderFollowup;
  renderFollowup();
}
function deleteAllOperationalData(){if(!confirm("سيتم حذف العملاء والأجهزة وأوامر الشغل وقطع الغيار وحركات المخزن والمصاريف وحركات الخزنة. الإعدادات والمراكز والقرى لن تتأثر. هل تريد المتابعة؟"))return;if(!confirm("تأكيد نهائي جدًا: حذف كل البيانات التشغيلية؟"))return;[K.c,K.d,K.r,K.p,K.m,K.e,K.tr].forEach(k=>put(k,[]));alert("تم حذف كل البيانات التشغيلية. سيتم تحديث الصفحة.");location.reload()}

// النسخة الاحتياطية: تصدير كل بيانات النظام كملف JSON، واسترجاعها لاحقًا.
function backupAllData(){
  let data={};
  Object.values(K).forEach(k=>{data[k]=get(k,null)});
  data.wf_notif_enabled=localStorage.getItem("wf_notif_enabled");
  data._meta={exportedAt:new Date().toISOString(),app:"الورشة الفنية",version:1};
  let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  let url=URL.createObjectURL(blob);
  let stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  let a=document.createElement("a");
  a.href=url;a.download=`نسخة-احتياطية-الورشة-الفنية-${stamp}.json`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function restoreBackupFile(input){
  let file=input?.files?.[0];
  if(!file)return;
  if(!confirm('⚠️ استيراد نسخة احتياطية هيستبدل كل بيانات النظام الحالية (العملاء والأجهزة وأوامر الشغل والمخزن والخزنة والمهام) بالبيانات اللي في الملف، ومينفعش يترجع بعد كده.\n\nهل أنت متأكد إنك عايز تكمل؟')){input.value="";return}
  let reader=new FileReader();
  reader.onload=()=>{
    try{
      let data=JSON.parse(reader.result);
      if(!data||typeof data!=="object")throw new Error("bad");
      let keys=Object.values(K);
      let hasAny=keys.some(k=>k in data);
      if(!hasAny)throw new Error("empty");
      keys.forEach(k=>{if(k in data)put(k,data[k])});
      if("wf_notif_enabled" in data && data.wf_notif_enabled!=null)localStorage.setItem("wf_notif_enabled",data.wf_notif_enabled);
      alert("✅ تم استرجاع النسخة الاحتياطية بنجاح. هيتم فتح الرئيسية الآن.");
      location.href="index.html";
    }catch(e){
      alert("تعذر قراءة الملف. تأكد إنه ملف نسخة احتياطية صحيح تم تصديره من نفس النظام.");
    }
    input.value="";
  };
  reader.readAsText(file);
}

// أمر شغل سريع من الرئيسية: عميل + جهاز + عطل، والباقي يتظبط من صفحة الأمر نفسها.
function toggleQuickOrderPanel(){
  let body=document.getElementById("quickOrderBody"),btn=document.getElementById("quickOrderToggleBtn");
  if(!body||!btn)return;
  let opening=body.classList.contains("hidden");
  body.classList.toggle("hidden");
  btn.textContent=opening?"⚡ أمر شغل سريع (دوس للإغلاق)":"⚡ أمر شغل سريع (دوس للفتح)";
  btn.classList.toggle("quick-order-open",opening);
  if(opening)setTimeout(()=>body.scrollIntoView({behavior:"smooth",block:"nearest"}),50);
}
function initQuickOrder(){
  let sel=document.getElementById("qoCustomer");if(!sel)return;
  fillCustomer(sel);
  fillDevice(document.getElementById("qoDevice"),"");
  sel.onchange=()=>fillDevice(document.getElementById("qoDevice"),sel.value);
  setupQuickForms();
}
function saveQuickCustomerHome(){
  let name=document.getElementById('qoName')?.value.trim(),phone=document.getElementById('qoPhone')?.value.trim();
  if(!name||!phone)return alert('اكتب اسم العميل والتليفون أولاً.');
  let duplicate=duplicateCustomerByPhone(phone);
  if(duplicate&&!confirm(`⚠️ الرقم مسجل بالفعل للعميل: ${duplicate.name||'—'}.\n\nهل تريد إنشاء عميل آخر بنفس الرقم؟`))return;
  let c={id:id(),name,phone,mainAddress:{center:qoCenter.value,village:qoVillage.value,address:"",street:(qoStreet.value||"").trim()},extraAddress:{},createdAt:new Date().toISOString()};
  let a=arr(K.c);a.push(c);if(!saveJSONSafe(K.c,a))return;
  fillCustomer(document.getElementById("qoCustomer"),c.id);
  fillDevice(document.getElementById("qoDevice"),c.id,"");
  closeQuickAdd('qoCustomerBox');
  document.getElementById('qoCustomerBox').querySelectorAll('input').forEach(x=>x.value='');
}
function saveQuickDeviceHome(){
  let cid=document.getElementById("qoCustomer")?.value;
  if(!cid)return alert('اختر العميل أولاً أو أضفه من الزر بجواره.');
  let d={id:id(),customerId:cid,addressKey:'main',type:qoType.value,category:qoCategory.value,brand:qoBrand.value,model:(qoModel.value||"").trim(),desc:"",photo:"",createdAt:new Date().toISOString()};
  if(!d.type||!d.category||!d.brand)return alert('اختر نوع الجهاز والتصنيف والماركة.');
  let a=arr(K.d);a.push(d);if(!saveJSONSafe(K.d,a))return;
  fillDevice(document.getElementById("qoDevice"),cid,d.id);
  closeQuickAdd('qoDeviceBox');
}
function quickCreateRequest(){
  let cid=document.getElementById("qoCustomer")?.value,did=document.getElementById("qoDevice")?.value,fault=(document.getElementById("qoFault")?.value||"").trim();
  if(!cid)return alert("اختر العميل أولاً.");
  if(!did)return alert("اختر الجهاز أولاً.");
  if(!fault)return alert("اكتب وصف العطل.");
  let s=settings();
  let r={id:id(),no:orderNo(),customerId:cid,deviceId:did,addressKey:"main",priority:(s.priorities||[])[0]||"عادية",visit:"",status:(s.orderStatuses||[])[0]||"جديد",executionPlace:(s.executionPlaces||[])[0]||"عند العميل",workshopStatus:(s.workshopStatuses||[])[0]||"غير مطلوب",partsWaiting:false,tag:"",fault,work:"",labor:0,parts:[],partsTotal:0,partsCost:0,total:0,deposit:0,remain:0,closed:false,createdAt:new Date().toISOString()};
  applyStatusTimestamp(r,r.status);
  put(K.r,arr(K.r).concat(r));
  location.href=`request.html?id=${r.id}`;
}

// روابط اتصال/واتساب موحدة لأي رقم تليفون في النظام.
function waNumber(phone){
  let d=String(phone||"").replace(/[^\d]/g,"");
  if(!d)return "";
  if(d.startsWith("0020"))d=d.slice(2);
  if(d.startsWith("00"))d=d.slice(2);
  if(d.startsWith("0"))d="20"+d.slice(1);
  else if(!d.startsWith("20"))d="20"+d;
  return d;
}
function contactLinksHtml(phone){
  if(!phone)return "—";
  let wa=waNumber(phone);
  return `<a class="tel-link" href="tel:${esc(phone)}">📲 ${esc(phone)}</a>${wa?` <a class="wa-link" href="https://wa.me/${wa}" target="_blank" rel="noopener">💬 واتساب</a>`:""}`;
}

document.addEventListener("DOMContentLoaded",()=>{settings();normalizeOrderNumbers();renderDash();monthReport();document.getElementById("reportMonth")?.addEventListener("change",financeReport);document.getElementById("reportWeek")?.addEventListener("change",financeReport);initCustomers();customerProfile();initDevices();deviceProfile();initRequests();requestProfile();initParts();partProfile();initTasks();settingsPage();renderTreasury();initQuickOrder();initRoutePage();initFollowupPage()})

// Quick-create relations: create the missing entity without leaving the current workflow.
function setupQuickLocation(prefix){
  let center=document.getElementById(prefix+'Center'), village=document.getElementById(prefix+'Village');
  if(!center||!village)return;
  fillCenters(center); center.onchange=()=>fillVillages(village,center.value); fillVillages(village,center.value);
}
function saveQuickCustomer(){
  let name=document.getElementById('qcName')?.value.trim(),phone=document.getElementById('qcPhone')?.value.trim();
  if(!name||!phone)return alert('اكتب اسم العميل والتليفون أولاً.');
  let duplicate=duplicateCustomerByPhone(phone);if(duplicate&&!confirm(`⚠️ الرقم مسجل بالفعل للعميل: ${duplicate.name||'—'}.\n\nهل تريد إنشاء عميل آخر بنفس الرقم؟`))return;
  let c={id:id(),name,phone,mainAddress:{center:qcCenter.value,village:qcVillage.value,address:"",street:qcStreet.value.trim()},extraAddress:{},createdAt:new Date().toISOString()};
  let a=arr(K.c);a.push(c);if(!saveJSONSafe(K.c,a))return;
  fillCustomer(rCustomer,c.id);fillAddress(rAddress,c.id,'main');
  closeQuickAdd('quickCustomerBox');
  document.getElementById('quickCustomerBox').querySelectorAll('input').forEach(x=>x.value='');
  fillDevice(rDevice,c.id,'');
}
function saveQuickDevice(){
  let cid=rCustomer.value;if(!cid)return alert('اختر العميل أولاً أو أضفه من الزر بجواره.');
  let d={id:id(),customerId:cid,addressKey:rAddress.value||'main',type:qdType.value,category:qdCategory.value,brand:qdBrand.value,model:qdModel.value.trim(),desc:qdDesc.value.trim(),photo:"",createdAt:new Date().toISOString()};
  if(!d.type||!d.category||!d.brand)return alert('اختر نوع الجهاز والتصنيف والماركة.');
  let a=arr(K.d);a.push(d);if(!saveJSONSafe(K.d,a))return;
  fillDevice(rDevice,cid,d.id);closeQuickAdd('quickDeviceBox');
}
function saveDeviceCustomer(){
  let name=dcName.value.trim(),phone=dcPhone.value.trim();if(!name||!phone)return alert('اكتب اسم العميل والتليفون أولاً.');
  let duplicate=duplicateCustomerByPhone(phone);if(duplicate&&!confirm(`⚠️ الرقم مسجل بالفعل للعميل: ${duplicate.name||'—'}.\n\nهل تريد إنشاء عميل آخر بنفس الرقم؟`))return;
  let c={id:id(),name,phone,mainAddress:{center:dcCenter.value,village:dcVillage.value,address:"",street:dcStreet.value.trim()},extraAddress:{},createdAt:new Date().toISOString()};
  let a=arr(K.c);a.push(c);if(!saveJSONSafe(K.c,a))return;fillCustomer(dCustomer,c.id);fillAddress(dAddress,c.id,'main');closeQuickAdd('quickDeviceCustomerBox');
}
function setupQuickForms(){
  if(document.getElementById('quickCustomerBox'))setupQuickLocation('qc');
  if(document.getElementById('quickDeviceCustomerBox'))setupQuickLocation('dc');
  if(document.getElementById('qdType')){fillTypes(qdType);fillBrands(qdBrand);qdType.onchange=()=>fillCats(qdCategory,qdType.value);fillCats(qdCategory,qdType.value)}
  if(document.getElementById('qoCustomerBox'))setupQuickLocation('qo');
  if(document.getElementById('qoType')){fillTypes(qoType);fillBrands(qoBrand);qoType.onchange=()=>fillCats(qoCategory,qoType.value);fillCats(qoCategory,qoType.value)}
}
const _oldInitRequests=initRequests;
initRequests=function(){_oldInitRequests();setupQuickForms()}
const _oldInitDevices=initDevices;
initDevices=function(){_oldInitDevices();setupQuickForms()}
/* ---------------------------------------------------------------------
   الإشعارات: نجهّز ملخص صغير (مواعيد اليوم / المتأخر / قطع منخفضة) ونحفظه
   في IndexedDB (notif-shared.js) عشان الـ Service Worker يقدر يقرأه وقت
   الفحص في الخلفية، ونعمل كمان فحص فوري كل ما التطبيق يتفتح.
--------------------------------------------------------------------- */
async function updateNotificationSnapshot(){
  if(typeof notifSet!=="function")return;
  let r=arr(K.r),p=arr(K.p);let today=dayKeyLocal(new Date());
  let openOrders=r.filter(x=>x.status!=="مكتمل"&&x.status!=="ملغي");
  let todayList=openOrders.filter(x=>x.visit&&dayKeyLocal(x.visit)===today).map(x=>x.id);
  let overdueList=openOrders.filter(x=>x.visit&&dayKeyLocal(x.visit)<today).map(x=>x.id);
  let lowStockList=p.filter(x=>+x.qty<=+x.min).map(x=>x.id);
  await notifSet("snapshot",{generatedAt:new Date().toISOString(),today:todayList,overdue:overdueList,lowStock:lowStockList});
}
async function checkNotificationsNow(){
  if(localStorage.getItem("wf_notif_enabled")!=="1")return;
  if(!("Notification" in window)||Notification.permission!=="granted")return;
  if(!("serviceWorker" in navigator))return;
  let today=new Date().toISOString().slice(0,10);
  let last=await notifGet("lastNotifiedDate");
  if(last===today)return;
  let snap=await notifGet("snapshot");if(!snap)return;
  let reg=await navigator.serviceWorker.ready;let shown=false;
  if(snap.today&&snap.today.length){reg.showNotification("📅 مواعيد اليوم",{body:`عندك ${snap.today.length} زيارة/زيارات اليوم.`,icon:"./icon-192-v11-4-1.png",tag:"wf-today",data:{url:"./requests.html?bucket=today"}});shown=true}
  if(snap.overdue&&snap.overdue.length){reg.showNotification("⚠️ أوامر متأخرة",{body:`فيه ${snap.overdue.length} أمر متأخر محتاج متابعة.`,icon:"./icon-192-v11-4-1.png",tag:"wf-overdue",data:{url:"./requests.html?bucket=overdue"}});shown=true}
  if(snap.lowStock&&snap.lowStock.length){reg.showNotification("📉 قطع منخفضة",{body:`فيه ${snap.lowStock.length} صنف وصل للحد الأدنى في المخزن.`,icon:"./icon-192-v11-4-1.png",tag:"wf-lowstock",data:{url:"./inventory.html?bucket=low"}});shown=true}
  if(shown)await notifSet("lastNotifiedDate",today);
}
async function enableNotifications(){
  if(!("Notification" in window)||!("serviceWorker" in navigator)){alert("المتصفح ده مش بيدعم الإشعارات، للأسف.");return renderNotifSettings()}
  let perm=await Notification.requestPermission();
  if(perm!=="granted"){alert("محتاجين إذن الإشعارات من المتصفح عشان تشتغل.");return renderNotifSettings()}
  localStorage.setItem("wf_notif_enabled","1");
  try{
    let reg=await navigator.serviceWorker.ready;
    if("periodicSync" in reg && "permissions" in navigator){
      try{let status=await navigator.permissions.query({name:"periodic-background-sync"});
        if(status.state==="granted")await reg.periodicSync.register("workshop-check",{minInterval:12*60*60*1000});
      }catch(e){}
    }
    await updateNotificationSnapshot();await checkNotificationsNow();
  }catch(e){}
  renderNotifSettings();
}
async function disableNotifications(){
  localStorage.setItem("wf_notif_enabled","0");
  try{let reg=await navigator.serviceWorker.ready;if(reg.periodicSync)await reg.periodicSync.unregister("workshop-check")}catch(e){}
  renderNotifSettings();
}
async function renderNotifSettings(){
  let el=document.getElementById("notifSettings");if(!el)return;
  let supported="Notification" in window && "serviceWorker" in navigator;
  let periodicSupported=false;
  if(supported){try{let reg=await navigator.serviceWorker.ready;periodicSupported="periodicSync" in reg}catch(e){}}
  let enabled=supported&&localStorage.getItem("wf_notif_enabled")==="1"&&Notification.permission==="granted";
  el.innerHTML=!supported
    ?`<p class="hint">⚠️ المتصفح أو الجهاز ده مش بيدعم الإشعارات (شائع على آيفون Safari). هيشتغل النظام عادي من غيرها.</p>`
    :`<p class="hint">${enabled?"🔔 الإشعارات مفعّلة على هذا الجهاز.":"🔕 الإشعارات غير مفعّلة حاليًا."}</p>
      <p class="hint">${periodicSupported?"✅ هيحاول يبعتلك تنبيه حتى لو التطبيق مقفول (بشرط يكون مثبت على الشاشة الرئيسية)، بس التوقيت مش مضمون بالظبط — المتصفح هو اللي بيحدد الموعد المناسب حسب استخدامك للتطبيق.":"ℹ️ هيشتغل بس وانت فاتح التطبيق (هيبقى فيه تنبيه فوري أول ما تفتحه لو فيه مواعيد اليوم أو أوامر متأخرة أو قطع منخفضة)."}</p>
      <button type="button" class="${enabled?"secondary":"primary"}" onclick="${enabled?"disableNotifications()":"enableNotifications()"}">${enabled?"🔕 إيقاف الإشعارات":"🔔 تفعيل الإشعارات"}</button>`;
}
if("serviceWorker" in navigator){
  navigator.serviceWorker.addEventListener("message",e=>{
    if(e.data&&e.data.type==="GO_TO"&&e.data.url)location.href=e.data.url;
  });
}
document.addEventListener("DOMContentLoaded",()=>{updateNotificationSnapshot().then(checkNotificationsNow);renderNotifSettings()});
document.addEventListener('DOMContentLoaded',()=>setTimeout(setupQuickForms,0));


// V11.1 PWA: install support + offline registration. This does not touch localStorage data.
(function setupPWA(){
  let deferredPrompt=null;
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    const btn=document.getElementById('installAppBtn');
    if(btn) btn.classList.remove('hidden');
  });
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    const btn=document.getElementById('installAppBtn');
    if(btn){btn.textContent='✅ تم التثبيت';btn.disabled=true;}
  });
  window.installWorkshopApp=async function(){
    if(!deferredPrompt){alert('التثبيت متاح من قائمة المتصفح إذا لم يظهر زر التثبيت تلقائيًا.');return;}
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
  };
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js?v=11.8.1', {updateViaCache: 'none'}).catch(err=>console.warn('PWA service worker:',err)));
  }
  window.addEventListener('online',()=>document.documentElement.dataset.network='online');
  window.addEventListener('offline',()=>document.documentElement.dataset.network='offline');
  document.documentElement.dataset.network=navigator.onLine?'online':'offline';
})();
