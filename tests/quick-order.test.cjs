const test = require("node:test");
const assert = require("node:assert/strict");

const quickOrder = require("../assets/js/core/quick-order.js");

test("buildLineMessage includes custom product details and explicit delivery date", () => {
  const message = quickOrder.buildLineMessage({
    greeting: "สวัสดีค่ะ สนใจสั่งซื้อสินค้า",
    budgetValueSuffix: " บาท",
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
      deliveryNeedValue: "custom-date",
      deliveryNeedLabel: "ระบุวันที่เอง",
      deliveryDateLabel: "15 กรกฎาคม 2026"
    }
  });

  assert.match(message, /รายละเอียดเพิ่มเติม: ข้าวเม่าจัดเซ็ตสำหรับงานไหว้ผู้ใหญ่/);
  assert.match(message, /ต้องการรับ: 15 กรกฎาคม 2026/);
  assert.match(message, /งบประมาณเพิ่มเติม: 900 บาท/);
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

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, {
    customProduct: "กรุณาระบุรายละเอียดสินค้าเพิ่มเติม",
    quantity: "กรุณาเลือกจำนวนอย่างน้อย 1",
    budgetRange: "กรุณาเลือกช่วงงบประมาณ",
    deliveryDate: "กรุณาเลือกวันที่ที่ไม่ย้อนหลัง"
  });
});

test("validateQuickOrder requires product when it is empty", () => {
  const result = quickOrder.validateQuickOrder(
    {
      product: "",
      customProduct: "",
      quantity: "1",
      budgetRange: "basic",
      deliveryNeed: "standard",
      deliveryDate: ""
    },
    {
      fieldNames: {
        product: "สินค้า"
      }
    }
  );

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, {
    product: "กรุณาเลือกสินค้า"
  });
});

test("validateQuickOrder supports localized English validation messages", () => {
  const result = quickOrder.validateQuickOrder(
    {
      product: "",
      customProduct: "",
      quantity: "0",
      budgetRange: "",
      deliveryNeed: "custom-date",
      deliveryDate: "2026-07-01"
    },
    {
      today: "2026-07-05",
      fieldNames: {
        product: "product",
        customProduct: "product details",
        budgetRange: "budget range"
      },
      messages: {
        selectPrefix: "Please select ",
        specifyPrefix: "Please specify ",
        quantityMin: "Please choose at least 1 item",
        pastDate: "Please choose a date that is not in the past"
      }
    }
  );

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, {
    product: "Please select product",
    quantity: "Please choose at least 1 item",
    budgetRange: "Please select budget range",
    deliveryDate: "Please choose a date that is not in the past"
  });
});

test("validateQuickOrder uses localized specify message for custom product", () => {
  const result = quickOrder.validateQuickOrder(
    {
      product: "other",
      customProduct: " ",
      quantity: "1",
      budgetRange: "1000-2000",
      deliveryNeed: "urgent",
      deliveryDate: ""
    },
    {
      fieldNames: {
        customProduct: "product details"
      },
      messages: {
        specifyPrefix: "Please specify "
      }
    }
  );

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, {
    customProduct: "Please specify product details"
  });
});

test("validateQuickOrder handles nullish input without throwing", () => {
  assert.doesNotThrow(() => {
    const result = quickOrder.validateQuickOrder(null);

    assert.equal(result.isValid, false);
    assert.deepEqual(result.errors, {
      product: "กรุณาเลือกสินค้า",
      quantity: "กรุณาเลือกจำนวนอย่างน้อย 1",
      budgetRange: "กรุณาเลือกช่วงงบประมาณ"
    });
  });
});

test("buildLineMessage uses deliveryNeedValue to choose explicit date", () => {
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
      deliveryNeedValue: "custom-date",
      deliveryNeedLabel: "ภายหลัง",
      deliveryDateLabel: "15 กรกฎาคม 2026"
    }
  });

  assert.match(message, /ต้องการรับ: 15 กรกฎาคม 2026/);
  assert.doesNotMatch(message, /ต้องการรับ: ภายหลัง/);
});

test("buildLineMessage supports English labels without Thai-only assumptions", () => {
  const message = quickOrder.buildLineMessage({
    greeting: "Hello, I would like to place an order",
    budgetValueSuffix: " THB",
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
      budgetValue: "1800",
      deliveryNeedValue: "2-3-days",
      deliveryNeedLabel: "Within 2-3 days",
      deliveryDateLabel: ""
    }
  });

  assert.match(message, /Product: Premium Wooden Gift Set/);
  assert.match(message, /Budget details: 1800 THB/);
  assert.match(message, /Need by: Within 2-3 days/);
  assert.doesNotMatch(message, /บาท/);
});

test("buildLineUrl URL-encodes the final message", () => {
  const url = quickOrder.buildLineUrl("https://line.me/ti/p/~peeradet22", "ทดสอบ 1 2 3");

  assert.equal(
    url,
    "https://line.me/ti/p/~peeradet22?text=%E0%B8%97%E0%B8%94%E0%B8%AA%E0%B8%AD%E0%B8%9A%201%202%203"
  );
});

test("formatDeliveryDate returns a readable date for TH and EN", () => {
  assert.equal(
    quickOrder.formatDeliveryDate("2026-07-15", "th"),
    "15 กรกฎาคม 2569"
  );
  assert.equal(
    quickOrder.formatDeliveryDate("2026-07-15", "en"),
    "July 15, 2026"
  );
});
