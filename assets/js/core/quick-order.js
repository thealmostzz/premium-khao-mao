(function (global, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  global.PremiumKhaoMaoQuickOrder = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const DEFAULT_VALIDATION_MESSAGES = {
    selectPrefix: "กรุณาเลือก",
    specifyPrefix: "กรุณาระบุ",
    quantityMin: "กรุณาเลือกจำนวนอย่างน้อย 1",
    pastDate: "กรุณาเลือกวันที่ที่ไม่ย้อนหลัง"
  };

  const sanitizeText = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .replace(/[<>]/g, "")
      .trim();

  const isPositiveInteger = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0;
  };

  const validateQuickOrder = (formValues, options = {}) => {
    const values = formValues || {};
    const errors = {};
    const fieldNames = options.fieldNames || {};
    const messages = {
      ...DEFAULT_VALIDATION_MESSAGES,
      ...(options.messages || {})
    };
    const today = options.today || new Date().toISOString().slice(0, 10);

    if (!values.product) {
      errors.product = `${messages.selectPrefix}${fieldNames.product || "สินค้า"}`;
    }

    if (values.product === "other" && !sanitizeText(values.customProduct)) {
      errors.customProduct = `${messages.specifyPrefix}${fieldNames.customProduct || "รายละเอียดสินค้าเพิ่มเติม"}`;
    }

    if (!isPositiveInteger(values.quantity)) {
      errors.quantity = messages.quantityMin;
    }

    if (!values.budgetRange) {
      errors.budgetRange = `${messages.selectPrefix}${fieldNames.budgetRange || "ช่วงงบประมาณ"}`;
    }

    if (values.deliveryNeed === "custom-date") {
      if (!values.deliveryDate || values.deliveryDate < today) {
        errors.deliveryDate = messages.pastDate;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const buildLineMessage = (payload) => {
    const { greeting, labels, values } = payload;
    const budgetValueSuffix = payload.budgetValueSuffix || "";
    const resolvedDeliveryLabel = values.deliveryNeedValue === "custom-date"
      ? values.deliveryDateLabel
      : values.deliveryNeedLabel;
    const lines = [
      greeting,
      `- ${labels.product}: ${values.productLabel}`,
      values.customProduct ? `- ${labels.customProduct}: ${sanitizeText(values.customProduct)}` : "",
      `- ${labels.quantity}: ${values.quantityLabel}`,
      `- ${labels.budgetRange}: ${values.budgetRangeLabel}`,
      values.budgetValue ? `- ${labels.budgetValue}: ${values.budgetValue}${budgetValueSuffix}` : "",
      `- ${labels.deliveryNeed}: ${resolvedDeliveryLabel}`,
      labels.closing
    ];

    return lines.filter(Boolean).join("\n");
  };

  const buildLineUrl = (baseUrl, message) => `${baseUrl}?text=${encodeURIComponent(message)}`;

  const formatDeliveryDate = (value, lang = "th") => {
    if (!value) return "";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";

    const locale = lang === "en" ? "en-US" : "th-TH";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  return {
    DEFAULT_VALIDATION_MESSAGES,
    sanitizeText,
    validateQuickOrder,
    buildLineMessage,
    buildLineUrl,
    formatDeliveryDate
  };
});
