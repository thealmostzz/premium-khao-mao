/* -------------------------------------------------------------
 * Premium Khao Mao - Client Interaction & Dynamic Logic
 * ------------------------------------------------------------- */

// --- Dev Mode Flag ---
// เปลี่ยนเป็น false ก่อน deploy ไป production เพื่อซ่อน debug toast
const IS_DEV_MODE = false;
const IMAGE_VERSION = "20260705-2";

// Ensure dataLayer exists so analytics events can queue even before GTM loads
window.dataLayer = window.dataLayer || [];

const LOCALIZED_CONTENT = {
  th: {
    products: [
      {
        id: "khao-mao-kluk",
        name: "ข้าวเม่าคลุกมะพร้าวอ่อนน้ำหอม",
        badge: "Signature",
        description: "ข้าวเม่าหอมระมุน คลุกมะพร้าวอ่อนน้ำหอมขูดเส้นหนานุ่มอย่างพิถีพิถัน รสชาติไทยแท้แบบดั้งเดิม หวานน้อยกลมกล่อม",
        priceText: "เริ่มต้น 120.- / กล่อง",
        image: "khao_mao_kluk",
        ctaText: "สั่งซื้อเมนูนี้"
      },
      {
        id: "khao-mao-tod",
        name: "ข้าวเม่าทอดสูตรชาววังโบราณ",
        badge: "Best Seller",
        description: "กล้วยไข่สุกหวานกำลังดี ห่อหุ้มแป้งข้าวเม่าปรุงสูตรพิเศษ ทอดจนสีเหลืองตองอ่อนกรอบฟู ไม่อมน้ำมัน",
        priceText: "เริ่มต้น 150.- / กล่อง (4 ชิ้น)",
        image: "khao_mao_tod",
        ctaText: "สั่งซื้อเมนูนี้"
      },
      {
        id: "khao-mao-rang",
        name: "ข้าวเม่ารางหอมกรุ่นอบควันเทียน",
        badge: "Traditional",
        description: "ข้าวเม่าคั่วโบราณคัดพิเศษ นำไปอบควันเทียนสูตรลับจนหอมฟุ้ง ทานคู่กับมะพร้าวขูดและน้ำตาลทรายนวลใจ",
        priceText: "เริ่มต้น 135.- / ชุด",
        image: "khao_mao_rang",
        ctaText: "สั่งซื้อเมนูนี้"
      },
      {
        id: "crispy-khao-mao",
        name: "ข้าวเม่าอบกรอบปรุงรสพิเศษ (สูตรคลีน)",
        badge: "New Item",
        description: "ข้าวเม่าคัดอ่อนผ่านกรรมวิธีอบกรอบ 100% ไร้น้ำมัน เหมาะสำหรับคนรักสุขภาพ ทานเล่นเพลินไม่มีเบื่อ",
        priceText: "เริ่มต้น 89.- / ซอง",
        image: "crispy_khao_mao",
        ctaText: "สั่งซื้อเมนูนี้"
      },
      {
        id: "premium-gift-set",
        name: "Premium Wooden Gift Set",
        badge: "Premium Gift",
        description: "ชุดของฝากข้าวเม่าในแพ็กเกจกล่องไม้สักขัดเรียบหรู คาดริบบิ้นทองคำทองทอ พร้อมชาสมุนไพรออร์แกนิกในชุด",
        priceText: "เริ่มต้น 890.- / เซ็ต",
        image: "premium_gift_set",
        ctaText: "ดูชุดของฝาก"
      },
      {
        id: "corporate-gift-box",
        name: "Corporate Premium Gift Box",
        badge: "B2B Special",
        description: "บริการจัดทำเซ็ตของขวัญองค์กร ปริมาณมาก ออกแบบปั๊มฟอยล์โลโก้แบรนด์ของคุณ คลุมโทนโบว์สีสุภาพสากลสำหรับคู่ค้าและพนักงาน",
        priceText: "ราคาพิเศษรายออเดอร์",
        image: "corporate_gift_box",
        ctaText: "ติดต่อสอบถามแพ็กเกจ"
      }
    ],
    reviews: [
      {
        name: "คุณวิภาวรรณ สุขุมวิท",
        role: "ลูกค้าประจำ (สั่งซื้อไปทานคู่ชาบ่าย)",
        stars: 5,
        text: "ประทับใจความหอมละมุนของข้าวเม่าคลุกมะพร้าวอ่อนน้ำหอมมากค่ะ รสสัมผัสเหนียวนุ่ม มีความหอมเป็นเอกลักษณ์เฉพาะตัว ไม่หวานเลี่ยนจนเกินไป ซื้อทานเองและสั่งให้คุณพ่อคุณแม่ทานบ่อยมากค่ะ แพ็กเกจสะอาด เรียบร้อยดีมากค่ะ"
      },
      {
        name: "คุณธนภัทร เลิศวรุตม์",
        role: "ผู้จัดซื้อจัดจ้าง บริษัทอสังหาริมทรัพย์ระดับประเทศ",
        stars: 5,
        text: "ได้ทำการสั่งชุดของฝาก Corporate Premium Gift Set จำนวน 250 ชุด เพื่อแจกพนักงานและคู่ค้าทางธุรกิจในช่วงปีใหม่ ทุกคนชมเป็นเสียงเดียวกันว่าขนมรสชาติประณีตมาก กล่องไม้สลักลายโลโก้แบรนด์ดูแพงและเรียบหรู เหมาะสมกับเป็นของขวัญระดับพรีเมี่ยมอย่างยิ่งครับ"
      },
      {
        name: "คุณกมลวรรณ เด่นไทย",
        role: "ลูกค้าซื้อของฝาก (กทม.)",
        stars: 5,
        text: "ปกติข้าวเม่าจะหาอร่อยและสะอาดได้ยากมากค่ะ แต่ร้านนี้ตำสดใหม่จริงๆ บรรจุภัณฑ์สุญญากาศมาอย่างดี ส่งมาถึงกรุงเทพฯ ข้าวเม่ายังคงความหอมสด สัมผัสนุ่มเด้งเหมือนทานสดที่หน้าร้านเลยค่ะ ยินดีบอกต่อเพื่อนๆ แน่นอนค่ะ"
      }
    ],
    faqs: [
      {
        question: "ข้าวเม่าของทางร้านสามารถเก็บไว้ได้นานกี่วัน?",
        answer: "ข้าวเม่าคลุกสดบรรจุสุญญากาศ เก็บในตู้เย็นช่องปกติได้ประมาณ 3-5 วัน และหากแช่แข็งสามารถเก็บได้นานถึง 1 เดือนค่ะ ส่วนข้าวเม่าอบกรอบเก็บที่อุณหภูมิห้องได้นานประมาณ 3 เดือน เพื่อรสชาติที่ดีที่สุด แนะนำให้รับประทานหลังเปิดแพ็กไม่นาน หากต้องการเลือกเมนูให้เหมาะกับวันที่จะทาน ทัก LINE มาสอบถามได้เลยค่ะ"
      },
      {
        question: "ส่งต่างจังหวัดแล้วยังสดไหม?",
        answer: "ทางร้านจัดส่งแบบควบคุมอุณหภูมิแช่เย็นทั่วประเทศ เพื่อช่วยรักษาความสด กลิ่นหอม และเนื้อสัมผัสของสินค้าให้ถึงมือผู้รับอย่างเหมาะสม ลูกค้าหลายจังหวัดนิยมสั่งเป็นของทานเองและของฝากค่ะ หากต้องการเช็กรอบส่งของวันนี้ สามารถทัก LINE ได้ทันที"
      },
      {
        question: "ต้องทำการสั่งออเดอร์ล่วงหน้าก่อนกี่วัน?",
        answer: "เมนูทั่วไปที่ไม่ใช่ออเดอร์ใหญ่ หากสั่งก่อนเวลาและคิวผลิตยังว่าง มักจัดส่งรอบถัดไปได้ค่ะ ส่วนชุดของฝากพรีเมี่ยมแนะนำสั่งล่วงหน้า 1-2 วัน และออเดอร์องค์กรหรือจำนวนมากแนะนำล่วงหน้า 5-7 วันทำการ เพื่อให้ร้านเตรียมสินค้าและแพ็กเกจได้เรียบร้อยที่สุด"
      },
      {
        question: "เหมาะซื้อเป็นของฝากไหม?",
        answer: "เหมาะมากค่ะ เพราะเป็นขนมไทยโบราณที่ดูมีเรื่องราว มีความประณีต และสามารถเลือกเป็นแบบทานเองหรือแบบชุดของฝากพรีเมี่ยมได้ เหมาะทั้งฝากผู้ใหญ่ คนในครอบครัว ลูกค้า และคู่ค้าทางธุรกิจ หากต้องการให้ช่วยแนะนำชุดที่เหมาะกับงบหรือโอกาสใช้งาน ทัก LINE มาได้เลยค่ะ"
      },
      {
        question: "สั่งซื้อผ่าน LINE ต้องแจ้งอะไรบ้าง?",
        answer: "แจ้งเมนูที่สนใจ จำนวนที่ต้องการ วันที่อยากได้รับสินค้า และจังหวัดปลายทางได้เลยค่ะ หากยังไม่แน่ใจว่าจะเลือกเมนูไหนดี สามารถบอกงบหรือบอกว่าอยากซื้อทานเอง ซื้อฝาก หรือซื้อเป็นของขวัญ ทางร้านจะช่วยแนะนำให้เหมาะที่สุด"
      }
    ]
  },
  en: {
    products: [
      {
        id: "khao-mao-kluk",
        name: "Aromatic Young Coconut Khao Mao",
        badge: "Signature",
        description: "Soft hand-pounded khao mao tossed with fragrant young coconut for a classic Thai flavor that is delicate, mellow, and lightly sweet.",
        priceText: "Starting at THB 120 / box",
        image: "khao_mao_kluk",
        ctaText: "Order This Item"
      },
      {
        id: "khao-mao-tod",
        name: "Royal-Style Fried Khao Mao",
        badge: "Best Seller",
        description: "Sweet ripe bananas wrapped in seasoned khao mao batter and fried until light, crisp, and golden without excess oil.",
        priceText: "Starting at THB 150 / box (4 pieces)",
        image: "khao_mao_tod",
        ctaText: "Order This Item"
      },
      {
        id: "khao-mao-rang",
        name: "Candle-Smoked Roasted Khao Mao",
        badge: "Traditional",
        description: "Premium roasted khao mao gently scented with candle smoke and served with shredded coconut and fine sugar.",
        priceText: "Starting at THB 135 / set",
        image: "khao_mao_rang",
        ctaText: "Order This Item"
      },
      {
        id: "crispy-khao-mao",
        name: "Crispy Seasoned Khao Mao",
        badge: "New Item",
        description: "A clean-label crunchy snack made from tender khao mao, oven-baked without oil for lighter everyday snacking.",
        priceText: "Starting at THB 89 / pack",
        image: "crispy_khao_mao",
        ctaText: "Order This Item"
      },
      {
        id: "premium-gift-set",
        name: "Premium Wooden Gift Set",
        badge: "Premium Gift",
        description: "An elegant teak presentation box filled with signature khao mao and paired with organic herbal tea for refined gifting.",
        priceText: "Starting at THB 890 / set",
        image: "premium_gift_set",
        ctaText: "View Gift Set"
      },
      {
        id: "corporate-gift-box",
        name: "Corporate Premium Gift Box",
        badge: "B2B Special",
        description: "Custom large-volume corporate gift boxes with foil logo finishing, coordinated ribbon colors, and premium presentation for partners and teams.",
        priceText: "Custom quote available",
        image: "corporate_gift_box",
        ctaText: "Request Package Details"
      }
    ],
    reviews: [
      {
        name: "Wipawan Sukhumvit",
        role: "Returning customer",
        stars: 5,
        text: "I love how fragrant and soft the young coconut khao mao is. It feels refined, not overly sweet, and the packaging arrives clean and beautifully prepared every time."
      },
      {
        name: "Thanapat Lertwarut",
        role: "Corporate procurement manager",
        stars: 5,
        text: "We ordered 250 corporate premium gift sets for New Year gifting. The team loved the craftsmanship, and the engraved wooden box looked elegant and premium."
      },
      {
        name: "Kamonwan Denthai",
        role: "Gift buyer in Bangkok",
        stars: 5,
        text: "It is hard to find khao mao that is both delicious and hygienic, but this shop delivers exactly that. It arrived in Bangkok fresh, aromatic, and pleasantly soft."
      }
    ],
    faqs: [
      {
        question: "How long can your khao mao be stored?",
        answer: "Fresh mixed khao mao is vacuum-packed and keeps for about 3 to 5 days in the refrigerator, or up to 1 month in the freezer. Crispy khao mao can be stored at room temperature for around 3 months. For the best taste and texture, we recommend enjoying it soon after opening. If you want help choosing a menu for your preferred serving date, feel free to message us on LINE."
      },
      {
        question: "Will the product stay fresh for out-of-province delivery?",
        answer: "Yes. We ship nationwide with chilled temperature-controlled delivery to help preserve freshness, aroma, and texture until the order reaches the recipient. Many customers in other provinces order both for themselves and as gifts. If you would like to check today's shipping round, you can contact us on LINE anytime."
      },
      {
        question: "How many days in advance should I place an order?",
        answer: "For regular menu items, if you order within business hours and the production queue is still available, we can usually ship in the next round. Premium gift sets are best ordered 1 to 2 days ahead, while corporate or large-volume orders should be placed 5 to 7 business days in advance so we can prepare both the products and packaging properly."
      },
      {
        question: "Is it suitable as a gift?",
        answer: "Very much so. Our khao mao is a refined traditional Thai dessert with a strong sense of story and craftsmanship. You can choose from everyday treats or premium gift sets, making it suitable for elders, family, clients, and business partners. If you would like help choosing a set for your budget or occasion, message us on LINE and we will gladly recommend one."
      },
      {
        question: "What should I send when ordering through LINE?",
        answer: "You can send us the menu items you are interested in, the quantity, your preferred delivery date, and the destination province. If you are unsure what to choose, simply tell us your budget or whether the order is for personal enjoyment, gifting, or a special present, and we will help recommend the best option."
      }
    ]
  }
};

