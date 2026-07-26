# Hide Corporate Temporarily Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide every user-accessible Corporate/B2B entry point without deleting its existing implementation.

**Architecture:** Keep Corporate markup intact in `index.html` and add Tailwind's `hidden` utility to the Corporate section, the Gift Set CTA, and the footer link. A focused Node built-in test reads the static HTML to prevent these three entry points from becoming visible accidentally.

**Tech Stack:** Static HTML, Tailwind CSS utility classes, Node.js built-in test runner.

## Global Constraints

- Do not delete Corporate markup, translations, assets, product data, or analytics events.
- Mark each hidden entry point with the comment `Temporarily hidden: Corporate/B2B is not yet available.`
- Preserve existing HTML formatting and file encoding.

---

### Task 1: Protect Corporate visibility with a static HTML test

**Files:**
- Create: `tests/corporate-visibility.test.cjs`

**Interfaces:**
- Consumes: `index.html` as UTF-8 static markup.
- Produces: Node test coverage that asserts the three Corporate entry points have `hidden` and the section remains in source.

- [ ] **Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

test('Corporate/B2B entry points are temporarily hidden without removing their markup', () => {
  assert.match(html, /<a href="#corporate"[\\s\\S]*?class="[^"]*\\bhidden\\b[^"]*"/);
  assert.match(html, /<section id="corporate" class="[^"]*\\bhidden\\b[^"]*"/);
  assert.match(html, /<li class="hidden"><a href="#corporate"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/corporate-visibility.test.cjs`

Expected: FAIL because the Corporate entry points do not yet have the `hidden` utility.

- [ ] **Step 3: Write minimal implementation**

In `index.html`, add the required temporary-hide comment before each target, append `hidden` to the Gift Set CTA and Corporate section class attributes, and add `class="hidden"` to the Corporate footer `<li>`. Do not remove their `href`, IDs, content, or event handlers.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/corporate-visibility.test.cjs`

Expected: PASS.

- [ ] **Step 5: Run regression tests**

Run: `node --test tests/*.test.cjs`

Expected: PASS with no failures.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/corporate-visibility.test.cjs
git commit -m "feat: hide corporate entry points temporarily"
```
