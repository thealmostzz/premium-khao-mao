# Quick Order via LINE Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มฟอร์ม Quick Order ใน `Final CTA` เพื่อให้ลูกค้าเลือกสินค้า จำนวน งบประมาณ และวันต้องการรับ แล้วเปิด LINE พร้อมข้อความที่ประกอบอัตโนมัติได้ทั้งภาษาไทยและอังกฤษ

**Architecture:** แยก business logic ของ quick order ออกจาก DOM เป็นโมดูล CommonJS ขนาดเล็กเพื่อให้ทดสอบด้วย `node --test` ได้โดยไม่ต้องเพิ่ม dependency ใหม่ จากนั้นให้ `index.html` แสดงโครงฟอร์ม, `translations.js` ดูแลข้อความหลายภาษา, และ `main.js` เป็นตัวผูก event/render/select options/validation feedback

**Tech Stack:** Static HTML, Vanilla JavaScript, CommonJS for testable helper module, Node built-in `node:test`, Tailwind utility classes และ CSS เดิมของโปรเจกต์

---

## File Structure

- Create: `assets/js/core/quick-order.js`
  - pure helper สำหรับ sanitize, validate, สร้างข้อความ LINE, สร้าง URL, format วันที่
- Create: `tests/quick-order.test.cjs`
  - ทดสอบ helper ด้วย `node:test` และ `assert/strict`
- Modify: `index.html`
  - เพิ่มฟอร์ม Quick Order ใน section `#final-cta` และโหลด helper script ก่อน `main.js`
- Modify: `assets/js/core/main.js`
  - render ตัวเลือกสินค้า, ผูก event, toggle field แบบ conditional, แสดง validation error, เปิด LINE, ยิง tracking
- Modify: `assets/js/i18n/translations.js`
  - เพิ่ม label/placeholder/options/errors/template text สำหรับ `TH/EN`
- Modify: `assets/css/base/main.css`
  - เพิ่ม style เล็กน้อยสำหรับ form shell, error state, helper text ให้เข้ากับ Final CTA

### Task 1: Extract Quick Order Logic Into a Testable Helper

**Files:**
- Create: `assets/js/core/quick-order.js`
- Test: `tests/quick-order.test.cjs`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const quickOrder = require("../assets/js/core/quick-order.js");

test("buildLineMessage includes custom product details and explicit delivery date", () => {
  const message = quickOrder.buildLineMessage({
    greeting: "สวัสดีค่ะ สนใจสั่งซื้อสินค้า",
    labels: {
      product: "สินค้า",
      customProduct: "รายละเอียดเพิ่มเติม",
      quantity: "จำนวน",
      budgetRange: "ช่วงงบ",
      budgetValue: "งบประมาณเพิ่มเติม",
      deliveryNeed: "ต้องการรับ",
      closing: "รบกวนช่วยแนะนำรายการและรอบส่งที่เหมาะสมให้ด้วยค่ะ"
    },
    values: {
      productLabel: "อื่นๆ",
      customProduct: "ข้าวเม่าจัดเซ็ตสำหรับงานไหว้ผู้ใหญ่",
      quantityLabel: "3 กล่อง",
      budgetRangeLabel: "500-1,000 บาท",
      budgetValue: "900",
      deliveryNeedLabel: "ระบุวันที่เอง",
      deliveryDateLabel: "15 กรกฎาคม 2026"
    }
  });

  assert.match(message, /รายละเอียดเพิ่มเติม: ข้าวเม่าจัดเซ็ตสำหรับงานไหว้ผู้ใหญ่/);
  assert.match(message, /ต้องการรับ: 15 กรกฎาคม 2026/);
  assert.doesNotMatch(message, /ระบุวันที่เอง$/m);
});

