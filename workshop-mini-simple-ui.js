/* =========================================================
   الورشة الفنية — واجهة بسيطة وغير مزدحمة
   V11.2.6 — Simple UI layer
   لا تغيّر نموذج البيانات؛ فقط تنظّم العرض والتصفح.
   ========================================================= */
(function () {
  "use strict";

  const state = {
    customers: false,
    devices: false,
    parts: false,
    requests: false,
    requestBucket: "",
    customerBucket: "",
    deviceBucket: ""
  };

  const $ = (id) => document.getElementById(id);
  const rows = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const esc2 = (v) => typeof esc === "function" ? esc(v) : String(v ?? "");
  const customerRows = () => rows("wf_c");
  const deviceRows = () => rows("wf_d");
  const requestRows = () => rows("wf_r");
  const partRows = () => rows("wf_p");

  function dateKey(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function locationForOrder(r) {
    const c = customerRows().find(x => x.id === r.customerId) || {};
    let a = c.mainAddress || {};
    if (r.addressKey === "extra" && c.extraAddress) a = c.extraAddress;
    return {
      center: a.center || "بدون مركز",
      village: a.village || "بدون قرية",
      street: a.street || ""
    };
  }

  function orderIsCompleted(r) {
    return !!r.closed || r.status === "مكتمل";
  }

  function orderIsToday(r) {
    return !!r.visit && dateKey(r.visit) === todayKey() && !r.closed && r.status !== "ملغي";
  }

  function orderIsWorkshop(r) {
    return r.executionPlace === "الورشة" ||
      (r.workshopStatus && r.workshopStatus !== "غير مطلوب" && r.workshopStatus !== "تم التسليم");
  }

  function orderIsParts(r) {
    return r.partsWaiting === true || r.partsWaiting === "yes";
  }

  function orderIsOverdue(r) {
    return !!r.visit &&
      dateKey(r.visit) < todayKey() &&
      !orderIsCompleted(r) &&
      r.status !== "ملغي";
  }

  function simpleButton(label, icon, action, cls="") {
    return `<button type="button" class="simple-tile ${cls}" onclick="${action}"><span>${icon}</span><b>${label}</b></button>`;
  }

  function activeOrdersForCustomer(cid) {
    return requestRows().filter(r => r.customerId === cid && !orderIsCompleted(r) && r.status !== "ملغي");
  }

  function activeOrdersForDevice(did) {
    return requestRows().filter(r => r.deviceId === did && !orderIsCompleted(r) && r.status !== "ملغي");
  }

  function hasWorkshopDeviceForCustomer(cid) {
    return deviceRows().some(d => d.customerId === cid && requestRows().some(r =>
      r.deviceId === d.id && orderIsWorkshop(r) && !orderIsCompleted(r)
    ));
  }

  function hasWorkshopDevice(did) {
    return requestRows().some(r => r.deviceId === did && orderIsWorkshop(r) && !orderIsCompleted(r));
  }

  /* ---------- العملاء ---------- */
  window.showAllCustomers = function () {
    state.customers = true;
    $("customerSearch")?.classList.remove("hidden");
    renderCustomers();
  };

  window.hideAllCustomers = function () {
    state.customers = false;
    if ($("customerSearch")) $("customerSearch").classList.add("hidden");
    renderCustomers();
  };

  window.showCustomerBucket = function (bucket) {
    state.customers = true;
    $("customerSearch")?.classList.remove("hidden");
    state.customerBucket = bucket;
    renderCustomers();
  };

  function customerBucketMatch(c, bucket) {
    const orders = requestRows().filter(r => r.customerId === c.id);
    const active = orders.some(r => !orderIsCompleted(r) && r.status !== "ملغي");
    const workshop = hasWorkshopDeviceForCustomer(c.id);
    if (bucket === "active") return active;
    if (bucket === "workshop") return workshop;
    if (bucket === "completed") return orders.length > 0 && !active && orders.some(r => orderIsCompleted(r));
    if (bucket === "none") return orders.length === 0;
    return true;
  }

  window.renderCustomers = function () {
    const el = $("customerList");
    if (!el) return;
    const all = customerRows();

    if (!state.customers) {
      const active = all.filter(c => customerBucketMatch(c, "active")).length;
      const workshop = all.filter(c => customerBucketMatch(c, "workshop")).length;
      const completed = all.filter(c => customerBucketMatch(c, "completed")).length;
      const none = all.filter(c => customerBucketMatch(c, "none")).length;
      el.innerHTML = `
        <section class="simple-home">
          <div class="simple-summary-title"><b>👤 العملاء</b><span>${all.length} إجمالي</span></div>
          <div class="simple-stat-grid">
            ${simpleButton("لديه أمر شغل", "🛠️", "showCustomerBucket('active')", "")}
            ${simpleButton("لديه جهاز في الورشة", "🏭", "showCustomerBucket('workshop')", "")}
            ${simpleButton("أوامره مكتملة", "✅", "showCustomerBucket('completed')", "")}
            ${simpleButton("ليس لديه أمر شغل", "👤", "showCustomerBucket('none')", "")}
          </div>
          <div class="simple-main-actions">
            ${simpleButton("كل العملاء", "👥", "showAllCustomers()", "primary-tile")}
          </div>
        </section>`;
      return;
    }

    const q = ($("customerSearch")?.value || "").toLowerCase().trim();
    const bucket = state.customerBucket || "";
    const filtered = all.filter(c => {
      if (bucket && !customerBucketMatch(c, bucket)) return false;
      const text = [c.name, c.phone, c.phone2, c.nickname,
        addressText(c.mainAddress || {}), addressText(c.extraAddress || {})]
        .filter(Boolean).join(" ").toLowerCase();
      return !q || text.includes(q);
    });
    const title = {active:"لديه أمر شغل", workshop:"لديه جهاز في الورشة", completed:"أوامره مكتملة", none:"ليس لديه أمر شغل"}[bucket] || "كل العملاء";
    el.innerHTML = `
      <div class="simple-list-head"><b>${title}</b><button type="button" class="secondary small-btn" onclick="hideAllCustomers()">رجوع للملخص</button></div>
      ${filtered.length ? filtered.map(c => {
        const ds = deviceRows().filter(d => d.customerId === c.id).length;
        const rs = requestRows().filter(r => r.customerId === c.id).length;
        const ao = activeOrdersForCustomer(c.id).length;
        const hw = hasWorkshopDeviceForCustomer(c.id);
        return `<div class="simple-record"><div class="simple-record-icon">👤</div><div class="simple-record-main">
          <a href="customer.html?id=${c.id}"><b>${esc2(c.name)}</b></a><span>📞 ${esc2(c.phone || "—")}</span>
          <small>🔧 ${ds} أجهزة • 🛠️ ${rs} أوامر${ao ? ` • 🔴 ${ao} فعال` : ""}${hw ? " • 🏭 جهاز في الورشة" : ""}</small>
        </div><div class="simple-record-actions"><a class="secondary small-btn" href="customer.html?id=${c.id}">فتح</a><button class="danger-btn small-btn" onclick="deleteCustomerRecord('${c.id}')">حذف</button></div></div>`;
      }).join("") : `<div class="item">لا توجد نتائج.</div>`}`;
  };

  /* ---------- الأجهزة ---------- */
  window.showAllDevices = function () {
    state.devices = true; state.deviceBucket = "";
    $("deviceSearch")?.classList.remove("hidden"); renderDevices();
  };

  window.hideAllDevices = function () {
    state.devices = false; state.deviceBucket = "";
    if ($("deviceSearch")) $("deviceSearch").classList.add("hidden"); renderDevices();
  };

  window.showDeviceBucket = function (bucket) {
    state.devices = true; state.deviceBucket = bucket;
    $("deviceSearch")?.classList.remove("hidden"); renderDevices();
  };

  function deviceBucketMatch(d, bucket) {
    const orders = requestRows().filter(r => r.deviceId === d.id);
    const active = orders.some(r => !orderIsCompleted(r) && r.status !== "ملغي");
    const workshop = hasWorkshopDevice(d.id);
    if (bucket === "active") return active;
    if (bucket === "workshop") return workshop;
    if (bucket === "completed") return orders.length > 0 && !active && orders.some(r => orderIsCompleted(r));
    if (bucket === "none") return orders.length === 0;
    return true;
  }

  window.renderDevices = function () {
    const el = $("deviceList");
    if (!el) return;
    const all = deviceRows();
    if (!state.devices) {
      el.innerHTML = `<section class="simple-home"><div class="simple-summary-title"><b>🔧 الأجهزة</b><span>${all.length} إجمالي</span></div>
        <div class="simple-stat-grid">
          ${simpleButton("لديه أمر شغل", "🛠️", "showDeviceBucket('active')", "")}
          ${simpleButton("موجود في الورشة", "🏭", "showDeviceBucket('workshop')", "")}
          ${simpleButton("أمره مكتمل", "✅", "showDeviceBucket('completed')", "")}
          ${simpleButton("ليس لديه أمر شغل", "🔧", "showDeviceBucket('none')", "")}
        </div><div class="simple-main-actions">${simpleButton("كل الأجهزة", "🔧", "showAllDevices()", "primary-tile")}</div></section>`;
      return;
    }
    const q = ($("deviceSearch")?.value || "").toLowerCase().trim();
    const bucket = state.deviceBucket || "";
    const filtered = all.filter(d => {
      if (bucket && !deviceBucketMatch(d, bucket)) return false;
      const c = customerRows().find(x => x.id === d.customerId) || {};
      const text = [c.name,c.phone,d.type,d.category,d.brand,d.model,d.desc,addressText(c.mainAddress||{}),addressText(c.extraAddress||{})].filter(Boolean).join(" ").toLowerCase();
      return !q || text.includes(q);
    });
    const title = {active:"لديه أمر شغل", workshop:"موجود في الورشة", completed:"أمره مكتمل", none:"ليس لديه أمر شغل"}[bucket] || "كل الأجهزة";
    el.innerHTML = `<div class="simple-list-head"><b>${title}</b><button type="button" class="secondary small-btn" onclick="hideAllDevices()">رجوع للملخص</button></div>
      ${filtered.length ? filtered.map(d => `<div class="simple-record"><div class="simple-record-icon">🔧</div><div class="simple-record-main"><a href="device.html?id=${d.id}"><b>${esc2(d.type)} — ${esc2(d.brand)}</b></a><span>${esc2(d.category||"—")} • ${esc2(d.model||"بدون موديل")}</span><small>👤 ${esc2(customerName(d.customerId))}${activeOrdersForDevice(d.id).length ? ` • 🔴 ${activeOrdersForDevice(d.id).length} أمر فعال` : ""}${hasWorkshopDevice(d.id) ? " • 🏭 في الورشة" : ""}</small></div><div class="simple-record-actions"><a class="secondary small-btn" href="device.html?id=${d.id}">فتح</a><button class="danger-btn small-btn" onclick="deleteDeviceRecord('${d.id}')">حذف</button></div></div>`).join("") : `<div class="item">لا توجد نتائج.</div>`}`;
  };

  /* ---------- المخزن ---------- */
  window.showAllParts = function () {
    state.parts = true;
    $("partSearch")?.classList.remove("hidden");
    renderParts();
  };

  window.hideAllParts = function () {
    state.parts = false;
    if ($("partSearch")) $("partSearch").classList.add("hidden");
    renderParts();
  };

  window.renderParts = function () {
    const el = $("partList");
    if (!el) return;
    const all = partRows();

    if (!state.parts) {
      const cats = {};
      all.forEach(p => {
        const key = p.category || "أخرى";
        cats[key] = (cats[key] || 0) + 1;
      });
      const low = all.filter(p => (+p.qty || 0) <= (+p.min || 0)).length;
      const cards = Object.entries(cats).slice(0, 6).map(([k,n]) =>
        `<div class="simple-stat"><span>📦</span><b>${esc2(k)}</b><strong>${n}</strong><small>قطعة</small></div>`
      ).join("");

      el.innerHTML = `
        <section class="simple-home">
          <div class="simple-summary-title"><b>📦 المخزن</b><span>${all.length} صنف</span></div>
          <div class="simple-stock-alert">⚠️ ${low} أصناف عند الحد الأدنى أو أقل</div>
          ${cards ? `<div class="simple-stat-grid">${cards}</div>` : `<div class="simple-empty">لا توجد قطع مسجلة.</div>`}
          <div class="simple-main-actions">
            ${simpleButton("كل القطع","📦","showAllParts()","primary-tile")}
          </div>
        </section>`;
      return;
    }

    const q = ($("partSearch")?.value || "").toLowerCase().trim();
    const filtered = all.filter(p => [p.name,p.code,p.location,p.category].filter(Boolean).join(" ").toLowerCase().includes(q));

    el.innerHTML = `
      <div class="simple-list-head">
        <b>كل القطع</b>
        <button type="button" class="secondary small-btn" onclick="hideAllParts()">رجوع للملخص</button>
      </div>
      ${filtered.length ? filtered.map(p => `
        <div class="simple-record">
          <div class="simple-record-icon">📦</div>
          <div class="simple-record-main">
            <a href="part.html?id=${p.id}"><b>${esc2(p.name)}</b></a>
            <span>${esc2(p.category || "—")} • ${esc2(p.code || "بدون كود")}</span>
            <small>📍 ${esc2(p.location || "—")} • شراء ${(+p.buy||0).toFixed(2)} ج • استخدام ${(+p.use||0).toFixed(2)} ج</small>
          </div>
          <span class="simple-qty ${(+p.qty||0) <= (+p.min||0) ? "low" : ""}">${+p.qty||0}</span>
        </div>`).join("") : `<div class="item">لا توجد نتائج.</div>`}`;
  };

  /* ---------- أوامر الشغل ---------- */
  window.showAllRequests = function () {
    state.requests = true;
    state.requestBucket = "";
    $("requestSearch")?.classList.remove("hidden");
    $("statusFilter")?.classList.remove("hidden");
    $("workshopFilter")?.classList.remove("hidden");
    renderRequests();
  };

  window.showRequestBucket = function (bucket) {
    state.requests = true;
    state.requestBucket = bucket;
    $("requestSearch")?.classList.add("hidden");
    $("statusFilter")?.classList.add("hidden");
    $("workshopFilter")?.classList.add("hidden");
    renderRequests();
  };

  window.hideAllRequests = function () {
    state.requests = false;
    state.requestBucket = "";
    $("requestSearch")?.classList.add("hidden");
    $("statusFilter")?.classList.add("hidden");
    $("workshopFilter")?.classList.add("hidden");
    renderRequests();
  };

  function bucketFilter(r, b) {
    if (!b) return true;
    if (b.indexOf("tag:") === 0) { const t = b.slice(4); return t ? r.tag === t : !r.tag; }
    if (b === "today") return orderIsToday(r);
    if (b === "workshop") return orderIsWorkshop(r);
    if (b === "completed") return orderIsCompleted(r);
    if (b === "parts") return orderIsParts(r);
    if (b === "overdue") return orderIsOverdue(r);
    return true;
  }

  function orderTagList() {
    return (typeof settings === "function" ? (settings().orderTags || []) : []);
  }

  function tagSummaryHtml(all) {
    const tags = orderTagList();
    if (!tags.length) return "";
    const chips = tags.map(t =>
      simpleButton(t, "🏷️", `showRequestBucket('tag:${t.replace(/'/g, "\\'")}')`)
    ).join("");
    return `<div class="simple-summary-title"><b>🏷️ حسب التصنيف اليدوي</b></div>
      <div class="simple-order-grid">${chips}${simpleButton("بدون تصنيف", "➖", "showRequestBucket('tag:')")}</div>`;
  }

  function orderLocationLabel(r) {
    const x = locationForOrder(r);
    return `${x.center}${x.village && x.village !== "بدون قرية" ? " • " + x.village : ""}`;
  }

  function renderRouteSummary(all) {
    const future = all.filter(r => r.visit && !r.closed && r.status !== "ملغي")
      .sort((a,b) => new Date(a.visit) - new Date(b.visit));
    if (!future.length) return `<div class="simple-empty">📅 لا توجد مواعيد مجدولة قادمة.</div>`;

    const groups = {};
    future.forEach(r => {
      const dk = dateKey(r.visit);
      (groups[dk] ||= []).push(r);
    });

    const dates = Object.keys(groups).sort().slice(0, 4);
    return `<div class="route-summary">
      <div class="simple-summary-title"><b>📅 خط السير القادم</b><span>${future.length} موعد</span></div>
      ${dates.map(dk => {
        const byCenter = {};
        groups[dk].forEach(r => {
          const loc = locationForOrder(r);
          const key = loc.center;
          (byCenter[key] ||= []).push(r);
        });
        const d = new Date(dk + "T00:00:00");
        return `<div class="route-day">
          <div class="route-day-title"><b>${d.toLocaleDateString("ar-EG",{weekday:"long",day:"2-digit",month:"2-digit"})}</b><span>${groups[dk].length} أمر</span></div>
          ${Object.entries(byCenter).map(([center,rs]) => {
            const byVillage = {};
            rs.forEach(r => {
              const loc = locationForOrder(r);
              (byVillage[loc.village] ||= []).push(r);
            });
            return `<div class="route-center"><b>📍 ${esc2(center)}</b>
              ${Object.entries(byVillage).map(([village,vr]) => `
                <div class="route-village">
                  <span>${esc2(village)}</span>
                  <strong>${vr.length}</strong>
                  <small>${vr.map(r=>`<a href="request.html?id=${r.id}">${esc2(r.no)}</a>`).join(" • ")}</small>
                </div>`).join("")}
            </div>`;
          }).join("")}
        </div>`;
      }).join("")}
    </div>`;
  }

  function renderRequestSummary() {
    const el = $("requestList");
    if (!el) return;
    const all = requestRows();
    const counts = {
      today: all.filter(orderIsToday).length,
      workshop: all.filter(orderIsWorkshop).length,
      completed: all.filter(orderIsCompleted).length,
      parts: all.filter(orderIsParts).length,
      overdue: all.filter(orderIsOverdue).length
    };

    el.innerHTML = `
      <section class="simple-home request-simple-home">
        <div class="simple-summary-title"><b>🛠️ أوامر الشغل</b><span>${all.length} إجمالي</span></div>
        <div class="simple-order-grid">
          ${simpleButton("اليوم","📅","showRequestBucket('today')")}
          ${simpleButton("الورشة","🏭","showRequestBucket('workshop')")}
          ${simpleButton("المكتملة","✅","showRequestBucket('completed')")}
          ${simpleButton("انتظار قطع","📦","showRequestBucket('parts')")}
          ${simpleButton("متأخر","⚠️","showRequestBucket('overdue')")}
          ${simpleButton("كل الأوامر","🛠️","showAllRequests()","primary-tile")}
        </div>
        ${tagSummaryHtml(all)}
      </section>
      ${renderRouteSummary(all)}`;
  }

  window.renderRequestFolders = function () {
    /* لم تعد هناك بطاقات مكررة؛ الملخص الموحد موجود داخل requestList. */
    const el = $("requestFolders");
    if (el) el.innerHTML = "";
  };

  window.renderRequests = function () {
    const el = $("requestList");
    if (!el) return;

    const all = requestRows();

    if (!state.requests) {
      renderRequestSummary();
      if ($("requestSchedule")) $("requestSchedule").innerHTML = "";
      return;
    }

    const q = ($("requestSearch")?.value || "").toLowerCase().trim();
    const sf = $("statusFilter")?.value || "";
    const wf = $("workshopFilter")?.value || "";
    const bucket = state.requestBucket;

    let filtered = all.filter(r => {
      const text = [r.no, customerName(r.customerId), r.fault, orderLocationLabel(r)].filter(Boolean).join(" ").toLowerCase();
      let ok = !q || text.includes(q);
      if (bucket) ok = ok && bucketFilter(r,bucket);
      if (sf) ok = ok && r.status === sf;
      if (wf === "workshop") ok = ok && r.executionPlace === "الورشة";
      if (wf === "pull") ok = ok && r.workshopStatus && r.workshopStatus !== "غير مطلوب" && r.workshopStatus !== "تم التسليم";
      if (wf === "inside") ok = ok && ["تم السحب","استلام الورشة","تحت الإصلاح","جاهز للتسليم"].includes(r.workshopStatus);
      return ok;
    });

    filtered.sort((a,b) => new Date(b.visit || b.createdAt || 0) - new Date(a.visit || a.createdAt || 0));

    const title = bucket === "today" ? "أوامر اليوم" :
      bucket === "workshop" ? "أوامر الورشة" :
      bucket === "completed" ? "الأوامر المكتملة" :
      bucket === "parts" ? "انتظار قطع الغيار" :
      bucket === "overdue" ? "الأوامر المتأخرة" :
      (bucket && bucket.indexOf("tag:") === 0) ? `🏷️ ${bucket.slice(4) || "بدون تصنيف"}` : "كل الأوامر";

    el.innerHTML = `
      <div class="simple-list-head">
        <div><b>${title}</b><small>${filtered.length} أمر</small></div>
        <button type="button" class="secondary small-btn" onclick="hideAllRequests()">رجوع للملخص</button>
      </div>
      ${filtered.length ? filtered.map(r => {
        const loc = locationForOrder(r);
        const status = r.closed ? "مغلق" : (r.status || "—");
        return `<div class="simple-record">
          <div class="simple-record-icon">${r.closed ? "🔒" : "🛠️"}</div>
          <div class="simple-record-main">
            <a href="request.html?id=${r.id}"><b>${esc2(r.no || "أمر شغل")}</b></a>
            <span>${esc2(customerName(r.customerId))} • ${esc2(deviceName(r.deviceId))}</span>
            <small>📍 ${esc2(loc.center)}${loc.village ? " • " + esc2(loc.village) : ""} • ${r.visit ? new Date(r.visit).toLocaleString("ar-EG",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "بدون موعد"}${r.tag ? " • 🏷️ " + esc2(r.tag) : ""}</small>
          </div>
          <div class="simple-record-side">
            <span class="simple-status ${r.closed ? "closed" : ""}">${esc2(status)}</span>
            <b>${(+r.total||0).toFixed(2)} ج</b>
          </div>
        </div>`;
      }).join("") : `<div class="item">لا توجد أوامر في هذا القسم.</div>`}`;
  };

  /* ---------- الإغلاق: الحالة تصبح مكتملة ويُسجل الإغلاق ---------- */
  window.markPaidAndClose = function (i) {
    const a = requestRows();
    const r = a.find(x => x.id === i);
    if (!r || r.closed || r.paid) return;
    if (r.status !== "مكتمل") {
      alert("اجعل حالة أمر الشغل «مكتمل» أولًا.");
      return;
    }
    if (!confirm("تأكيد استلام كامل قيمة الأمر وإغلاقه نهائيًا؟ بعد التأكيد لن يمكن التعديل.")) return;

    const now = new Date().toISOString();
    r.status = "مكتمل";
    r.paid = true;
    r.remain = 0;
    r.paidAt = now;
    r.closed = true;
    r.closedAt = now;
    r.closedStatus = "مغلق";

    save("wf_r", a);
    location.reload();
  };

  window.closeOrder = function (i) {
    window.markPaidAndClose(i);
  };

  function initSimpleView() {
    /* نخفي القوائم والبحث والفلاتر افتراضيًا. */
    ["customerSearch","deviceSearch","partSearch","requestSearch","statusFilter","workshopFilter"].forEach(id => {
      $(id)?.classList.add("hidden");
    });

    if ($("customerSearch")) $("customerSearch").oninput = renderCustomers;
    if ($("deviceSearch")) $("deviceSearch").oninput = renderDevices;
    if ($("partSearch")) $("partSearch").oninput = renderParts;
    if ($("requestSearch")) $("requestSearch").oninput = renderRequests;
    if ($("statusFilter")) $("statusFilter").onchange = renderRequests;
    if ($("workshopFilter")) $("workshopFilter").onchange = renderRequests;

    renderCustomers();
    renderDevices();
    renderParts();
    renderRequests();
  }

  document.addEventListener("DOMContentLoaded", () => setTimeout(initSimpleView, 0));
})();
