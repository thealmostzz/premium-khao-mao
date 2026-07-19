# Client Security Hardening Design

วันที่: 2026-07-19

## เป้าหมาย

ลดความเสี่ยงฝั่ง client โดยคงหน้าตาและขั้นตอน Quick Order เดิมไว้ พร้อมทำให้ static site พร้อมตั้ง Content Security Policy (CSP) ที่เข้มงวดเมื่อทราบผู้ให้บริการ hosting

## ขอบเขต

1. ตรึงเวอร์ชัน Tailwind CSS ใน `devDependencies` และสร้าง lockfile
2. สร้าง CSS จาก Tailwind ล่วงหน้า แล้วเลิกโหลด runtime Tailwind compiler ในเบราว์เซอร์
3. ย้าย JavaScript inline และ inline event handler ออกจาก HTML
4. กรอง HTML ของข้อความแปลด้วย allowlist ก่อนเพิ่มลง DOM
5. แจ้งผู้ใช้ว่า Quick Order จะเปิด LINE พร้อมรายละเอียดที่กรอก และไม่ขอข้อมูลส่วนบุคคลเกินจำเป็น
6. เพิ่ม regression test สำหรับ policy ของ HTML translation, URL ของ LINE และการไม่มี inline executable JavaScript

## สิ่งที่อยู่นอกขอบเขต

ยังไม่เพิ่ม HTTP security headers เพราะยังไม่ทราบ hosting platform และรูปแบบ configuration ต่างกันตามผู้ให้บริการ ไม่มี backend, API, database หรือระบบ authentication ใน repository นี้ให้แก้ไข

## การออกแบบ

### Asset และ dependency

ใช้ `tailwindcss` เวอร์ชันที่ตรึงไว้ใน `devDependencies` พร้อม `package-lock.json` และเปลี่ยนคำสั่ง build ให้ใช้ local binary เท่านั้น จากนั้น link ไฟล์ CSS ที่ generate แล้วในทั้ง `index.html` และ `legal.html` แทน `assets/vendor/js/tailwind-cdn.js`

### CSP readiness

ย้าย Tailwind config, analytics bootstrap และ page-specific logic ไปอยู่ใน external JavaScript files. แทน `onclick` ด้วย `data-*` attributes และ event delegation ใน script หลัก จึงไม่ต้องพึ่ง `unsafe-inline` สำหรับ executable JavaScript. CSP header จะกำหนดภายหลังที่ hosting โดยเริ่มจาก `script-src 'self'` และจำกัด third-party ตาม asset ที่ใช้งานจริง

### i18n HTML policy

ข้อความที่ต้องมี markup จะผ่าน helper ที่ parse ใน inert template แล้วสร้าง DOM ใหม่จาก allowlist: `br`, `span` และ `a`; อนุญาตเฉพาะ attribute `class` และ link ภายใน `legal.html#privacy-policy`. ข้อความและ attribute อื่นจะใช้ `textContent` หรือ `setAttribute` ตามเดิม จึงไม่ส่ง markup ที่ไม่อนุญาตเข้าสู่หน้าเว็บ

### Quick Order privacy

ข้อความจากฟอร์มยังถูก encode ก่อนเปิด LINE เหมือนเดิม เพิ่มข้อความกำกับว่ารายละเอียดจะถูกส่งไปยัง LINE และผู้ใช้ไม่ควรกรอกข้อมูลส่วนบุคคลที่ไม่จำเป็น ไม่มีการส่งฟอร์มไปยัง server ของเว็บไซต์

## การทดสอบ

- Unit test สำหรับ URL encoding และ HTML translation policy
- Static regression test ว่า HTML ไม่มี inline executable script หรือ inline event handler
- รัน `node --check` ทุกไฟล์ JavaScript, `node --test` ทุก test และ `npm run build:tailwind`

## เกณฑ์ยอมรับ

- runtime Tailwind compiler ไม่ถูกโหลดโดยหน้าเว็บ
- dependency build ถูกตรึงเวอร์ชันและ lockfile อยู่ใน repository
- ไม่มี `onclick` หรือ inline executable JavaScript ใน HTML
- i18n HTML ปฏิเสธ tag, event attribute และ URL ที่ไม่อยู่ใน allowlist
- Quick Order ยังคง validation, การเปิด LINE และการ encode ข้อความเดิม