test("validateQuickOrder requires custom text and future date when those options are selected", () => {
  const result = quickOrder.validateQuickOrder(
    {
      product: "other",
      customProduct: " ",
      quantity: "0",
      budgetRange: "",
      deliveryNeed: "custom-date",
      deliveryDate: "2026-07-01"
    },
    {
      today: "2026-07-05",
      fieldNames: {
        product: "สินค้า",
        customProduct: "รายละเอียดสินค้าเพิ่มเติม",
        quantity: "จำนวน",
        budgetRange: "ช่วงงบประมาณ",
        deliveryDate: "วันที่ต้องการรับ"
      }
    }
  );

  assert.deepEqual(result.errors, {
    customProduct: "กรุณาระบุรายละเอียดสินค้าเพิ่มเติม",
    quantity: "กรุณาเลือกจำนวนอย่างน้อย 1",
    budgetRange: "กรุณาเลือกช่วงงบประมาณ",
    deliveryDate: "กรุณาเลือกวันที่ที่ไม่ย้อนหลัง"
  });
});

test("buildLineUrl URL-encodes the final message", () => {
  const url = quickOrder.buildLineUrl("https://line.me/ti/p/~peeradet22", "ทดสอบ 1 2 3");
  assert.equal(
    url,
    "https://line.me/ti/p/~peeradet22?text=%E0%B8%97%E0%B8%94%E0%B8%AA%E0%B8%AD%E0%B8%9A%201%202%203"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
Error: Cannot find module '../assets/js/core/quick-order.js'
```

- [ ] **Step 3: Write minimal implementation**

```js
(function (global, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  global.PremiumKhaoMaoQuickOrder = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const MAX_CUSTOM_PRODUCT_LENGTH = 120;

  function sanitizeText(value, maxLength = MAX_CUSTOM_PRODUCT_LENGTH) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, maxLength);
  }

  function isPositiveInteger(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0;
  }

  function validateQuickOrder(formValues, options = {}) {
    const fieldNames = options.fieldNames || {};
    const today = options.today || new Date().toISOString().slice(0, 10);
    const errors = {};

    if (!formValues.product) {
      errors.product = `กรุณาเลือก${fieldNames.product || "สินค้า"}`;
    }

    if (formValues.product === "other" && !sanitizeText(formValues.customProduct)) {
      errors.customProduct = `กรุณาระบุ${fieldNames.customProduct || "รายละเอียดสินค้าเพิ่มเติม"}`;
    }

    if (!isPositiveInteger(formValues.quantity)) {
      errors.quantity = "กรุณาเลือกจำนวนอย่างน้อย 1";
    }

    if (!formValues.budgetRange) {
      errors.budgetRange = `กรุณาเลือก${fieldNames.budgetRange || "ช่วงงบประมาณ"}`;
    }

    if (formValues.deliveryNeed === "custom-date") {
      if (!formValues.deliveryDate || formValues.deliveryDate < today) {
        errors.deliveryDate = "กรุณาเลือกวันที่ที่ไม่ย้อนหลัง";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  function buildLineMessage(payload) {
    const labels = payload.labels;
    const values = payload.values;
    const lines = [
      payload.greeting,
      `- ${labels.product}: ${values.productLabel}`,
      values.customProduct ? `- ${labels.customProduct}: ${sanitizeText(values.customProduct)}` : "",
      `- ${labels.quantity}: ${values.quantityLabel}`,
      `- ${labels.budgetRange}: ${values.budgetRangeLabel}`,
      values.budgetValue ? `- ${labels.budgetValue}: ${values.budgetValue} บาท` : "",
      `- ${labels.deliveryNeed}: ${values.deliveryNeedLabel === "ระบุวันที่เอง" ? values.deliveryDateLabel : values.deliveryNeedLabel}`,
      "",
      labels.closing
    ];

    return lines.filter(Boolean).join("\n");
  }

  function buildLineUrl(baseUrl, message) {
    const text = typeof URLSearchParams === "function"
      ? new URLSearchParams({ text: message }).toString()
      : `text=${encodeURIComponent(message)}`;
    return `${baseUrl}?${text}`;
  }

  return {
    sanitizeText,
    validateQuickOrder,
    buildLineMessage,
    buildLineUrl
  };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
# tests 3
# pass 3
# fail 0
```

- [ ] **Step 5: Commit**

```powershell
git add .\assets\js\core\quick-order.js .\tests\quick-order.test.cjs
git commit -m "test: add quick order helper coverage"
```

### Task 2: Add the Quick Order Form Markup, Translation Keys, and Styles

**Files:**
- Modify: `index.html`
- Modify: `assets/js/i18n/translations.js`
- Modify: `assets/css/base/main.css`

- [ ] **Step 1: Write the failing test for English copy and conditional field labels**

```js
test("buildLineMessage supports English labels without Thai-only assumptions", () => {
  const message = quickOrder.buildLineMessage({
    greeting: "Hello, I would like to place an order",
    labels: {
      product: "Product",
      customProduct: "Extra details",
      quantity: "Quantity",
      budgetRange: "Budget range",
      budgetValue: "Budget details",
      deliveryNeed: "Need by",
      closing: "Please recommend a suitable menu and delivery slot."
    },
    values: {
      productLabel: "Premium Wooden Gift Set",
      customProduct: "",
      quantityLabel: "2 sets",
      budgetRangeLabel: "THB 1,000-2,000",
      budgetValue: "",
      deliveryNeedLabel: "Within 2-3 days",
      deliveryDateLabel: ""
    }
  });

  assert.match(message, /Product: Premium Wooden Gift Set/);
  assert.match(message, /Need by: Within 2-3 days/);
  assert.doesNotMatch(message, /บาท/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
not ok
Expected pattern: /Need by: Within 2-3 days/
```

- [ ] **Step 3: Update helper and add UI translation/markup/style scaffolding**

Update `assets/js/core/quick-order.js`:

```js
function buildLineMessage(payload) {
  const labels = payload.labels;
  const values = payload.values;
  const budgetValueSuffix = payload.budgetValueSuffix || "";
  const resolvedDeliveryLabel = values.deliveryNeedValue === "custom-date"
    ? values.deliveryDateLabel
    : values.deliveryNeedLabel;

  const lines = [
    payload.greeting,
    `- ${labels.product}: ${values.productLabel}`,
    values.customProduct ? `- ${labels.customProduct}: ${sanitizeText(values.customProduct)}` : "",
    `- ${labels.quantity}: ${values.quantityLabel}`,
    `- ${labels.budgetRange}: ${values.budgetRangeLabel}`,
    values.budgetValue ? `- ${labels.budgetValue}: ${values.budgetValue}${budgetValueSuffix}` : "",
    `- ${labels.deliveryNeed}: ${resolvedDeliveryLabel}`,
    "",
    labels.closing
  ];

  return lines.filter(Boolean).join("\n");
}
```

Add to `index.html` inside `#final-cta` above the current LINE CTA:

```html
<form id="quick-order-form" class="quick-order-shell mx-auto w-full max-w-4xl text-left" novalidate>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="quick-order-product" class="quick-order-label" data-i18n="quick_order_product_label">สินค้า</label>
      <select id="quick-order-product" name="product" class="quick-order-input" aria-describedby="quick-order-product-error">
        <option value="" data-i18n="quick_order_select_placeholder">เลือกข้อมูล</option>
      </select>
      <p id="quick-order-product-error" class="quick-order-error hidden"></p>
    </div>

    <div id="quick-order-custom-product-wrap" class="hidden">
      <label for="quick-order-custom-product" class="quick-order-label" data-i18n="quick_order_custom_product_label">รายละเอียดสินค้าเพิ่มเติม</label>
      <input id="quick-order-custom-product" name="customProduct" type="text" maxlength="120" class="quick-order-input" data-i18n-attr="placeholder:quick_order_custom_product_placeholder">
      <p id="quick-order-custom-product-error" class="quick-order-error hidden"></p>
    </div>

    <div>
      <label for="quick-order-quantity" class="quick-order-label" data-i18n="quick_order_quantity_label">จำนวน</label>
      <select id="quick-order-quantity" name="quantity" class="quick-order-input">
        <option value="" data-i18n="quick_order_select_placeholder">เลือกข้อมูล</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10+</option>
      </select>
      <p id="quick-order-quantity-error" class="quick-order-error hidden"></p>
    </div>

    <div>
      <label for="quick-order-budget-range" class="quick-order-label" data-i18n="quick_order_budget_range_label">ช่วงงบประมาณ</label>
      <select id="quick-order-budget-range" name="budgetRange" class="quick-order-input">
        <option value="" data-i18n="quick_order_select_placeholder">เลือกข้อมูล</option>
        <option value="under-500" data-i18n="quick_order_budget_under_500">ต่ำกว่า 500 บาท</option>
        <option value="500-1000" data-i18n="quick_order_budget_500_1000">500-1,000 บาท</option>
        <option value="1000-2000" data-i18n="quick_order_budget_1000_2000">1,000-2,000 บาท</option>
        <option value="over-2000" data-i18n="quick_order_budget_over_2000">มากกว่า 2,000 บาท</option>
      </select>
      <p id="quick-order-budget-range-error" class="quick-order-error hidden"></p>
    </div>

    <div>
      <label for="quick-order-budget-value" class="quick-order-label" data-i18n="quick_order_budget_value_label">งบที่ต้องการระบุ</label>
      <input id="quick-order-budget-value" name="budgetValue" type="number" min="0" inputmode="numeric" class="quick-order-input" data-i18n-attr="placeholder:quick_order_budget_value_placeholder">
    </div>

    <div>
      <label for="quick-order-delivery-need" class="quick-order-label" data-i18n="quick_order_delivery_need_label">ช่วงเวลาที่ต้องการรับ</label>
      <select id="quick-order-delivery-need" name="deliveryNeed" class="quick-order-input">
        <option value="" data-i18n="quick_order_select_placeholder">เลือกข้อมูล</option>
        <option value="urgent" data-i18n="quick_order_delivery_urgent">ด่วนที่สุด</option>
        <option value="2-3-days" data-i18n="quick_order_delivery_2_3_days">ภายใน 2-3 วัน</option>
        <option value="1-week" data-i18n="quick_order_delivery_1_week">ภายใน 1 สัปดาห์</option>
        <option value="custom-date" data-i18n="quick_order_delivery_custom_date">ระบุวันที่เอง</option>
      </select>
      <p id="quick-order-delivery-need-error" class="quick-order-error hidden"></p>
    </div>

    <div id="quick-order-delivery-date-wrap" class="hidden md:col-span-2">
      <label for="quick-order-delivery-date" class="quick-order-label" data-i18n="quick_order_delivery_date_label">วันที่ต้องการรับ</label>
      <input id="quick-order-delivery-date" name="deliveryDate" type="date" class="quick-order-input">
      <p id="quick-order-delivery-date-error" class="quick-order-error hidden"></p>
    </div>
  </div>

  <p id="quick-order-form-summary-error" class="quick-order-error mt-4 hidden"></p>
</form>
```

Load helper before `main.js`:

```html
<script src="assets/js/core/quick-order.js"></script>
<script src="assets/js/core/main.js"></script>
```

Add to `assets/js/i18n/translations.js` under both `th` and `en`:

```js
quick_order_product_label: "สินค้า",
quick_order_custom_product_label: "รายละเอียดสินค้าเพิ่มเติม",
quick_order_custom_product_placeholder: "เช่น ชุดของฝากสำหรับผู้ใหญ่ 3 ชุด",
quick_order_quantity_label: "จำนวน",
quick_order_budget_range_label: "ช่วงงบประมาณ",
quick_order_budget_value_label: "งบที่ต้องการระบุ",
quick_order_budget_value_placeholder: "เช่น 900",
quick_order_delivery_need_label: "ช่วงเวลาที่ต้องการรับ",
quick_order_delivery_date_label: "วันที่ต้องการรับ",
quick_order_select_placeholder: "เลือกข้อมูล",
quick_order_budget_under_500: "ต่ำกว่า 500 บาท",
quick_order_budget_500_1000: "500-1,000 บาท",
quick_order_budget_1000_2000: "1,000-2,000 บาท",
quick_order_budget_over_2000: "มากกว่า 2,000 บาท",
quick_order_delivery_urgent: "ด่วนที่สุด",
quick_order_delivery_2_3_days: "ภายใน 2-3 วัน",
quick_order_delivery_1_week: "ภายใน 1 สัปดาห์",
quick_order_delivery_custom_date: "ระบุวันที่เอง",
quick_order_submit: "ส่งรายละเอียดไปทาง LINE",
quick_order_summary_error: "กรุณาตรวจสอบข้อมูลที่ยังไม่ครบก่อนส่ง",
quick_order_message_greeting: "สวัสดีค่ะ สนใจสั่งซื้อสินค้า",
quick_order_message_product: "สินค้า",
quick_order_message_custom_product: "รายละเอียดเพิ่มเติม",
quick_order_message_quantity: "จำนวน",
quick_order_message_budget_range: "ช่วงงบ",
quick_order_message_budget_value: "งบประมาณเพิ่มเติม",
quick_order_message_delivery_need: "ต้องการรับ",
quick_order_message_closing: "รบกวนช่วยแนะนำรายการและรอบส่งที่เหมาะสมให้ด้วยค่ะ"
```

Add to `assets/css/base/main.css`:

```css
.quick-order-shell {
  margin-top: 2rem;
  border: 1px solid rgba(231, 216, 194, 0.28);
  border-radius: 1.75rem;
  background: rgba(255, 253, 248, 0.08);
  padding: 1.25rem;
  backdrop-filter: blur(10px);
}

.quick-order-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-ivory);
  font-size: 0.875rem;
  font-weight: 700;
}

.quick-order-input {
  width: 100%;
  min-height: 3rem;
  border: 1px solid rgba(231, 216, 194, 0.35);
  border-radius: 9999px;
  background: rgba(255, 253, 248, 0.96);
  color: var(--color-charcoal);
  padding: 0.8rem 1rem;
}

.quick-order-input:focus {
  outline: 2px solid rgba(201, 164, 92, 0.6);
  outline-offset: 2px;
  border-color: rgba(201, 164, 92, 0.8);
}

.quick-order-error {
  color: #FDE68A;
  font-size: 0.75rem;
  line-height: 1.5;
}

.quick-order-input.is-invalid {
  border-color: #F59E0B;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
# tests 4
# pass 4
# fail 0
```

- [ ] **Step 5: Commit**

```powershell
git add .\index.html .\assets\js\i18n\translations.js .\assets\css\base\main.css .\assets\js\core\quick-order.js .\tests\quick-order.test.cjs
git commit -m "feat: add quick order form structure and translations"
```

### Task 3: Wire the Form Into the Existing Page Flow

**Files:**
- Modify: `assets/js/core/main.js`
- Modify: `index.html`
- Test: `tests/quick-order.test.cjs`

- [ ] **Step 1: Write the failing test for date formatting and message composition**

```js
test("formatDeliveryDate returns a readable date for TH and EN", () => {
  assert.equal(
    quickOrder.formatDeliveryDate("2026-07-15", "th"),
    "15 กรกฎาคม 2026"
  );
  assert.equal(
    quickOrder.formatDeliveryDate("2026-07-15", "en"),
    "July 15, 2026"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
TypeError: quickOrder.formatDeliveryDate is not a function
```

- [ ] **Step 3: Implement the page wiring in `main.js` and complete helper support**

Update `assets/js/core/quick-order.js`:

```js
function formatDeliveryDate(value, lang) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

return {
  sanitizeText,
  validateQuickOrder,
  buildLineMessage,
  buildLineUrl,
  formatDeliveryDate
};
```

Add to `index.html` inside the form, replacing the old final CTA button block with a form-specific CTA:

```html
<div class="pt-5 flex flex-col items-center gap-4">
  <button id="quick-order-submit" type="submit" form="quick-order-form"
    class="inline-flex w-full max-w-xl items-center justify-center rounded-full bg-gold text-leaf px-10 py-4 text-base font-bold shadow-lg hover:bg-white transition-all hover-scale border border-gold"
    data-i18n="quick_order_submit">
    ส่งรายละเอียดไปทาง LINE
  </button>
  <p class="text-sm text-ivory/75">
    <span data-i18n="final_cta_call_prefix">ต้องการสอบถามเพิ่มเติม โทร</span> 092-276-9055
  </p>
</div>
```

Add to `assets/js/core/main.js`:

```js
function getQuickOrderProductOptions() {
  const products = getLocalizedContent("products")
    .filter((product) => product.id !== "corporate-gift-box")
    .map((product) => ({ value: product.id, label: product.name }));

  products.push({
    value: "other",
    label: typeof window.getTextTranslation === "function"
      ? window.getTextTranslation(getCurrentLang(), "quick_order_product_other")
      : "อื่นๆ"
  });

  return products;
}

function renderQuickOrderProductOptions() {
  const select = document.getElementById("quick-order-product");
  if (!select) return;

  const placeholder = typeof window.getTextTranslation === "function"
    ? window.getTextTranslation(getCurrentLang(), "quick_order_select_placeholder")
    : "เลือกข้อมูล";
  const selectedValue = select.value;

  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.appendChild(placeholderOption);

  getQuickOrderProductOptions().forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    if (option.value === selectedValue) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });
}

function initQuickOrderForm() {
  const form = document.getElementById("quick-order-form");
  const quickOrder = window.PremiumKhaoMaoQuickOrder;
  if (!form || !quickOrder) return;

  const productSelect = document.getElementById("quick-order-product");
  const customProductWrap = document.getElementById("quick-order-custom-product-wrap");
  const deliveryNeedSelect = document.getElementById("quick-order-delivery-need");
  const deliveryDateWrap = document.getElementById("quick-order-delivery-date-wrap");
  const deliveryDateInput = document.getElementById("quick-order-delivery-date");
  const summaryError = document.getElementById("quick-order-form-summary-error");

  const syncConditionalFields = () => {
    const showCustomProduct = productSelect.value === "other";
    customProductWrap.classList.toggle("hidden", !showCustomProduct);

    const showDeliveryDate = deliveryNeedSelect.value === "custom-date";
    deliveryDateWrap.classList.toggle("hidden", !showDeliveryDate);
    if (!showDeliveryDate) {
      deliveryDateInput.value = "";
    }
  };

  const clearErrors = () => {
    form.querySelectorAll(".quick-order-error").forEach((el) => {
      el.textContent = "";
      el.classList.add("hidden");
    });
    form.querySelectorAll(".quick-order-input").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  };

  const showErrors = (errors) => {
    Object.entries(errors).forEach(([field, message]) => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorEl = document.getElementById(`quick-order-${field.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}-error`);
      if (input) input.classList.add("is-invalid");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
      }
    });
  };

  productSelect.addEventListener("change", syncConditionalFields);
  deliveryNeedSelect.addEventListener("change", syncConditionalFields);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const lang = getCurrentLang();
    const formData = new FormData(form);
    const values = {
      product: String(formData.get("product") || ""),
      customProduct: String(formData.get("customProduct") || ""),
      quantity: String(formData.get("quantity") || ""),
      budgetRange: String(formData.get("budgetRange") || ""),
      budgetValue: String(formData.get("budgetValue") || ""),
      deliveryNeed: String(formData.get("deliveryNeed") || ""),
      deliveryDate: String(formData.get("deliveryDate") || "")
    };

    const validation = quickOrder.validateQuickOrder(values, {
      today: new Date().toISOString().slice(0, 10),
      fieldNames: {
        product: window.getTextTranslation(lang, "quick_order_product_label"),
        customProduct: window.getTextTranslation(lang, "quick_order_custom_product_label"),
        budgetRange: window.getTextTranslation(lang, "quick_order_budget_range_label")
      }
    });

    if (!validation.isValid) {
      showErrors(validation.errors);
      summaryError.textContent = window.getTextTranslation(lang, "quick_order_summary_error");
      summaryError.classList.remove("hidden");
      trackEvent("quick_order_validation_error", { fields: Object.keys(validation.errors).join(",") });
      return;
    }

    const productLabel = productSelect.options[productSelect.selectedIndex]?.textContent || "";
    const quantityLabel = form.querySelector(`#quick-order-quantity option[value="${values.quantity}"]`)?.textContent || values.quantity;
    const budgetRangeLabel = form.querySelector(`#quick-order-budget-range option[value="${values.budgetRange}"]`)?.textContent || "";
    const deliveryNeedLabel = form.querySelector(`#quick-order-delivery-need option[value="${values.deliveryNeed}"]`)?.textContent || "";
    const deliveryDateLabel = quickOrder.formatDeliveryDate(values.deliveryDate, lang);

    const message = quickOrder.buildLineMessage({
      greeting: window.getTextTranslation(lang, "quick_order_message_greeting"),
      budgetValueSuffix: lang === "en" ? " THB" : " บาท",
      labels: {
        product: window.getTextTranslation(lang, "quick_order_message_product"),
        customProduct: window.getTextTranslation(lang, "quick_order_message_custom_product"),
        quantity: window.getTextTranslation(lang, "quick_order_message_quantity"),
        budgetRange: window.getTextTranslation(lang, "quick_order_message_budget_range"),
        budgetValue: window.getTextTranslation(lang, "quick_order_message_budget_value"),
        deliveryNeed: window.getTextTranslation(lang, "quick_order_message_delivery_need"),
        closing: window.getTextTranslation(lang, "quick_order_message_closing")
      },
      values: {
        productLabel,
        customProduct: values.customProduct,
        quantityLabel,
        budgetRangeLabel,
        budgetValue: values.budgetValue,
        deliveryNeedLabel,
        deliveryNeedValue: values.deliveryNeed,
        deliveryDateLabel
      }
    });

    const lineUrl = quickOrder.buildLineUrl("https://line.me/ti/p/~peeradet22", message);
    trackEvent("click_line_cta", { section: "quick_order_form" });
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  });

  renderQuickOrderProductOptions();
  syncConditionalFields();
}
```

Also add near the bottom of `assets/js/core/main.js`:

```js
document.addEventListener("DOMContentLoaded", () => {
  initQuickOrderForm();
});

window.addEventListener("languagechange", () => {
  renderQuickOrderProductOptions();
});
```

Expose translation helper in `assets/js/i18n/translations.js`:

```js
window.getTextTranslation = getTextTranslation;
```

- [ ] **Step 4: Run automated and manual verification**

Run:

```powershell
node --test .\tests\quick-order.test.cjs
```

Expected:

```text
# tests 5
# pass 5
# fail 0
```

Manual verification:

```powershell
git diff -- .\index.html .\assets\js\core\main.js .\assets\js\core\quick-order.js .\assets\js\i18n\translations.js .\assets\css\base\main.css .\tests\quick-order.test.cjs
```

Expected:

```text
Shows quick-order markup, helper module, translations, styles, and DOM wiring only
```

- [ ] **Step 5: Commit**

```powershell
git add .\index.html .\assets\js\core\main.js .\assets\js\core\quick-order.js .\assets\js\i18n\translations.js .\assets\css\base\main.css .\tests\quick-order.test.cjs
git commit -m "feat: wire quick order form to line"
```

## Spec Coverage Check

- ฟอร์มอยู่ใน `Final CTA`: Task 2 และ Task 3
- เลือกสินค้าจากรายการในเว็บ + `อื่นๆ`: Task 2 และ Task 3
- จำนวน / ช่วงงบ / งบที่กรอกเอง: Task 2 และ Task 3
- ช่วงเวลารับ + วันที่ระบุเอง: Task 2 และ Task 3
- validate ข้อมูลจำเป็นและห้ามวันที่ย้อนหลัง: Task 1 และ Task 3
- เปิด LINE พร้อมข้อความที่ประกอบอัตโนมัติ: Task 1 และ Task 3
- รองรับ TH/EN: Task 2 และ Task 3
- ไม่เพิ่ม backend: ทั้งแผนใช้ front-end only

## Placeholder Scan

- ไม่มี `TODO`, `TBD`, หรือคำสั่งกว้างๆ ที่ไม่ระบุโค้ด
- ทุก task มี path, คำสั่ง, และ code snippet ที่ลงมือได้ทันที

## Type Consistency Check

- ใช้ชื่อ field เดียวกันตลอด: `product`, `customProduct`, `quantity`, `budgetRange`, `budgetValue`, `deliveryNeed`, `deliveryDate`
- helper global เดียวตลอด: `window.PremiumKhaoMaoQuickOrder`
- translation helper เดียวตลอด: `window.getTextTranslation`
