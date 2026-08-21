Batch 2 corrections:
- Camera input now captures one photo per shot and accumulates multiple camera shots; pressing the camera button again adds another image.
- The visible request customer/device/address selectors were replaced with one searchable picker each to remove duplicate-looking fields.
- Existing data model and localStorage keys are unchanged.
Important: this build still stores image data in browser storage. Permanent server-side image storage without using phone/browser storage requires a backend/object-storage connection; it is not silently invented here.