function getCurrentLang() {
  return typeof window.getCurrentLanguage === "function" ? window.getCurrentLanguage() : "th";
}

function getLocalizedContent(key) {
  const lang = getCurrentLang();
  return LOCALIZED_CONTENT[lang]?.[key] ?? LOCALIZED_CONTENT.th[key];
}

let revealObserver;

function bindRevealAnimations(root = document) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
  }

  const reveals = root.querySelectorAll(".reveal:not(.active)");
  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderReviews();
  renderFAQs();
  initQuickOrderForm();
  initMobileMenu();
  initScrollEffects();
  initReviewsCarousel();
});

window.addEventListener("languagechange", () => {
  currentSlide = 0;
  renderProducts();
  renderReviews();
  renderFAQs();
  renderQuickOrderProductOptions();
  syncQuickOrderConditionalFields();
  bindRevealAnimations(document.getElementById("faq"));
});

// --- Dynamic Rendering with Strict XSS Protection ---
function renderProducts() {
  const container = document.getElementById("product-grid");
  if (!container) return;
  const products = getLocalizedContent("products");

  container.innerHTML = ""; // Clear existing placeholder content safely

  products.forEach(product => {
    // Generate secure elements without innerHTML string interpolation from parameters
    const card = document.createElement("div");
    card.className = "card-hover-zoom rounded-2xl border border-beige bg-ivory p-6 shadow-sm flex flex-col justify-between premium-gold-border";

    // Header Content of Card (Badge & Title)
    const headerDiv = document.createElement("div");
    
    // Image placeholder area with descriptive alt text
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "w-full h-48 mb-4 bg-[#F1E9DC] rounded-xl overflow-hidden relative flex items-center justify-center border border-beige";
    
    // Product image from assets
    const productImg = document.createElement("img");
    productImg.src = `assets/images/${product.image}.jpg?v=${IMAGE_VERSION}`;
    productImg.alt = product.name;
    productImg.className = "w-full h-full object-cover";
    productImg.loading = "lazy";

    // Fallback to placeholder SVG if image fails to load
    productImg.onerror = function() {
      this.style.display = "none";
      const fallback = document.createElement("div");
      fallback.className = "text-center p-4";

      // Render a static SVG only; set product name via textContent to avoid XSS injection.
      fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-riceBrown" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M17.636 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>`;

      const nameSpan = document.createElement("span");
      nameSpan.className = "text-xs font-semibold text-riceBrown tracking-wider uppercase block mt-2";
      nameSpan.textContent = product.name;
      fallback.appendChild(nameSpan);
      imgWrapper.appendChild(fallback);
    };

    imgWrapper.appendChild(productImg);
    card.appendChild(imgWrapper);

    if (product.badge) {
      const badgeSpan = document.createElement("span");
      badgeSpan.className = "inline-block px-3 py-1 text-xs font-semibold text-leaf bg-[#DCE6DE] rounded-full mb-3";
      badgeSpan.textContent = product.badge;
      headerDiv.appendChild(badgeSpan);
    }

    const title = document.createElement("h3");
    title.className = "text-xl font-bold text-charcoal mb-2 font-serifThai";
    title.textContent = product.name;
    headerDiv.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "text-riceBrown text-sm mb-4 leading-relaxed line-clamp-3";
    desc.textContent = product.description;
    headerDiv.appendChild(desc);

    card.appendChild(headerDiv);

    // Footer Content of Card (Price & CTA Button)
    const footerDiv = document.createElement("div");
    footerDiv.className = "mt-4 pt-4 border-t border-beige flex items-center justify-between";

    const price = document.createElement("span");
    price.className = "text-leaf font-bold text-base";
    price.textContent = product.priceText;
    footerDiv.appendChild(price);

    const ctaBtn = document.createElement("button");
    ctaBtn.className = "rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white hover:bg-charcoal transition-colors focus:ring-2 focus:ring-leaf focus:ring-offset-2 focus:outline-none";
    ctaBtn.textContent = product.ctaText;
    
    // Safe tracking bindings
    ctaBtn.addEventListener("click", () => {
      trackEvent("click_product_cta", { product_id: product.id, product_name: product.name });
      // Redirect to LINE (simulated)
      window.open("https://line.me/ti/p/~peeradet22", "_blank", "noopener,noreferrer");
    });
    
    footerDiv.appendChild(ctaBtn);
    card.appendChild(footerDiv);

    container.appendChild(card);
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;
  const reviews = getLocalizedContent("reviews");

  container.innerHTML = "";

  reviews.forEach((review, index) => {
    const slide = document.createElement("div");
    slide.className = `min-w-full px-4 transition-opacity duration-500 ease-in-out ${index === 0 ? 'block' : 'hidden'}`;
    slide.setAttribute("data-slide-index", index);

    const card = document.createElement("div");
    card.className = "bg-ivory border border-beige p-6 md:p-8 rounded-2xl shadow-sm text-center max-w-3xl mx-auto premium-gold-border";

    // Star ratings
    const starsDiv = document.createElement("div");
    starsDiv.className = "flex justify-center text-gold mb-4 space-x-1";
    for (let i = 0; i < review.stars; i++) {
      starsDiv.innerHTML += `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      `;
    }
    card.appendChild(starsDiv);

    // Review Text
    const reviewText = document.createElement("p");
    reviewText.className = "text-charcoal italic text-base md:text-lg mb-6 leading-relaxed font-medium";
    reviewText.textContent = `“ ${review.text} ”`;
    card.appendChild(reviewText);

    // Divider line
    const divider = document.createElement("div");
    divider.className = "w-16 h-0.5 bg-beige mx-auto mb-4";
    card.appendChild(divider);

    // Reviewer Name
    const reviewerName = document.createElement("h4");
    reviewerName.className = "text-leaf font-bold text-lg font-serifThai";
    reviewerName.textContent = review.name;
    card.appendChild(reviewerName);

    // Reviewer Role
    const reviewerRole = document.createElement("span");
    reviewerRole.className = "text-riceBrown text-xs tracking-wider uppercase block mt-1";
    reviewerRole.textContent = review.role;
    card.appendChild(reviewerRole);

    slide.appendChild(card);
    container.appendChild(slide);
  });
}

function renderFAQs() {
  const container = document.getElementById("faq-accordion");
  if (!container) return;
  const faqs = getLocalizedContent("faqs");

  container.innerHTML = "";

  faqs.forEach((faq, index) => {
    const item = document.createElement("div");
    item.className = "border-b border-beige py-4 reveal";

    // Trigger button for accordion
    const button = document.createElement("button");
    button.className = "w-full py-3 flex justify-between items-center text-left focus:outline-none focus:text-leaf group";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `faq-answer-${index}`);

    const questionSpan = document.createElement("span");
    questionSpan.className = "text-base md:text-lg font-bold text-charcoal font-serifThai group-hover:text-leaf transition-colors";
    questionSpan.textContent = faq.question;
    button.appendChild(questionSpan);

    // Chevron SVG Icon
    const chevronSpan = document.createElement("span");
    chevronSpan.className = "accordion-chevron ml-4 text-riceBrown shrink-0";
    chevronSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    `;
    button.appendChild(chevronSpan);
    item.appendChild(button);

    // Answer container
    const answerDiv = document.createElement("div");
    answerDiv.id = `faq-answer-${index}`;
    answerDiv.className = "accordion-content";
    answerDiv.setAttribute("role", "region");

    const answerContent = document.createElement("p");
    answerContent.className = "pb-4 text-riceBrown text-sm md:text-base leading-relaxed pl-1 pr-6";
    answerContent.textContent = faq.answer;
    
    answerDiv.appendChild(answerContent);
    item.appendChild(answerDiv);

    // Add toggle event listener
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      
      // Close all other accordions first (Single accordion behavior)
      const allButtons = container.querySelectorAll("button");
      allButtons.forEach(btn => {
        btn.setAttribute("aria-expanded", "false");
        btn.parentElement.classList.remove("accordion-active");
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        item.classList.add("accordion-active");
        trackEvent("faq_open", { question: faq.question });
      }
    });

    container.appendChild(item);
  });

  bindRevealAnimations(container);
}

const QUICK_ORDER_LINE_URL = "https://line.me/ti/p/~peeradet22";
const QUICK_ORDER_ERROR_FIELD_IDS = {
  product: "quick-order-product-error",
  customProduct: "quick-order-custom-product-error",
  quantity: "quick-order-quantity-error",
  budgetRange: "quick-order-budget-range-error",
  deliveryNeed: "quick-order-delivery-need-error",
  deliveryDate: "quick-order-delivery-date-error"
};

let quickOrderVisibilitySync = null;

function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getQuickOrderTranslation(key) {
  if (typeof window.getTextTranslation === "function") {
    return window.getTextTranslation(getCurrentLang(), key);
  }
  return "";
}

function getQuickOrderProductOptions() {
  const products = getLocalizedContent("products")
    .filter((product) => product.id !== "corporate-gift-box")
    .map((product) => ({
      value: product.id,
      label: product.name
    }));

  products.push({
    value: "other",
    label: getQuickOrderTranslation("quick_order_product_other") || "อื่นๆ"
  });

  return products;
}

function renderQuickOrderProductOptions() {
  const productSelect = document.getElementById("quick-order-product");
  if (!productSelect) return;

  const selectedValue = productSelect.value;
  const placeholder = getQuickOrderTranslation("quick_order_select_placeholder") || "เลือกข้อมูล";

  productSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  productSelect.appendChild(placeholderOption);

  getQuickOrderProductOptions().forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    optionEl.selected = option.value === selectedValue;
    productSelect.appendChild(optionEl);
  });
}

function formatQuickOrderQuantityLabel(value, lang) {
  if (!value) return "";
  if (lang === "en") {
    return value === "1" ? "1 item" : `${value} items`;
  }
  return `${value} กล่อง`;
}

function getQuickOrderValidationConfig() {
  return {
    fieldNames: {
      product: getQuickOrderTranslation("quick_order_product_label") || "สินค้า",
      customProduct: getQuickOrderTranslation("quick_order_custom_product_label") || "รายละเอียดสินค้าเพิ่มเติม",
      budgetRange: getQuickOrderTranslation("quick_order_budget_range_label") || "ช่วงงบประมาณ"
    },
    messages: {
      selectPrefix: getQuickOrderTranslation("quick_order_error_select_prefix") || "กรุณาเลือก",
      specifyPrefix: getQuickOrderTranslation("quick_order_error_specify_prefix") || "กรุณาระบุ",
      quantityMin: getQuickOrderTranslation("quick_order_error_quantity_min") || "กรุณาเลือกจำนวนอย่างน้อย 1",
      pastDate: getQuickOrderTranslation("quick_order_error_past_date") || "กรุณาเลือกวันที่ที่ไม่ย้อนหลัง"
    }
  };
}

function clearQuickOrderErrors(form) {
  form.querySelectorAll(".quick-order-error").forEach((errorEl) => {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  });

  form.querySelectorAll(".quick-order-input").forEach((input) => {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
  });
}

function showQuickOrderErrors(form, errors) {
  Object.entries(errors).forEach(([fieldName, message]) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    const errorId = QUICK_ORDER_ERROR_FIELD_IDS[fieldName];
    const errorEl = errorId ? document.getElementById(errorId) : null;

    if (input) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
  });
}

function syncQuickOrderConditionalFields() {
  if (typeof quickOrderVisibilitySync === "function") {
    quickOrderVisibilitySync();
  }
}

function initQuickOrderForm() {
  const form = document.getElementById("quick-order-form");
  const quickOrder = window.PremiumKhaoMaoQuickOrder;
  if (!form || !quickOrder) return;

  const productSelect = document.getElementById("quick-order-product");
  const customProductWrap = document.getElementById("quick-order-custom-product-wrap");
  const customProductInput = document.getElementById("quick-order-custom-product");
  const quantitySelect = document.getElementById("quick-order-quantity");
  const budgetRangeSelect = document.getElementById("quick-order-budget-range");
  const budgetValueInput = document.getElementById("quick-order-budget-value");
  const deliveryNeedSelect = document.getElementById("quick-order-delivery-need");
  const deliveryDateWrap = document.getElementById("quick-order-delivery-date-wrap");
  const deliveryDateInput = document.getElementById("quick-order-delivery-date");
  const summaryError = document.getElementById("quick-order-form-summary-error");

  if (!productSelect || !customProductWrap || !customProductInput || !quantitySelect || !budgetRangeSelect ||
      !budgetValueInput || !deliveryNeedSelect || !deliveryDateWrap || !deliveryDateInput || !summaryError) {
    return;
  }

  const syncVisibility = () => {
    const showCustomProduct = productSelect.value === "other";
    customProductWrap.classList.toggle("hidden", !showCustomProduct);
    customProductInput.toggleAttribute("disabled", !showCustomProduct);

    const showDeliveryDate = deliveryNeedSelect.value === "custom-date";
    deliveryDateWrap.classList.toggle("hidden", !showDeliveryDate);
    deliveryDateInput.toggleAttribute("disabled", !showDeliveryDate);

    if (!showCustomProduct) {
      customProductInput.value = "";
    }

    if (!showDeliveryDate) {
      deliveryDateInput.value = "";
    }
  };

  quickOrderVisibilitySync = syncVisibility;

  renderQuickOrderProductOptions();
  deliveryDateInput.min = getTodayIsoDate();
  syncVisibility();

  productSelect.addEventListener("change", syncVisibility);
  deliveryNeedSelect.addEventListener("change", syncVisibility);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearQuickOrderErrors(form);

    const lang = getCurrentLang();
    const validationConfig = getQuickOrderValidationConfig();
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
      today: getTodayIsoDate(),
      fieldNames: validationConfig.fieldNames,
      messages: validationConfig.messages
    });

    if (!validation.isValid) {
      showQuickOrderErrors(form, validation.errors);
      summaryError.textContent = getQuickOrderTranslation("quick_order_summary_error") || "กรุณาตรวจสอบข้อมูลที่ยังไม่ครบก่อนส่ง";
      summaryError.classList.remove("hidden");
      trackEvent("quick_order_validation_error", {
        fields: Object.keys(validation.errors).join(","),
        language: lang
      });
      return;
    }

    const productLabel = productSelect.options[productSelect.selectedIndex]?.textContent || "";
    const budgetRangeLabel = budgetRangeSelect.options[budgetRangeSelect.selectedIndex]?.textContent || "";
    const deliveryNeedLabel = deliveryNeedSelect.options[deliveryNeedSelect.selectedIndex]?.textContent || "";
    const deliveryDateLabel = quickOrder.formatDeliveryDate(values.deliveryDate, lang);
    const message = quickOrder.buildLineMessage({
      greeting: getQuickOrderTranslation("quick_order_message_greeting"),
      budgetValueSuffix: lang === "en" ? " THB" : " บาท",
      labels: {
        product: getQuickOrderTranslation("quick_order_message_product"),
        customProduct: getQuickOrderTranslation("quick_order_message_custom_product"),
        quantity: getQuickOrderTranslation("quick_order_message_quantity"),
        budgetRange: getQuickOrderTranslation("quick_order_message_budget_range"),
        budgetValue: getQuickOrderTranslation("quick_order_message_budget_value"),
        deliveryNeed: getQuickOrderTranslation("quick_order_message_delivery_need"),
        closing: getQuickOrderTranslation("quick_order_message_closing")
      },
      values: {
        productLabel,
        customProduct: values.customProduct,
        quantityLabel: formatQuickOrderQuantityLabel(values.quantity, lang),
        budgetRangeLabel,
        budgetValue: values.budgetValue,
        deliveryNeedValue: values.deliveryNeed,
        deliveryNeedLabel,
        deliveryDateLabel
      }
    });

    const lineUrl = quickOrder.buildLineUrl(QUICK_ORDER_LINE_URL, message);
    trackEvent("click_line_cta", { section: "quick_order_form" });
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  });
}

// --- Mobile Hamburger Menu ---
function initMobileMenu() {
  const burgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener("click", () => {
    const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
    burgerBtn.setAttribute("aria-expanded", !isExpanded);
    mobileMenu.classList.toggle("hidden");
    
    // Toggle simple body scroll locking
    if (!isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      burgerBtn.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    });
  });
}

// --- Animate On Scroll (AOS) & Sticky CTA ---
function initScrollEffects() {
  const stickyCta = document.getElementById("sticky-line-cta");
  const backToTopBtn = document.getElementById("back-to-top");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll("nav a"));

  bindRevealAnimations();

  const handleScroll = () => {
    // Show/Hide Mobile Sticky CTA (After scrolling down 400px)
    const isPastFold = window.scrollY > 400;

    if (isPastFold) {
      if (stickyCta) stickyCta.classList.add("visible");
    } else {
      if (stickyCta) stickyCta.classList.remove("visible");
    }

    if (backToTopBtn) {
      if (isPastFold) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
        backToTopBtn.classList.add("opacity-100");
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none");
        backToTopBtn.classList.remove("opacity-100");
      }
    }

    // Scroll active link highlight logic
    let currentSectionId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Margin adjustment for sticky header
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("text-leaf", "font-bold");
      const hrefAttr = link.getAttribute("href");
      if (hrefAttr && hrefAttr === `#${currentSectionId}`) {
        link.classList.add("text-leaf", "font-bold");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// --- Customer Reviews Slider Logic ---
let currentSlide = 0;
function initReviewsCarousel() {
  const prevBtn = document.getElementById("review-prev");
  const nextBtn = document.getElementById("review-next");
  const container = document.getElementById("reviews-container");

  if (!container || !prevBtn || !nextBtn) return;

  const updateSlidesVisibility = () => {
    const slides = container.querySelectorAll("[data-slide-index]");
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.remove("hidden");
        slide.classList.add("block");
      } else {
        slide.classList.remove("block");
        slide.classList.add("hidden");
      }
    });
  };

  prevBtn.addEventListener("click", () => {
    const totalReviews = getLocalizedContent("reviews").length;
    currentSlide = (currentSlide - 1 + totalReviews) % totalReviews;
    updateSlidesVisibility();
    trackEvent("scroll_section", { carousel_action: "prev_review" });
  });

  nextBtn.addEventListener("click", () => {
    const totalReviews = getLocalizedContent("reviews").length;
    currentSlide = (currentSlide + 1) % totalReviews;
    updateSlidesVisibility();
    trackEvent("scroll_section", { carousel_action: "next_review" });
  });
}

// --- Secure Analytics Event Tracker & Debug Toast ---
function trackEvent(eventName, eventParams = {}) {
  // 1. Send data to Google Analytics / GTM dataLayer if loaded
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }

  // 2. Log in console (dev only)
  if (IS_DEV_MODE) {
    console.log(`[Analytics Event] Name: "${eventName}"`, eventParams);
  }

  // 3. แสดง Toast debug notification เฉพาะ dev mode เท่านั้น
  if (IS_DEV_MODE) {
    showToastNotification(eventName, eventParams);
  }
}

