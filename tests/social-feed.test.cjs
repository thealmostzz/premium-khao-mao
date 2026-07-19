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
  assert.match(main, /feed-\$\{platform\}/);
});
