const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const main = fs.readFileSync('assets/js/core/main.js', 'utf8');
const translations = fs.readFileSync('assets/js/i18n/translations.js', 'utf8');

test('social section provides a safe Facebook placeholder', () => {
  assert.match(html, /id="tab-facebook"/);
  assert.match(html, /onclick="showFeed\('facebook'\)"/);
  assert.match(html, /id="feed-facebook"/);
  assert.match(html, /ติดตาม Facebook/);
  assert.match(html, /href="#" onclick="return false;"/);
  assert.match(main, /feed-\$\{platform\}/);
});

test('Facebook and LINE contact CTAs provide Thai and English translations', () => {
  assert.match(html, /data-i18n="social_follow_facebook"/);
  assert.match(html, /data-i18n="final_cta_call"/);
  assert.match(translations, /social_follow_facebook: "ติดตาม Facebook"/);
  assert.match(translations, /social_follow_facebook: "Follow Facebook"/);
  assert.match(translations, /final_cta_call: "ต้องการสอบถามเพิ่มเติม โทร 092-276-9055"/);
  assert.match(translations, /final_cta_call: "Need more information\? Call 092-276-9055"/);
});
