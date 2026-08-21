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
 let box=document.getElementById("twmsFlash");
 if(!box){
  box=document.createElement("div");
  box.id="twmsFlash";
  document.body.appendChild(box);
 }
 box.textContent=String(message||"");
 box.className=type==="error"?"twms-error":"twms-success";
 setTimeout(()=>box.remove(),3500);
};

function injectStyle(){
 if(document.getElementById("twms-ui-v2-style"))return;
 const s=document.createElement("style");
 s.id="twms-ui-v2-style";
 s.textContent=`
 #twmsFlash{position:fixed;top:12px;right:12px;z-index:9999;max-width:90vw;padding:12px 16px;border-radius:10px;font:inherit;box-shadow:0 4px 18px rgba(0,0,0,.15)}
 #twmsFlash.twms-success{background:#e3f7e9;color:#146c2e}
 #twmsFlash.twms-error{background:#ffe2e2;color:#a00000}
 .customer-actions{position:static!important;display:flex!important;flex-wrap:wrap!important;gap:6px!important;align-items:center!important;justify-content:flex-start!important;clear:both!important}
 .customer-actions button,.customer-actions a{position:static!important;inset:auto!important;float:none!important;transform:none!important;flex:0 0 auto!important;min-width:0!important;width:auto!important;max-width:100%!important;margin:0!important;padding:7px 10px!important;font-size:14px!important;line-height:1.25!important}
 .customer-head h3{font-size:19px!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 .twms-360-slot{display:none!important}
 @media(max-width:720px){
  .customer-actions button,.customer-actions a{font-size:13px!important;padding:7px 9px!important}
  .customer-head h3{font-size:18px!important;max-width:60vw!important}
 }
 `;
 document.head.appendChild(s);
}

function normalize360(){
 document.querySelectorAll("button,a").forEach(btn=>{
  const text=(btn.textContent||"").replace(/\s+/g," ");
  if(!/(?:فتح|ملف)\s*360/.test(text))return;
  const actions=btn.closest(".customer-actions");
  if(actions){
   btn.style.position="static";
   btn.style.inset="auto";
   btn.style.transform="none";
   btn.style.float="none";
   btn.style.margin="0";
   actions.appendChild(btn);
  }
 });
}

function boot(){
 injectStyle();
 normalize360();
 const obs=new MutationObserver(()=>normalize360());
 obs.observe(document.body,{childList:true,subtree:true});
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();
})();
