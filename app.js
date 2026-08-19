const KEY='workshop_mini_customers';
function getCustomers(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
function saveCustomers(x){localStorage.setItem(KEY,JSON.stringify(x))}
function renderCustomers(){
 const el=document.getElementById('customerList'); if(!el)return;
 const data=getCustomers();
 el.innerHTML=data.length?data.map(c=>`<div class="item"><b>${esc(c.name)}</b><br>📞 ${esc(c.phone)}<br>📍 ${esc(c.area)}${c.village?' - '+esc(c.village):''} - ${esc(c.address)}</div>`).join(''):'<div class="item">لا يوجد عملاء حتى الآن.</div>';
}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
document.addEventListener('DOMContentLoaded',()=>{
 const area=document.getElementById('area'), wrap=document.getElementById('villageWrap');
 if(area) area.addEventListener('change',()=>{wrap.style.display=area.value==='مطاي'?'block':'none'; if(area.value!=='مطاي')document.getElementById('village').value='';});
 const form=document.getElementById('customerForm');
 if(form) form.addEventListener('submit',e=>{
   e.preventDefault();
   const c={id:crypto.randomUUID(),name:customerName.value.trim(),phone:customerPhone.value.trim(),area:area.value,village:area.value==='مطاي'?village.value:'',address:address.value.trim()};
   const data=getCustomers(); data.push(c); saveCustomers(data); form.reset(); wrap.style.display='none'; renderCustomers();
 });
 renderCustomers();
});