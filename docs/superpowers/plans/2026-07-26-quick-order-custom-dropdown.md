# Quick Order Custom Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ทำให้ dropdown ทุกช่องใน Quick Order มีรายการที่อ่านง่าย สื่อสถานะชัด และใช้งานได้ด้วยคีย์บอร์ดโดยไม่เปลี่ยน flow การสั่งซื้อผ่าน LINE

**Architecture:** เพิ่มโมดูล vanilla JavaScript สำหรับยกระดับ native select ไปเป็น listbox ที่เข้าถึงได้ โดย native select ยังเป็น source of truth และถูกซ่อนไว้เฉพาะการมองเห็น โมดูลจะ sync ค่าและข้อความกลับไปยัง select เพื่อให้ validation, FormData, i18n และ conditional fields เดิมทำงานต่อเนื่อง

**Tech Stack:** HTML5, Tailwind CSS utility classes, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- ไม่เพิ่ม dependency ใด ๆ และไม่เปลี่ยน payload, validation หรือ LINE URL
- รองรับ product, quantity, budget range และ delivery need เท่านั้น
- รองรับ mouse, touch, keyboard (Tab, Arrow Up/Down, Home/End, Enter, Space, Escape) และ ARIA
- ใช้ native select เป็น source of truth และ refresh เมื่อภาษา/รายการสินค้าเปลี่ยน
- รักษา encoding ของไฟล์และการเปลี่ยนแปลงนอกขอบเขต

---

### Task 1: สร้างโมดูล custom dropdown ที่ทดสอบได้

**Files:**

- Create: `assets/js/ui/custom-dropdown.js`
- Create: `tests/custom-dropdown.test.cjs`

**Interfaces:**

- Consumes: native `HTMLSelectElement` ที่มี option อยู่แล้ว
- Produces: `window.PremiumKhaoMaoCustomDropdown.create(select)` ซึ่งคืน object `{ refresh(), destroy() }`

- [ ] **Step 1: Write the failing test**

```js
const { getNextEnabledOptionIndex } = require("../assets/js/ui/custom-dropdown.js");

test("getNextEnabledOptionIndex wraps and skips disabled options", () => {
  const options = [{ disabled: false }, { disabled: true }, { disabled: false }];
  assert.equal(getNextEnabledOptionIndex(options, 2, 1), 0);
  assert.equal(getNextEnabledOptionIndex(options, 0, 1), 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/custom-dropdown.test.cjs`

Expected: FAIL เพราะยังไม่พบโมดูลหรือ exported helper

- [ ] **Step 3: Write minimal implementation**

```js
const create = (select) => {
  // สร้าง button aria-haspopup="listbox" และ ul role="listbox"
  // เลือก option ด้วย click/keyboard แล้ว set select.value พร้อม dispatch change
  // refresh สร้างรายการจาก select.options และสะท้อน selected/disabled state
  // ปิดเมนูเมื่อคลิกภายนอกหรือกด Escape
};

const getNextEnabledOptionIndex = (options, currentIndex, direction) => { /* wrap + skip */ };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/custom-dropdown.test.cjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/ui/custom-dropdown.js tests/custom-dropdown.test.cjs
git commit -m "feat: add accessible custom dropdown"
```

### Task 2: เชื่อม custom dropdown กับ Quick Order และ i18n

**Files:**

- Modify: `index.html:1222-1280,1434-1436`
- Modify: `assets/js/core/main.js:258-264,613-660`

**Interfaces:**

- Consumes: `window.PremiumKhaoMaoCustomDropdown.create(select)`
- Produces: dropdown ทั้งสี่ช่องที่ refresh หลัง `renderQuickOrderProductOptions()` และ languagechange

- [ ] **Step 1: เพิ่ม script โมดูลก่อน `main.js` และ data attribute ให้ select เป้าหมาย**

