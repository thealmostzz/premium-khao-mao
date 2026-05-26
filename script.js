/* -------------------------------------------------------------
 * Premium Khao Mao - Client Interaction & Dynamic Logic
 * ------------------------------------------------------------- */

// --- Dev Mode Flag ---
// เปลี่ยนเป็น false ก่อน deploy ไป production เพื่อซ่อน debug toast
const IS_DEV_MODE = false;

// Ensure dataLayer exists so analytics events can queue even before GTM loads
window.dataLayer = window.dataLayer || [];

// --- Mock Data ---
const PRODUCTS = [
  {
    id: "khao-mao-kluk",
    name: "ข้าวเม่าคลุกมะพร้าวอ่อนน้ำหอม",
    category: "Signature Menu",
    badge: "Signature",
    description: "ข้าวเม่าหอมระมุน คลุกมะพร้าวอ่อนน้ำหอมขูดเส้นหนานุ่มอย่างพิถีพิถัน รสชาติไทยแท้แบบดั้งเดิม หวานน้อยกลมกล่อม",
    priceText: "เริ่มต้น 120.- / กล่อง",
    image: "khao_mao_kluk", // Image asset reference
    ctaText: "สั่งซื้อเมนูนี้"
  },
  {
    id: "khao-mao-tod",
    name: "ข้าวเม่าทอดสูตรชาววังโบราณ",
    category: "Signature Menu",
    badge: "Best Seller",
    description: "กล้วยไข่สุกหวานกำลังดี ห่อหุ้มแป้งข้าวเม่าปรุงสูตรพิเศษ ทอดจนสีเหลืองตองอ่อนกรอบฟู ไม่อมน้ำมัน",
    priceText: "เริ่มต้น 150.- / กล่อง (4 ชิ้น)",
    image: "khao_mao_tod",
    ctaText: "สั่งซื้อเมนูนี้"
  },
  {
    id: "khao-mao-rang",
    name: "ข้าวเม่ารางหอมกรุ่นอบควันเทียน",
    category: "Signature Menu",
    badge: "Traditional",
    description: "ข้าวเม่าคั่วโบราณคัดพิเศษ นำไปอบควันเทียนสูตรลับจนหอมฟุ้ง ทานคู่กับมะพร้าวขูดและน้ำตาลทรายนวลใจ",
    priceText: "เริ่มต้น 135.- / ชุด",
    image: "khao_mao_rang",
    ctaText: "สั่งซื้อเมนูนี้"
  },
  {
    id: "crispy-khao-mao",
    name: "ข้าวเม่าอบกรอบปรุงรสพิเศษ (สูตรคลีน)",
    category: "Snack",
    badge: "New Item",
    description: "ข้าวเม่าคัดอ่อนผ่านกรรมวิธีอบกรอบ 100% ไร้น้ำมัน เหมาะสำหรับคนรักสุขภาพ ทานเล่นเพลินไม่มีเบื่อ",
    priceText: "เริ่มต้น 89.- / ซอง",
    image: "crispy_khao_mao",
    ctaText: "สั่งซื้อเมนูนี้"
  },
  {
    id: "premium-gift-set",
    name: "Premium Wooden Gift Set",
    category: "Gift Set",
    badge: "Premium Gift",
    description: "ชุดของฝากข้าวเม่าในแพ็กเกจกล่องไม้สักขัดเรียบหรู คาดริบบิ้นทองคำทองทอ พร้อมชาสมุนไพรออร์แกนิกในชุด",
    priceText: "เริ่มต้น 890.- / เซ็ต",
    image: "premium_gift_set",
    ctaText: "ดูชุดของฝาก"
  },
  {
    id: "corporate-gift-box",
    name: "Corporate Premium Gift Box",
    category: "Corporate",
    badge: "B2B Special",
    description: "บริการจัดทำเซ็ตของขวัญองค์กร ปริมาณมาก ออกแบบปั๊มฟอยล์โลโก้แบรนด์ของคุณ คลุมโทนโบว์สีสุภาพสากลสำหรับคู่ค้าและพนักงาน",
    priceText: "ราคาพิเศษรายออเดอร์",
    image: "corporate_gift_box",
    ctaText: "ติดต่อสอบถามแพ็กเกจ"
  }
];

const REVIEWS = [
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
    text: "ได้ทำการสั่งชุดของฝาก Corporate Premium Gift Set จำนวน 250 ชุด เพื่อแจกพนักงานและคู่ค้าทางธุรกิจในช่วงปีใหม่ ทุกคนชมเป็นเสียงเดียวกันว่าขนมรสชาติประณีตมาก กล่องไม้สลักลายโลโก้แบรนด์ดูแพงและเรียบหรู เหมาะสมกับเป็นของขวัญระดับพรีเมียมอย่างยิ่งครับ"
  },
  {
    name: "คุณกมลวรรณ เด่นไทย",
    role: "ลูกค้าซื้อของฝาก (กทม.)",
    stars: 5,
    text: "ปกติข้าวเม่าจะหาอร่อยและสะอาดได้ยากมากค่ะ แต่ร้านนี้ตำสดใหม่จริงๆ บรรจุภัณฑ์สุญญากาศมาอย่างดี ส่งมาถึงกรุงเทพฯ ข้าวเม่ายังคงความหอมสด สัมผัสนุ่มเด้งเหมือนทานสดที่หน้าร้านเลยค่ะ ยินดีบอกต่อเพื่อนๆ แน่นอนค่ะ"
  }
];

