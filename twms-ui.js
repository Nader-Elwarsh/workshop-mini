(function(){
"use strict";
window.TWMSUI=window.TWMSUI||{};
window.TWMSUI.escape=function(v){
 return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
};
window.TWMSUI.afterSave=function(message,nextUrl){
 try{sessionStorage.setItem("TWMS_LAST_SAVE",JSON.stringify({message:String(message||"تم الحفظ"),at:new Date().toISOString()}));}catch(e){}
 if(nextUrl){window.location.assign(nextUrl);return true;}
 return false;
};
window.TWMSUI.flash=function(message,type){
 const cls=type==="error"?"twms-error":"twms-success";
 let box=document.getElementById("twmsFlash");
 if(!box){
  box=document.createElement("div");
  box.id="twmsFlash";
  box.style.cssText="position:fixed;top:12px;right:12px;z-index:9999;max-width:90vw;padding:12px 16px;border-radius:10px;font:inherit;box-shadow:0 4px 18px rgba(0,0,0,.15);";
  document.body.appendChild(box);
 }
 box.className=cls;
 box.textContent=String(message||"");
 box.style.background=type==="error"?"#ffe2e2":"#e3f7e9";
 box.style.color=type==="error"?"#a00000":"#146c2e";
 setTimeout(()=>{if(box)box.remove()},3500);
};

/* =========================================================
   إدارة البيانات — حذف آمن مع نسخة احتياطية
   لا يتم الحذف مباشرة: يلزم تأكيد + كتابة كلمة الحذف.
   ========================================================= */
window.TWMSUI.dataManager = {
  backup: function(filename){
    const data = {};
    for(let i=0;i<localStorage.length;i++){
      const key = localStorage.key(i);
      try { data[key] = JSON.parse(localStorage.getItem(key)); }
      catch(e) { data[key] = localStorage.getItem(key); }
    }
    const blob = new Blob([JSON.stringify({
      exportedAt: new Date().toISOString(),
      storage: data
    }, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || ("twms-backup-" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    return true;
  },

  clearAll: function(){
    const ok = window.confirm(
      "تنبيه: سيتم حذف كل البيانات المحلية للموقع من هذا الجهاز.\n\n" +
      "يفضل عمل نسخة احتياطية أولاً.\n\nهل تريد المتابعة؟"
    );
    if(!ok) return false;

    const phrase = window.prompt(
      "للتأكيد النهائي اكتب بالضبط:\nحذف الكل"
    );
    if(phrase !== "حذف الكل"){
      window.TWMSUI.flash("تم إلغاء الحذف ولم تتغير أي بيانات.","error");
      return false;
    }

    /* نسخة طوارئ داخل sessionStorage قبل المسح، إن أمكن */
    try{
      const snapshot = {};
      for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        snapshot[key] = localStorage.getItem(key);
      }
      sessionStorage.setItem(
        "TWMS_LAST_DELETED_BACKUP",
        JSON.stringify({at:new Date().toISOString(),storage:snapshot})
      );
    }catch(e){}

    localStorage.clear();
    window.TWMSUI.flash("تم مسح البيانات المحلية. أعد تحميل الصفحة.","success");
    setTimeout(()=>location.reload(),900);
    return true;
  },

  installPanel: function(){
    if(document.getElementById("twmsDataTools")) return;

    const host =
      document.querySelector("#settings, #dataSettings, .settings-page, .settings-section") ||
      document.querySelector("main") ||
      document.body;

    const panel = document.createElement("section");
    panel.id = "twmsDataTools";
    panel.setAttribute("dir","rtl");
    panel.innerHTML = `
      <div class="twms-data-tools-card">
        <div class="twms-data-tools-title">🗄️ إدارة البيانات</div>
        <div class="twms-data-tools-note">
          اعمل نسخة احتياطية قبل أي حذف. الحذف النهائي يحتاج تأكيد إضافي.
        </div>
        <div class="twms-data-tools-actions">
          <button type="button" id="twmsBackupBtn">💾 نسخة احتياطية</button>
          <button type="button" id="twmsClearBtn" class="danger">🗑️ مسح كل البيانات</button>
        </div>
      </div>`;
    host.appendChild(panel);

    panel.querySelector("#twmsBackupBtn").onclick =
      ()=>window.TWMSUI.dataManager.backup();
    panel.querySelector("#twmsClearBtn").onclick =
      ()=>window.TWMSUI.dataManager.clearAll();
  }
};

function installDataManager(){
  const path = location.pathname + " " + location.hash;
  if(/عملا|عملاء|customers|settings|ضبط|إعدادات/i.test(path) ||
     document.querySelector("#settings,#dataSettings,.settings-page")){
    window.TWMSUI.dataManager.installPanel();
  }
}

/* إصلاح موضع زر فتح 360° في بطاقات العملاء */
function fixCustomer360Buttons(){
 if(!document.querySelector("#customersList, #customerManagementCards, .customer")) return;

 const buttons=[...document.querySelectorAll("button,a")].filter(el =>
  /فتح\s*360/.test((el.textContent||"").replace(/\s+/g," "))
 );

 buttons.forEach(btn=>{
  if(btn.dataset.twms360Fixed==="1") return;

  let card=btn.closest(".customer, .customer-card, [data-customer-id], article");

  if(!card){
   let p=btn.parentElement;
   for(let i=0;i<6 && p;i++,p=p.parentElement){
    const text=p.textContent||"";
    if((/📞|الهاتف|📍|العنوان/.test(text)) && p.querySelector("button,a")){
     card=p;
     break;
    }
   }
  }

  if(!card) card=btn.parentElement;
  if(!card) return;

  let slot=card.querySelector(":scope > .twms-360-slot");
  if(!slot){
   slot=document.createElement("div");
   slot.className="twms-360-slot";
   card.appendChild(slot);
  }

  slot.appendChild(btn);
  btn.dataset.twms360Fixed="1";

  btn.style.setProperty("position","static","important");
  btn.style.setProperty("inset","auto","important");
  btn.style.setProperty("float","none","important");
  btn.style.setProperty("transform","none","important");
  btn.style.setProperty("display","inline-flex","important");
  btn.style.setProperty("align-items","center","important");
  btn.style.setProperty("justify-content","center","important");
  btn.style.setProperty("width","auto","important");
  btn.style.setProperty("max-width","100%","important");
  btn.style.setProperty("margin","10px 0 0 auto","important");
  btn.style.setProperty("z-index","1","important");
 });
}

function installCustomer360Fix(){
 const style=document.createElement("style");
 style.textContent=
  ".twms-360-slot{display:flex!important;justify-content:flex-start!important;align-items:center!important;width:100%!important;clear:both!important;margin-top:8px!important;padding-top:8px!important;border-top:1px solid rgba(127,127,127,.16)!important}" +
  ".twms-360-slot>a,.twms-360-slot>button{position:static!important;float:none!important;transform:none!important;max-width:100%!important}" +
  "#twmsDataTools{margin:16px 0} .twms-data-tools-card{padding:16px;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.06)} .twms-data-tools-title{font-size:1.05em;font-weight:700;margin-bottom:7px}.twms-data-tools-note{font-size:.9em;opacity:.75;line-height:1.7}.twms-data-tools-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.twms-data-tools-actions button{border:0;border-radius:10px;padding:10px 14px;cursor:pointer;font:inherit}.twms-data-tools-actions .danger{background:#7f1d1d;color:#fff}";
 document.head.appendChild(style);

 fixCustomer360Buttons();

 new MutationObserver(fixCustomer360Buttons).observe(document.body,{
  childList:true,
  subtree:true
 });
}

if(document.readyState==="loading"){
 document.addEventListener("DOMContentLoaded",installCustomer360Fix);
}else{
 installCustomer360Fix();
}
})();


/* زر منفصل لحذف العميل الحالي بأمان */
window.TWMSUI.deleteCustomer = function(customerId, customerName, callbacks){
  const name = String(customerName || "هذا العميل");
  const id = String(customerId || "");

  if(!id){
    window.TWMSUI.flash("لم يتم تحديد العميل", "error");
    return false;
  }

  const ok1 = window.confirm(
    'حذف العميل "' + name + '"؟\n\nسيتم حذف ملف العميل فقط بعد التأكيد.'
  );
  if(!ok1) return false;

  const typed = window.prompt(
    'للتأكيد النهائي اكتب: حذف\n\nلن يتم تنفيذ الحذف بدون كتابة الكلمة بشكل صحيح.'
  );
  if(typed !== "حذف"){
    window.TWMSUI.flash("تم إلغاء الحذف", "error");
    return false;
  }

  try{
    if(callbacks && typeof callbacks.beforeDelete === "function"){
      callbacks.beforeDelete(id);
    }

    /* دعم أكثر من اسم شائع لمخزن العملاء */
    const keys = ["customers","clients","workshop_customers"];
    let removed = false;

    keys.forEach(key=>{
      try{
        const raw = localStorage.getItem(key);
        if(!raw) return;
        const data = JSON.parse(raw);
        if(Array.isArray(data)){
          const next = data.filter(x =>
            String(x?.id ?? x?.customerId ?? "") !== id
          );
          if(next.length !== data.length){
            localStorage.setItem(key, JSON.stringify(next));
            removed = true;
          }
        }
      }catch(e){}
    });

    if(callbacks && typeof callbacks.afterDelete === "function"){
      callbacks.afterDelete(id);
    }

    window.TWMSUI.flash(
      removed ? "تم حذف العميل بنجاح" : "لم يتم العثور على سجل مطابق",
      removed ? "success" : "error"
    );

    setTimeout(()=>window.location.reload(), 500);
    return removed;
  }catch(e){
    window.TWMSUI.flash("تعذر حذف العميل", "error");
    return false;
  }
};

/* إنشاء زر حذف منفصل داخل بطاقة العميل إن وُجد معرف للبطاقة */
function installCustomerDeleteButtons(){
  const cards = document.querySelectorAll(
    ".customer, .customer-card, [data-customer-id], article"
  );

  cards.forEach(card=>{
    if(card.dataset.twmsDeleteAdded==="1") return;

    const id = card.getAttribute("data-customer-id") ||
      card.dataset.customerId ||
      card.querySelector("[data-customer-id]")?.getAttribute("data-customer-id");

    if(!id) return;

    const nameEl = card.querySelector(
      ".customer-name, [data-customer-name], h2, h3"
    );
    const name = nameEl ? nameEl.textContent.trim() : "هذا العميل";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "🗑️ حذف العميل";
    btn.style.cssText =
      "display:inline-flex;align-items:center;justify-content:center;" +
      "margin:8px 0 0 8px;padding:8px 12px;border:0;border-radius:8px;" +
      "background:#8b1e1e;color:#fff;font:inherit;cursor:pointer;";

    btn.addEventListener("click", ()=>{
      window.TWMSUI.deleteCustomer(id, name);
    });

    let actions = card.querySelector(
      ".customer-actions, .actions, .buttons, .card-actions"
    );

    if(!actions){
      actions = document.createElement("div");
      actions.className = "twms-customer-actions";
      actions.style.cssText =
        "display:flex;flex-wrap:wrap;gap:6px;align-items:center;" +
        "justify-content:flex-start;margin-top:8px;";
      card.appendChild(actions);
    }

    actions.appendChild(btn);
    card.dataset.twmsDeleteAdded = "1";
  });
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded", installCustomerDeleteButtons);
}else{
  installCustomerDeleteButtons();
}
