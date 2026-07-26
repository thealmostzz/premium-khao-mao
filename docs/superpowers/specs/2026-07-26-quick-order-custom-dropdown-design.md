# Quick Order Custom Dropdown Design

## เป้าหมาย

ยกระดับรายการ dropdown ในฟอร์ม Quick Order ให้ดูพรีเมียม อ่านง่าย และใช้งานได้ดีบนเดสก์ท็อปกับมือถือ โดยไม่เปลี่ยนข้อมูลหรือ flow การสั่งซื้อผ่าน LINE

## แนวทางที่เลือก

ใช้ custom dropdown แบบไม่พึ่ง dependency เพิ่ม เติม โดยเก็บ native `<select>` เดิมเป็น source of truth สำหรับค่า form, validation และการสร้างข้อความ LINE

แต่ละ dropdown จะแสดง trigger ที่มีข้อความที่เลือกและ chevron จากนั้นเปิด listbox ที่:

- เว้นระยะ item ชัดเจน มี hover, focus และ selected state ตามสี leaf/gold ของแบรนด์
- มีเครื่องหมายเลือกในรายการที่เลือก และทำให้ placeholder แตกต่างจากค่าจริง
- ปิดเมื่อคลิกภายนอกหรือกด Escape
- รองรับ Tab, Arrow Up/Down, Home/End, Enter และ Space
- ใช้ ARIA role/state ให้ screen reader รับรู้สถานะและรายการ

## ขอบเขต

ใช้กับ product, quantity, budget range และ delivery need เท่านั้น ไม่เปลี่ยน input อื่น, validation, i18n, payload หรือ URL ของ LINE

เมื่อภาษาเปลี่ยนหรือรายการสินค้าถูก render ใหม่ ต้อง refresh custom dropdown เพื่อให้ข้อความใน listbox ตรงกับ native select เสมอ

## การตรวจสอบ

- ทดสอบ unit test ที่มีอยู่ของ Quick Order ให้ผ่าน
- ตรวจ syntax JavaScript
- เปิดหน้าเว็บและทดสอบการเลือก, ปิดเมนู, คีย์บอร์ด, การเปลี่ยนภาษา และการเปิด/ซ่อนช่องเงื่อนไข
