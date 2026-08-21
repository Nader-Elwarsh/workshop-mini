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
  ".twms-360-slot>a,.twms-360-slot>button{position:static!important;float:none!important;transform:none!important;max-width:100%!important}";
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


/* زر حذف منفصل داخل كل بطاقة عميل */
(function(){
  const STYLE_ID="twms-delete-customer-style";

  function style(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement("style");
    s.id=STYLE_ID;
    s.textContent=".twms-customer-actions{display:flex!important;flex-wrap:wrap!important;gap:7px!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;clear:both!important;margin-top:10px!important;padding-top:8px!important;border-top:1px solid rgba(127,127,127,.14)!important}.twms-delete-customer-btn{display:inline-flex!important;position:static!important;width:auto!important;min-width:92px!important;height:38px!important;padding:6px 12px!important;margin:0!important;border:0!important;border-radius:9px!important;background:#7d2020!important;color:#fff!important;font:inherit!important;line-height:1!important;cursor:pointer!important;z-index:2!important}";
    document.head.appendChild(s);
  }

  function cardFor(el){
    return el.closest(".customer-card,.customer,.client-card,.client,[data-customer-id],article,.card")||el.parentElement?.parentElement;
  }

  function idOf(card){
    return card?.getAttribute("data-customer-id")||card?.dataset.customerId||card?.querySelector("[data-customer-id]")?.getAttribute("data-customer-id")||"";
  }

  function nameOf(card){
    const el=card?.querySelector(".customer-name,[data-customer-name],h2,h3,.name");
    return (el?.textContent||"هذا العميل").replace(/\s+/g," ").trim();
  }

  function removeLocal(id,name){
    let changed=false;
    for(const key of ["customers","clients","workshop_customers"]){
      try{
        const raw=localStorage.getItem(key); if(!raw) continue;
        const data=JSON.parse(raw);
        if(Array.isArray(data)){
          const next=data.filter(x=>{
            const xid=String(x?.id??x?.customerId??"");
            const xn=String(x?.name??x?.fullName??x?.customerName??"").trim();
            return id ? xid!==String(id) : xn!==String(name).trim();
          });
          if(next.length!==data.length){localStorage.setItem(key,JSON.stringify(next));changed=true;}
        }
      }catch(e){}
    }
    return changed;
  }

  function del(card){
    const id=idOf(card), name=nameOf(card);
    if(!confirm('حذف العميل "'+name+'"?\n\nسيتم حذف ملف العميل فقط بعد التأكيد.')) return;
    if(prompt("للتأكيد النهائي اكتب: حذف")!=="حذف"){
      window.TWMSUI?.flash?.("تم إلغاء الحذف","error"); return;
    }
    try{
      if(typeof window.deleteCustomer==="function") window.deleteCustomer(id||name);
      else if(typeof window.removeCustomer==="function") window.removeCustomer(id||name);
      else if(removeLocal(id,name)){card.remove();window.TWMSUI?.flash?.("تم حذف العميل","success");}
      else window.TWMSUI?.flash?.("لم يتم العثور على دالة حذف العميل في التطبيق","error");
    }catch(e){window.TWMSUI?.flash?.("تعذر تنفيذ الحذف","error");}
  }

  function install(){
    style();
    const targets=[...document.querySelectorAll(".customer-card,.customer,.client-card,.client,[data-customer-id],article,.card")];
    document.querySelectorAll("a,button").forEach(b=>{
      if(/فتح\s*360/.test((b.textContent||"").replace(/\s+/g,""))){
        const c=cardFor(b); if(c&&!targets.includes(c)) targets.push(c);
      }
    });
    targets.forEach(card=>{
      if(!card||card.dataset.twmsDeleteButton==="1") return;
      if(!/فتح\s*360|📞|الهاتف|العنوان/.test((card.textContent||"").replace(/\s+/g,""))) return;
      let box=card.querySelector(".twms-customer-actions");
      if(!box){box=document.createElement("div");box.className="twms-customer-actions";card.appendChild(box);}
      const b=document.createElement("button");
      b.type="button";b.className="twms-delete-customer-btn";b.textContent="🗑️ حذف";
      b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();del(card);});
      box.appendChild(b);card.dataset.twmsDeleteButton="1";
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install); else install();
  new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
})();
