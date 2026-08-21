/* Workshop Mini V2 — focused enhancements
   Scope: Customers / Devices only, plus safe shared helpers.
   Keeps the existing project structure, localStorage and UI.
*/
(function () {
  "use strict";

  // Existing app.js calls this helper when saving customers, but the current
  // mini build does not define it. Keep the duplicate warning without
  // preventing creation.
  window.duplicateCustomerByPhone = function (phone, excludeId) {
    const normalized = String(phone || "").replace(/\s+/g, "").trim();
    if (!normalized) return null;
    const rows = typeof arr === "function" && typeof K === "object" ? arr(K.c) : [];
    return rows.find(function (c) {
      return String(c.id) !== String(excludeId || "") &&
             String(c.phone || "").replace(/\s+/g, "").trim() === normalized;
    }) || null;
  };

  function customerRows() {
    return JSON.parse(localStorage.getItem("wf_c") || "[]");
  }
  function deviceRows() {
    return JSON.parse(localStorage.getItem("wf_d") || "[]");
  }
  function requestRows() {
    return JSON.parse(localStorage.getItem("wf_r") || "[]");
  }
  function stockRows() {
    return JSON.parse(localStorage.getItem("wf_p") || "[]");
  }
  function moveRows() {
    return JSON.parse(localStorage.getItem("wf_m") || "[]");
  }
  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function restorePartsForRequests(requests) {
    const stock = stockRows();
    (requests || []).forEach(function (r) {
      (r.parts || []).forEach(function (part) {
        const p = stock.find(function (x) { return x.id === part.partId; });
        if (p) p.qty = (+p.qty || 0) + (+part.qty || 0);
      });
    });
    save("wf_p", stock);
  }

  // Customer search: keep the existing UI, but search all useful customer
  // fields including both addresses and make Arabic/phone matching forgiving.
  window.renderCustomers = function () {
    const el = document.getElementById("customerList");
    if (!el) return;
    const raw = (document.getElementById("customerSearch")?.value || "").toLowerCase().trim();
    const q = raw.replace(/\s+/g, " ");
    const rows = customerRows().filter(function (c) {
      const main = typeof addressText === "function" ? addressText(c.mainAddress || {}) : "";
      const extra = typeof addressText === "function" ? addressText(c.extraAddress || {}) : "";
      const hay = [
        c.name, c.phone, c.phone2, c.nickname,
        main, extra,
        c.mainAddress?.street, c.extraAddress?.street
      ].filter(Boolean).join(" ").toLowerCase();
      return !q || hay.includes(q);
    });

    el.innerHTML = rows.length ? rows.map(function (c) {
      const devices = deviceRows().filter(function (d) { return d.customerId === c.id; });
      const orders = requestRows().filter(function (r) { return r.customerId === c.id; });
      const main = typeof addressText === "function" ? addressText(c.mainAddress || {}) : "";
      return `<div class="item record-card">
        <div class="card-side-actions">
          <a class="primary small-btn" href="customer.html?id=${c.id}">فتح 360°</a>
          <button class="danger-btn small-btn" type="button" onclick="deleteCustomerRecord('${c.id}')">🗑️ حذف</button>
        </div>
        <div class="record-main">
          <div class="item-head">
            <a href="customer.html?id=${c.id}"><b>👤 ${esc(c.name)}</b></a>
            <span class="badge">🔧 ${devices.length} أجهزة • 🛠️ ${orders.length} أوامر</span>
          </div>
          <div>📞 ${esc(c.phone || "—")}</div>
          <div>📍 ${esc(main || "—")}</div>
        </div>
      </div>`;
    }).join("") : '<div class="item">لا توجد نتائج.</div>';
  };

  // Customer 360°: same page, clearer summary and linked records.
  window.customerProfile = function () {
    const el = document.getElementById("customerProfile");
    if (!el) return;
    const idValue = new URLSearchParams(location.search).get("id");
    const c = customerRows().find(function (x) { return x.id === idValue; });
    if (!c) {
      el.innerHTML = "<div class='item'>العميل غير موجود.</div>";
      return;
    }

    const ds = deviceRows().filter(function (d) { return d.customerId === c.id; });
    const rs = requestRows().filter(function (r) { return r.customerId === c.id; });
    const main = typeof addressText === "function" ? addressText(c.mainAddress || {}) : "";
    const extra = typeof addressText === "function" ? addressText(c.extraAddress || {}) : "";

    el.innerHTML = `
      <div class="profile">
        <div class="page-head">
          <h1 class="profile-title">👤 ${esc(c.name)}</h1>
          <div class="compact-actions">
            <button class="secondary" onclick="editCustomer('${c.id}')">✏️ تعديل</button>
            <a class="primary" href="devices.html?customer=${c.id}">➕ جهاز</a>
            <a class="primary" href="requests.html?customer=${c.id}">➕ أمر شغل</a>
          </div>
        </div>
        <div class="profile-grid">
          <div class="kv"><b>📞 التليفون</b>${esc(c.phone || "—")}</div>
          <div class="kv"><b>📍 العنوان الأساسي</b>${esc(main || "—")}</div>
          <div class="kv"><b>📍 العنوان الإضافي</b>${esc(extra || "—")}</div>
          <div class="kv"><b>🔧 عدد الأجهزة</b>${ds.length}</div>
          <div class="kv"><b>🛠️ عدد أوامر الشغل</b>${rs.length}</div>
        </div>
      </div>

      <h2>🔧 الأجهزة</h2>
      ${ds.length ? ds.map(function (d) {
        const count = requestRows().filter(function (r) { return r.deviceId === d.id; }).length;
        return `<div class="item record-card">
          <div class="card-side-actions">
            <a class="primary small-btn" href="device.html?id=${d.id}">فتح الجهاز 360°</a>
          </div>
          <div class="record-main">
            <div><a href="device.html?id=${d.id}"><b>${esc(d.type)} — ${esc(d.brand)}</b></a></div>
            <div>${esc(d.category || "—")} • ${esc(d.model || "بدون موديل")}</div>
            <div class="badge">🛠️ ${count} أوامر شغل</div>
          </div>
        </div>`;
      }).join("") : "<div class='item'>لا توجد أجهزة.</div>"}

      <h2>🛠️ أوامر الشغل</h2>
      ${rs.length ? rs.map(function (r) {
        return `<div class="item record-card">
          <div class="card-side-actions">
            <a class="primary small-btn" href="request.html?id=${r.id}">فتح 360°</a>
          </div>
          <div class="record-main">
            <div>
              <a href="request.html?id=${r.id}"><b>${esc(r.no || "أمر شغل")}</b></a>
              <span class="badge">${esc(r.status || "—")}${r.closed ? " 🔒" : ""}</span>
            </div>
            <div>🔧 ${esc(typeof deviceName === "function" ? deviceName(r.deviceId) : "—")}</div>
            <div>💰 الإجمالي ${(+r.total || 0).toFixed(2)} ج • 💵 العربون ${(+r.deposit || 0).toFixed(2)} ج</div>
          </div>
        </div>`;
      }).join("") : "<div class='item'>لا توجد أوامر.</div>"}
    `;
  };

  // Individual customer deletion is allowed in the experimental build.
  // It warns clearly and removes dependent devices/orders so no orphan
  // records remain. Parts used by those orders return to stock.
  window.deleteCustomerRecord = function (cid) {
    const c = customerRows().find(function (x) { return x.id === cid; });
    if (!c) return;

    const devices = deviceRows().filter(function (d) { return d.customerId === cid; });
    const deviceIds = new Set(devices.map(function (d) { return d.id; }));
    const orders = requestRows().filter(function (r) {
      return r.customerId === cid || deviceIds.has(r.deviceId);
    });

    const message =
      `⚠️ حذف العميل «${c.name || ""}»\n\n` +
      `سيتم حذف العميل مع ${devices.length} جهاز و ${orders.length} أمر شغل مرتبط به.\n` +
      `وسيتم إرجاع قطع الغيار المصروفة لهذه الأوامر إلى المخزن.\n\n` +
      `هل تريد المتابعة؟`;

    if (!confirm(message)) return;

    restorePartsForRequests(orders);

    const orderIds = new Set(orders.map(function (r) { return r.id; }));
    save("wf_m", moveRows().filter(function (m) { return !orderIds.has(m.requestId); }));
    save("wf_r", requestRows().filter(function (r) { return !orderIds.has(r.id); }));
    save("wf_d", deviceRows().filter(function (d) { return d.customerId !== cid; }));
    save("wf_c", customerRows().filter(function (x) { return x.id !== cid; }));

    window.renderCustomers?.();
    window.renderDevices?.();
    window.renderRequests?.();
    window.renderDash?.();
    window.monthReport?.();

    alert("تم حذف العميل والبيانات المرتبطة به بنجاح.");
  };

  // Device deletion is also allowed for testing, with confirmation.
  // Linked orders are removed and their used parts are returned to stock.
  window.deleteDeviceRecord = function (did) {
    const d = deviceRows().find(function (x) { return x.id === did; });
    if (!d) return;

    const orders = requestRows().filter(function (r) { return r.deviceId === did; });
    const message =
      `⚠️ حذف الجهاز «${d.type || ""} — ${d.brand || ""}»\n\n` +
      `سيتم حذف الجهاز مع ${orders.length} أمر شغل مرتبط به.\n` +
      `وسيتم إرجاع قطع الغيار المصروفة لهذه الأوامر إلى المخزن.\n\n` +
      `هل تريد المتابعة؟`;

    if (!confirm(message)) return;

    restorePartsForRequests(orders);

    const orderIds = new Set(orders.map(function (r) { return r.id; }));
    save("wf_m", moveRows().filter(function (m) { return !orderIds.has(m.requestId); }));
    save("wf_r", requestRows().filter(function (r) { return r.deviceId !== did; }));
    save("wf_d", deviceRows().filter(function (x) { return x.id !== did; }));

    window.renderDevices?.();
    window.renderRequests?.();
    window.renderCustomers?.();
    window.renderDash?.();
    window.monthReport?.();

    alert("تم حذف الجهاز والبيانات المرتبطة به بنجاح.");
  };

  // Device search: keep the existing search but include model/description.
  window.renderDevices = function () {
    const el = document.getElementById("deviceList");
    if (!el) return;
    const q = (document.getElementById("deviceSearch")?.value || "").toLowerCase().trim();

    const rows = deviceRows().filter(function (d) {
      const hay = [
        typeof customerName === "function" ? customerName(d.customerId) : "",
        d.type, d.category, d.brand, d.model, d.desc
      ].filter(Boolean).join(" ").toLowerCase();
      return !q || hay.includes(q);
    });

    el.innerHTML = rows.length ? rows.map(function (d) {
      return `<div class="item record-card">
        <div class="card-side-actions">
          <a class="primary small-btn" href="device.html?id=${d.id}">فتح 360°</a>
          <button class="danger-btn small-btn" type="button" onclick="deleteDeviceRecord('${d.id}')">🗑️ حذف</button>
        </div>
        <div class="record-main">
          <div class="item-head">
            <a href="device.html?id=${d.id}"><b>🔧 ${esc(d.type)} — ${esc(d.brand)}</b></a>
            <span class="badge">${esc(typeof customerName === "function" ? customerName(d.customerId) : "—")}</span>
          </div>
          <div>${esc(d.category || "—")} • ${esc(d.model || "بدون موديل")}</div>
        </div>
      </div>`;
    }).join("") : '<div class="item">لا توجد أجهزة.</div>';
  };

  // Run after app.js has initialized the page.
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      window.renderCustomers?.();
      window.renderDevices?.();
      window.customerProfile?.();
    }, 0);
  });
})();