// --- Human-readable descriptions for analytics events ---
const EVENT_DESCRIPTIONS = {
  "scroll_section": {
    label: "เลื่อนดูรีวิว",
    params: {
      "carousel_action": {
        "next_review": "👉 ผู้ใช้กดดูรีวิวถัดไป",
        "prev_review": "👈 ผู้ใช้กดดูรีวิวก่อนหน้า"
      }
    }
  },
  "click_product_cta": {
    label: "คลิกสินค้า",
    params: {
      "product_name": (val) => `🛒 คลิกสั่งซื้อ: ${val}`
    }
  },
  "faq_open": {
    label: "เปิดคำถาม FAQ",
    params: {
      "question": (val) => `❓ เปิดดู: ${val}`
    }
  },
  "click_line_cta": {
    label: "คลิกปุ่ม LINE",
    params: {
      "section": (val) => `💬 คลิก LINE จากส่วน: ${val}`
    }
  }
};

function getEventDescription(eventName, eventParams) {
  const desc = EVENT_DESCRIPTIONS[eventName];
  if (!desc) return JSON.stringify(eventParams);

  // Try to find a matching param description
  for (const [key, value] of Object.entries(eventParams)) {
    if (desc.params && desc.params[key]) {
      const paramDesc = desc.params[key];
      if (typeof paramDesc === "object" && paramDesc[value]) {
        return paramDesc[value];
      } else if (typeof paramDesc === "function") {
        return paramDesc(value);
      }
    }
  }
  return JSON.stringify(eventParams);
}