const FAQS = [
  {
    question: "ข้าวเม่าของทางร้านสามารถเก็บไว้ได้นานกี่วัน?",
    answer: "ข้าวเม่าคลุกสดบรรจุระบบสุญญากาศ เมื่อเก็บในตู้เย็นช่องปกติจะอยู่ได้ประมาณ 3-5 วัน และหากแช่แข็งในช่องฟรีซจะเก็บได้นานถึง 1 เดือนค่ะ แนะนำให้เปิดทานทันทีเมื่อเปิดบรรจุภัณฑ์เพื่อลิ้มรสสัมผัสที่ดีที่สุด ส่วนข้าวเม่าอบกรอบจะเก็บในอุณหภูมิห้องได้นาน 3 เดือนโดยไม่ต้องแช่เย็นค่ะ"
  },
  {
    question: "ถ้าต้องการซื้อเป็นของฝากต่างจังหวัด มีบริการขนส่งอย่างไร?",
    answer: "ทางร้านบริการจัดส่งด้วยระบบขนส่งควบคุมอุณหภูมิแช่เย็น (Cool Express) ทั่วประเทศค่ะ ขนมจึงรักษาความสดใหม่และเย็นไปจนถึงมือผู้รับอย่างแน่นอน โดยคิดค่าบริการจัดส่งเหมาจ่ายตามจริง หรือส่งฟรีทันทีเมื่อมียอดสั่งซื้อครบ 1,200 บาทขึ้นไปค่ะ"
  },
  {
    question: "ต้องทำการสั่งออเดอร์ล่วงหน้าก่อนกี่วัน?",
    answer: "สำหรับเมนูทั่วไป สั่งซื้อก่อน 12.00 น. จัดส่งในวันถัดไปได้ทันทีค่ะ ส่วนของขวัญพรีเมียม (Premium Gift Set) แนะนำสั่งล่วงหน้า 1-2 วัน และหากเป็นออเดอร์องค์กรจำนวนมาก (Corporate Order) แนะนำติดต่อล่วงหน้า 5-7 วันทำการเพื่อทางร้านจะจัดทำแพ็กเกจจิ้งปั๊มโลโก้และคัดเลือกรวงข้าวที่ดีที่สุดอย่างประณีตค่ะ"
  },
  {
    question: "มีแพ็กเกจจัดทำพิเศษสำหรับกลุ่มลูกค้าองค์กร (B2B) หรือไม่?",
    answer: "มีบริการเต็มรูปแบบค่ะ ทางร้านรับออกแบบสายคาด ปั๊มฟอยล์เงิน/ทอง บนกล่องไม้สัก การ์ดอวยพรตราบริษัท รวมถึงบริการคัดจัดเซ็ตพิเศษตามงบประมาณขององค์กร สามารถติดต่อแจ้งรายละเอียดฝ่ายขาย B2B หรือทัก LINE เพื่อขอใบเสนอราคาอย่างเป็นทางการได้ทันทีค่ะ"
  },
  {
    question: "มีหน้าร้านให้เข้าไปเลือกซื้อสินค้าเองหรือไม่?",
    answer: "ทางร้านมีครัวแฮนด์คราฟต์หน้าร้านหลักตั้งอยู่ที่จังหวัดนครราชสีมา ลูกค้าสามารถแวะเข้ามาทานสดๆ หรือมารับสินค้าได้ด้วยตนเองค่ะ เพื่อความสะดวกสูงสุด แนะนำทักแชทสั่งจองล่วงหน้าเพื่อจองคิวจัดทำไว้ก่อน จะได้ทานข้าวเม่าที่ทำสดขึ้นจากเตาร้อนๆ พอดีเวลาค่ะ"
  }
];

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderReviews();
  renderFAQs();
  initMobileMenu();
  initScrollEffects();
  initReviewsCarousel();
});

// --- Dynamic Rendering with Strict XSS Protection ---
function renderProducts() {
  const container = document.getElementById("product-grid");
  if (!container) return;

  container.innerHTML = ""; // Clear existing placeholder content safely

  PRODUCTS.forEach(product => {
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
    productImg.src = `assets/images/${product.image}.jpg`;
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
      window.open("https://line.me", "_blank", "noopener,noreferrer");
    });
    
    footerDiv.appendChild(ctaBtn);
    card.appendChild(footerDiv);

    container.appendChild(card);
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = "";

  REVIEWS.forEach((review, index) => {
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

  container.innerHTML = "";

  FAQS.forEach((faq, index) => {
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
  const reveals = document.querySelectorAll(".reveal");
  const stickyCta = document.getElementById("sticky-line-cta");

  // IntersectionObserver for beautiful scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });

  // Track window scroll to reveal sticky CTA after fold and update active header navigation
  window.addEventListener("scroll", () => {
    // Show/Hide Mobile Sticky CTA (After scrolling down 400px)
    if (window.scrollY > 400) {
      if (stickyCta) stickyCta.classList.add("visible");
    } else {
      if (stickyCta) stickyCta.classList.remove("visible");
    }

    // Scroll active link highlight logic
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a");

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
  });
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
    currentSlide = (currentSlide - 1 + REVIEWS.length) % REVIEWS.length;
    updateSlidesVisibility();
    trackEvent("scroll_section", { carousel_action: "prev_review" });
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % REVIEWS.length;
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