/* Batch 1: searchable customer/device/address selectors */
(function(){
  const configs=[['rCustomer','بحث عن العميل…'],['rDevice','بحث عن الجهاز…'],['rAddress','بحث عن العنوان / القرية…'],['dCustomer','بحث عن العميل…'],['dAddress','بحث عن العنوان / القرية…']];
  function attach(id,ph){const s=document.getElementById(id);if(!s||s.dataset.searchAttached)return;s.dataset.searchAttached='1';const w=document.createElement('div');w.className='select-search-wrap';s.parentNode.insertBefore(w,s);w.appendChild(s);const i=document.createElement('input');i.className='search';i.placeholder=ph;w.insertBefore(i,s);function sync(){const opt=Array.from(s.options).find(o=>o.value===s.value);i.value=opt&&s.value?opt.textContent.trim():''}i.addEventListener('input',()=>{const q=i.value.trim().toLowerCase();const opts=Array.from(s.options);const hit=opts.find(o=>o.value&&o.textContent.toLowerCase().includes(q));if(hit){s.value=hit.value;s.dispatchEvent(new Event('change',{bubbles:true}));}else if(!q){s.value='';s.dispatchEvent(new Event('change',{bubbles:true}));}});s.addEventListener('change',sync);new MutationObserver(sync).observe(s,{childList:true});sync();}function run(){configs.forEach(x=>attach(x[0],x[1]))}document.addEventListener('DOMContentLoaded',run);setTimeout(run,300);setTimeout(run,900);})();