```html
<select id="quick-order-product" data-custom-dropdown class="quick-order-input">...</select>
<script src="assets/js/ui/custom-dropdown.js"></script>
<script src="assets/js/core/main.js"></script>
```

- [ ] **Step 2: สร้าง `initQuickOrderCustomDropdowns()` ใน main.js**

```js
const quickOrderDropdowns = new Map();

function initQuickOrderCustomDropdowns() {
  document.querySelectorAll("#quick-order-form select[data-custom-dropdown]").forEach((select) => {
    const dropdown = quickOrderDropdowns.get(select) || window.PremiumKhaoMaoCustomDropdown.create(select);
    quickOrderDropdowns.set(select, dropdown);
    dropdown.refresh();
  });
}
```

- [ ] **Step 3: เรียก initialization หลัง render product options และหลัง languagechange**

```js
renderQuickOrderProductOptions();
initQuickOrderCustomDropdowns();
```

- [ ] **Step 4: ตรวจ syntax และ unit tests เดิม**

Run: `node --check assets/js/ui/custom-dropdown.js; node --check assets/js/core/main.js; node --test tests/*.test.cjs`

Expected: ทุกคำสั่งจบด้วย exit code 0

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/core/main.js
git commit -m "feat: enhance quick order dropdowns"
```

### Task 3: ตรวจ UX บนเบราว์เซอร์และ regression ของฟอร์ม

**Files:**

- Modify: `assets/js/ui/custom-dropdown.js` เฉพาะเมื่อพบปัญหา
- Modify: `index.html` เฉพาะเมื่อพบปัญหา

**Interfaces:**

- Consumes: Quick Order form ที่ติดตั้ง custom dropdown แล้ว
- Produces: ฟอร์มที่เลือกค่า ส่ง error และสร้างข้อความ LINE ได้เหมือนเดิม

- [ ] **Step 1: เปิด `index.html` แล้วตรวจ responsive ที่ desktop และ mobile**

ตรวจว่า listbox ไม่ล้นหน้าจอ, item อ่านง่าย, hover/focus/selected state มองเห็นชัด และ trigger สะท้อนค่าที่เลือก

- [ ] **Step 2: ตรวจ interaction และ accessibility**

ทดสอบเปิด/ปิดด้วย click, click outside, Escape, Arrow Up/Down, Home/End, Enter/Space และ Tab; ตรวจ `aria-expanded`, `aria-controls`, `role=listbox`, `role=option`, `aria-selected`

- [ ] **Step 3: ตรวจ regression ของ Quick Order**

เลือก `อื่นๆ` ให้ช่องรายละเอียดปรากฏ, เลือก `ระบุวันที่เอง` ให้ date input ปรากฏ, เปลี่ยนภาษาแล้วข้อความรายการอัปเดต และ submit ฟอร์มที่ข้อมูลไม่ครบให้ error ถูกต้อง

- [ ] **Step 4: รัน verification สุดท้าย**

Run: `node --check assets/js/ui/custom-dropdown.js; node --check assets/js/core/main.js; node --test tests/*.test.cjs; git diff --check`

Expected: ทุกคำสั่งจบด้วย exit code 0

- [ ] **Step 5: Commit การแก้ไขจาก QA (ถ้ามี)**

```bash
git add assets/js/ui/custom-dropdown.js index.html
git commit -m "fix: polish quick order dropdown interaction"
```

## Plan Self-Review

- Spec coverage: Task 1 ครอบคลุม UI state, keyboard และ ARIA; Task 2 ครอบคลุม native select, i18n และ flow เดิม; Task 3 ครอบคลุม visual/accessibility/regression verification.
- Placeholder scan: ไม่มี `TBD`, `TODO`, หรือขั้นตอนที่ไม่ระบุพฤติกรรมและคำสั่งตรวจสอบ.
- Type consistency: ทุก task ใช้ `window.PremiumKhaoMaoCustomDropdown.create(select)` และ object `{ refresh(), destroy() }` ชุดเดียวกัน.