function showToastNotification(eventName, eventParams) {
  // Check if a container already exists, if not, create it
  let container = document.getElementById("toast-notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-notification-container";
    container.className = "fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none";
    document.body.appendChild(container);
  }

  // Resolve human-readable label and description
  const eventDesc = EVENT_DESCRIPTIONS[eventName];
  const eventLabel = eventDesc ? eventDesc.label : eventName;
  const paramDescription = getEventDescription(eventName, eventParams);

  // Create individual toast element safely
  const toast = document.createElement("div");
  toast.className = "bg-leaf/95 text-ivory border border-gold p-4 rounded-xl shadow-xl flex items-center space-x-3 pointer-events-auto transform translate-x-96 transition-transform duration-300 ease-out max-w-sm";

  // Custom checkmark SVG + text (use textContent to avoid XSS)
  const svgNS = "http://www.w3.org/2000/svg";
  const iconWrap = document.createElement("div");
  iconWrap.className = "bg-gold text-leaf p-1.5 rounded-full shrink-0";

  const checkSvg = document.createElementNS(svgNS, "svg");
  checkSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  checkSvg.setAttribute("class", "h-4 w-4");
  checkSvg.setAttribute("fill", "none");
  checkSvg.setAttribute("viewBox", "0 0 24 24");
  checkSvg.setAttribute("stroke", "currentColor");
  checkSvg.setAttribute("stroke-width", "3");

  const checkPath = document.createElementNS(svgNS, "path");
  checkPath.setAttribute("stroke-linecap", "round");
  checkPath.setAttribute("stroke-linejoin", "round");
  checkPath.setAttribute("d", "M5 13l4 4L19 7");

  checkSvg.appendChild(checkPath);
  iconWrap.appendChild(checkSvg);

  const textWrap = document.createElement("div");
  const title = document.createElement("h5");
  title.className = "text-xs font-semibold uppercase tracking-wider text-gold";
  title.textContent = "Analytics Event Fired";

  const labelP = document.createElement("p");
  labelP.className = "text-sm font-bold font-serifThai";
  labelP.textContent = eventLabel;

  const paramP = document.createElement("p");
  paramP.className = "text-[10px] text-ivory/80 mt-0.5";
  paramP.textContent = paramDescription;

  textWrap.appendChild(title);
  textWrap.appendChild(labelP);
  textWrap.appendChild(paramP);

  toast.appendChild(iconWrap);
  toast.appendChild(textWrap);

  container.appendChild(toast);
  
  // Trigger entry animation
  setTimeout(() => {
    toast.classList.remove("translate-x-96");
    toast.classList.add("translate-x-0");
  }, 10);

  // Set timeout to dismiss and remove toast
  setTimeout(() => {
    toast.classList.add("translate-x-96");
    toast.classList.remove("translate-x-0");
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, 4000);
}

// Global binding for simple button triggers
window.trackCtaClick = function(channel, sectionName) {
  trackEvent(`click_${channel}_cta`, { section: sectionName });
};

// ─── Social Proof Counter (count-up animation) ───────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const easeOutQuad = t => t * (2 - t);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      el.textContent = Math.floor(easedProgress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));
}

