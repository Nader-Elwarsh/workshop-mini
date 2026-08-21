Batch 2 corrections:
- Camera input now captures one photo per shot and accumulates multiple camera shots; pressing the camera button again adds another image.
- The visible request customer/device/address selectors were replaced with one searchable picker each to remove duplicate-looking fields.
- Existing data model and localStorage keys are unchanged.
Important: this build still stores image data in browser storage. Permanent server-side image storage without using phone/browser storage requires a backend/object-storage connection; it is not silently invented here.


BATCH 2.6 HOTFIX — 2026-08-21
- توحيد استرجاع أوامر الشغل من المفاتيح القديمة/الأساسية بدون استبدال البيانات الموجودة.
- إضافة زر إغلاق مباشر للأمر المكتمل من قائمة أوامر الشغل.
- تحسين إغلاق الأمر وتحديث القائمة مباشرة.
- تحديث Service Worker cache version لضمان وصول الموقع للنسخة الجديدة بعد الرفع.
- إصلاح توقف صفحة أوامر الشغل عن عرض القائمة بسبب الاعتماد على متغيرات عناصر DOM غير معرفة بشكل صريح (requestSearch/statusFilter/workshopFilter). تم ربطها مباشرة عبر getElementById، مع تحديث نسخة Service Worker.
