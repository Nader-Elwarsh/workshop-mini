/* =========================================================
   الورشة الفنية — الترحيلات (migrations.js)
   =========================================================
   بيشتغل مرة واحدة بس لكل تعديل في شكل البيانات (schema)، بالمقارنة
   بين wf_schema_version المحفوظ والإصدار الحالي (CURRENT_SCHEMA_VERSION
   في shared-data.js). كل ترحيل بياخد رقم إصدار "من" و"لحد"، وبيتنفذوا
   بالترتيب. الملف ده لازم يتحمّل بعد shared-data.js وimage-store.js
   وقبل app.js، وrunMigrations() لازم تتنادى (وتتنتظر await) قبل أول
   رندر في الصفحة.
   ========================================================= */
(function (window) {
  "use strict";

  // ترحيل 1 → 2: نقل صور الأجهزة والقطع من base64 جوه localStorage
  // إلى IndexedDB (image-store.js)، والاستبدال بمرجع قصير بدل الصورة
  // نفسها. راجع شرح السبب في أعلى image-store.js.
  async function migrate1to2() {
    if (!window.ImageStore) return; // الصفحة لسه ما حمّلتش image-store.js
    let K = window.K;
    for (const key of [K.d, K.p]) {
      let list = arr(key);
      let changed = false;
      for (const rec of list) {
        if (rec.photo && String(rec.photo).startsWith("data:")) {
          try {
            rec.photo = await window.ImageStore.save(rec.photo);
            changed = true;
          } catch (e) {
            console.error("[migrations] تعذر ترحيل صورة سجل", rec.id, e);
          }
        }
      }
      if (changed) put(key, list);
    }
  }

  const MIGRATIONS = [
    { from: 1, to: 2, run: migrate1to2 }
  ];

  async function runMigrations() {
    let v = window.getSchemaVersion ? window.getSchemaVersion() : 1;
    let target = window.CURRENT_SCHEMA_VERSION || 1;
    if (v >= target) return;
    for (const m of MIGRATIONS) {
      if (v === m.from) {
        try {
          await m.run();
          v = m.to;
          window.setSchemaVersion(v);
        } catch (e) {
          console.error(`[migrations] فشل الترحيل من ${m.from} إلى ${m.to}`, e);
          break; // نوقف السلسلة عند أول فشل بدل ما نكمل على بيانات غير متسقة
        }
      }
    }
  }

  window.runMigrations = runMigrations;
})(window);