// ─── Back to Top Button ───────────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('click_back_to_top', {});
  });
}

// ─── Cookie Consent Banner (PDPA) ────────────────────────────────────────────
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  if (!banner) return;

  const CONSENT_KEY = 'khao_mao_cookie_consent';

  // Only show if user hasn't decided yet
  if (!localStorage.getItem(CONSENT_KEY)) {
    setTimeout(() => {
      banner.classList.remove('translate-y-full');
      banner.classList.add('translate-y-0');
    }, 1500);
  }

  const hideBanner = () => {
    banner.classList.add('translate-y-full');
    banner.classList.remove('translate-y-0');
  };

  acceptBtn && acceptBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBanner();
    trackEvent('cookie_consent', { decision: 'accepted' });
  });

  declineBtn && declineBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    hideBanner();
    trackEvent('cookie_consent', { decision: 'declined' });
  });
}

// ─── Social Media Feed Tab Switcher ──────────────────────────────────────────
window.showFeed = function(platform) {
  const selectedFeed = document.getElementById(`feed-${platform}`);
  const selectedTab = document.getElementById(`tab-${platform}`);
  if (!selectedFeed || !selectedTab) return;

  document.querySelectorAll('[id^="feed-"]').forEach((feed) => feed.classList.add('hidden'));
  document.querySelectorAll('.social-tab-btn').forEach((tab) => {
    tab.classList.remove('bg-leaf', 'text-white', 'border-leaf');
    tab.classList.add('bg-white', 'text-riceBrown', 'border-beige');
  });

  selectedFeed.classList.remove('hidden');
  selectedTab.classList.add('bg-leaf', 'text-white', 'border-leaf');
  selectedTab.classList.remove('bg-white', 'text-riceBrown', 'border-beige');
  trackEvent('social_feed_tab_switch', { platform });
};

// ─── Register all new inits ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initBackToTop();
  initCookieConsent();
});
