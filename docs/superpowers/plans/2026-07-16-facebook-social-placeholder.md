# Facebook Social Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มช่องทาง Facebook ที่ยังไม่มี URL ในส่วน Social Media โดยเลือกแท็บและแสดง CTA ได้อย่างปลอดภัย

**Architecture:** เพิ่ม markup ของ Facebook ใน `index.html` และใช้รูปสินค้าเดิมเป็น feed placeholder. ปรับ `showFeed` ให้ค้นหาแท็บและฟีดตามชื่อแพลตฟอร์ม จึงสลับสถานะได้ครบสามช่องทางโดยไม่เพิ่มเงื่อนไขซ้ำ.

**Tech Stack:** HTML, Tailwind CSS utility classes, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- ใช้ `href="#"` ร่วมกับ `onclick="return false;"` จนกว่าจะได้รับ URL Facebook จริง
- ไม่เพิ่ม dependency ใหม่
- ต้องรองรับจอมือถือโดยไม่มี horizontal scroll
- คงรูปแบบ event `social_feed_tab_switch` และส่งชื่อ platform `facebook`

---

### Task 1: เพิ่ม Facebook tab, feed placeholder และ CTA

**Files:**
- Modify: `index.html:831-1015`
- Modify: `assets/js/core/main.js:1085-1108`
- Create: `tests/social-feed.test.cjs`

**Interfaces:**
- Consumes: `window.showFeed(platform)` จาก `assets/js/core/main.js`
- Produces: `#tab-facebook`, `#feed-facebook`, และ CTA ที่มีข้อความ `ติดตาม Facebook`

- [ ] **Step 1: เขียน static integration test ที่ล้มเหลวก่อนแก้**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const main = fs.readFileSync('assets/js/core/main.js', 'utf8');

test('social section provides a safe Facebook placeholder', () => {
  assert.match(html, /id="tab-facebook"/);
  assert.match(html, /onclick="showFeed\('facebook'\)"/);
  assert.match(html, /id="feed-facebook"/);
  assert.match(html, /ติดตาม Facebook/);
  assert.match(html, /href="#" onclick="return false;"/);
  assert.match(main, /platform === 'facebook'/);
});
```

- [ ] **Step 2: รันทดสอบเพื่อยืนยันว่า fail**

Run: `node --test tests/social-feed.test.cjs`

Expected: FAIL เพราะยังไม่มี `tab-facebook` และ `feed-facebook`

- [ ] **Step 3: เพิ่ม markup และตัวสลับแท็บแบบทั่วไป**

เพิ่ม `<button id="tab-facebook" onclick="showFeed('facebook')">` ที่ใช้ Facebook SVG และคลาส inactive เดิม พร้อม `<div id="feed-facebook" class="hidden ...">` ซึ่งใช้ภาพสินค้าเดิม 6 รูปและ badge `Facebook`. เพิ่ม CTA `href="#" onclick="return false;"` ข้อความ `ติดตาม Facebook`.

แทน `showFeed` ด้วยการเลือก `.social-tab-btn` และ element id `feed-${platform}` เพื่อซ่อนทุก feed แล้วแสดงเฉพาะ feed ที่เลือก; กำหนด active/inactive classes ในลูป และ return เมื่อไม่พบ element.

```js
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
```

- [ ] **Step 4: รันทดสอบและตรวจ syntax**

Run: `node --test tests/social-feed.test.cjs; node --check assets/js/core/main.js`

Expected: ทุก test ผ่าน และไม่มี output จาก `node --check`

- [ ] **Step 5: ตรวจการแสดงผลแบบ responsive ด้วยเบราว์เซอร์**

เปิดหน้าเว็บ, กด Facebook tab, ยืนยันว่าเฉพาะ feed Facebook ปรากฏ; กด CTA ต้องไม่เปลี่ยนหน้า; ตรวจ viewport 375px และ 1440px ว่าแท็บ wrap ได้และไม่มี horizontal scroll

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/core/main.js tests/social-feed.test.cjs
git commit -m "feat: add facebook social placeholder"
```

## Self-review

- Spec coverage: Task 1 ครอบคลุม tab, placeholder feed, CTA, safe placeholder link, tab switching, analytics event และ responsive check
- Placeholder scan: ไม่มี TBD/TODO หรือคำสั่งที่ขาดรายละเอียด
- Type consistency: ชื่อ `facebook` ใช้ร่วมกันใน `showFeed`, `tab-facebook`, และ `feed-facebook`
