# Premium Khao Mao

Landing page สำหรับแบรนด์ "ข้าวเม่าพรีเมียม" ที่ออกแบบมาเพื่อสื่อสารภาพลักษณ์ขนมไทยพรีเมียมร่วมสมัย เน้นการเล่าเรื่องแบรนด์ การนำเสนอสินค้า และการปิดการขายผ่านช่องทางติดต่อหลักอย่าง LINE และโทรศัพท์

## ภาพรวมโปรเจกต์

โปรเจกต์นี้เป็นเว็บไซต์แบบ static ที่เน้นความเร็วและความตรงไปตรงมาในการดูแลรักษา เหมาะกับหน้าโปรโมตสินค้า แบรนด์ของฝาก และแคมเปญที่ต้องการปรับคอนเทนต์ได้รวดเร็ว โดยภายใน repo มีทั้งหน้า landing page หลัก, หน้า legal/privacy, ระบบข้อความหลายภาษา และ asset สำหรับภาพสินค้าและงานนำเสนอแบรนด์

## จุดเด่นของโปรเจกต์

- เว็บแบบ static โครงสร้างเรียบง่าย ดูแลง่าย และ deploy ได้สะดวก
- รองรับ 2 ภาษา `ไทย` และ `English`
- แยกข้อความแปลออกจาก logic ชัดเจน ช่วยให้แก้คอนเทนต์ง่าย
- มีหน้า `legal.html` สำหรับนโยบายความเป็นส่วนตัวและเงื่อนไขการสั่งซื้อ
- ใช้ Tailwind CSS ผ่าน build script เพื่อควบคุมดีไซน์และ utility class
- โครงสร้างคอนเทนต์รองรับสินค้า, รีวิว, FAQ และ section เชิง conversion

## Tech Stack

- `HTML` สำหรับโครงสร้างหน้าเว็บ
- `CSS` และ `Tailwind CSS` สำหรับการจัดการดีไซน์
- `Vanilla JavaScript` สำหรับ interaction และ content rendering
- `npm scripts` สำหรับ build/watch ไฟล์ Tailwind

## หน้าและความสามารถหลัก

### หน้าในโปรเจกต์

- `index.html` หน้า landing page หลักของแบรนด์
- `legal.html` หน้านโยบายความเป็นส่วนตัวและเงื่อนไขการสั่งซื้อ

### ความสามารถที่มีในโค้ดตอนนี้

- language switcher สำหรับ `th/en`
- ข้อมูลสินค้า รีวิว และ FAQ ที่จัดการจาก JavaScript
- CTA สำหรับการสั่งซื้อและติดต่อแบรนด์
- asset รูปภาพสินค้าและภาพเล่าเรื่องแบรนด์
- `robots.txt` และ `sitemap.xml` สำหรับ SEO เบื้องต้น

## เริ่มต้นใช้งาน

### ความต้องการเบื้องต้น

- `Node.js` และ `npm`

### ติดตั้ง dependency

```bash
npm install
```

### build ไฟล์ Tailwind

```bash
npm run build:tailwind
```

### watch ระหว่างพัฒนา

```bash
npm run watch:tailwind
```

หลังจากนั้นสามารถเปิด `index.html` ใน browser เพื่อดูหน้าเว็บได้ทันที หรือใช้ local static server ตาม workflow ของทีม

## คำสั่งที่ใช้บ่อย

```bash
npm run build:tailwind
npm run watch:tailwind
```

คำสั่งทั้ง 2 ตัวอ้างอิงจาก `package.json` และใช้ `config/tailwind.config.js` เป็น config หลัก

## โครงสร้างโปรเจกต์

```text
premium-khao-mao/
|- assets/
|  |- css/
|  |  |- base/
|  |  `- source/
|  |- images/
|  |- js/
|  |  |- core/
|  |  `- i18n/
|  `- vendor/
|- config/
|- docs/
|- index.html
|- legal.html
|- package.json
|- robots.txt
`- sitemap.xml
```

## การแก้ไขคอนเทนต์

### แก้ข้อความหลายภาษา

ไฟล์หลักคือ `assets/js/i18n/translations.js`

เหมาะสำหรับแก้:
- ข้อความบนหน้าเว็บ
- label ของปุ่ม
- copywriting ราย section
- ข้อความในหน้า legal

### แก้ข้อมูลสินค้า รีวิว และ FAQ

ไฟล์หลักคือ `assets/js/core/main.js`

ภายในมีข้อมูลและ logic สำคัญ เช่น:
- รายการสินค้า
- รีวิวลูกค้า
- FAQ
- การ render คอนเทนต์แบบ localized
- interaction บนหน้า landing page

### แก้ theme และ utility ของ Tailwind

ไฟล์หลักคือ `config/tailwind.config.js`

ถ้าปรับสี, spacing, font token หรือ utility เพิ่มเติม ควร build Tailwind ใหม่ทุกครั้ง

### แก้ภาพประกอบ

ไฟล์ภาพอยู่ใน `assets/images/`

ควร:
- ใช้ชื่อไฟล์สื่อความหมายและคง naming convention เดิม
- ระวังขนาดไฟล์ภาพเพื่อไม่ให้กระทบ performance
- เลือกภาพที่ยังคุมทิศทางแบรนด์เดิมของโปรเจกต์

## เอกสารที่เกี่ยวข้อง

- `docs/premium_khao_mao_plan.md` แผนและทิศทางของ landing page

## สถานะโปรเจกต์

โปรเจกต์อยู่ในรูปแบบที่พร้อมสำหรับการดูแลต่อยอดด้านคอนเทนต์และ presentation ของแบรนด์ โดยโครงสร้างปัจจุบันเหมาะกับการปรับข้อความ รูปภาพ และ section ทางการตลาดได้ค่อนข้างเร็ว

ถ้าต้องการขยายต่อในอนาคต แนะนำให้พิจารณาเรื่องต่อไปนี้:

- เพิ่มขั้นตอน deploy ที่ชัดเจนใน README
- เพิ่ม screenshot หรือ preview ของหน้าเว็บ
- เพิ่ม local server workflow สำหรับนักพัฒนาใหม่
- เพิ่ม checklist สำหรับการอัปเดตคอนเทนต์สองภาษา
