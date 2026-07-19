# Client Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the static site against client-side injection and supply-chain risk without changing Quick Order or multilingual behavior.

**Architecture:** Tailwind CSS is compiled from a pinned local development dependency and served as static CSS. Page behavior is externalized from HTML, while a testable policy accepts only the translation markup required by the current UI.

**Tech Stack:** Static HTML, vanilla JavaScript, Node.js built-in test runner, Tailwind CSS 3.4.17.

## Global Constraints

- Preserve the existing Quick Order route to LINE and its URL encoding.
- Do not add runtime dependencies or hosting-specific security-header configuration.
- Pin `tailwindcss` exactly at `3.4.17` and commit `package-lock.json`.
- Do not stage or modify the user-owned `.gitignore` change.

---

## File Structure

- `package.json`, `package-lock.json`, `assets/css/generated/tailwind.css`: deterministic static CSS build.
- `assets/js/i18n/html-policy.js`: CommonJS/browser policy exposing `isAllowedHtmlTranslation(value): boolean`.
- `assets/js/core/legal-page.js`: title and description update for the legal page.
- `assets/js/core/main.js`: declarative click handling.
- `index.html`, `legal.html`, `assets/js/i18n/translations.js`: external script loading, safe translation rendering, and LINE privacy copy.
- `tests/security-hardening.test.cjs`: regression coverage.

### Task 1: Create failing security regression tests

**Files:** Create `tests/security-hardening.test.cjs`.

**Interfaces:** Imports `assets/js/i18n/html-policy.js`; reads `index.html` and `legal.html` as text.

- [ ] **Step 1: Write a failing test for static CSP readiness.**

    test("pages use generated CSS and contain no executable inline JavaScript", () => {
      for (const page of ["index.html", "legal.html"]) {
        const html = read(page);
        assert.match(html, /assets\/css\/generated\/tailwind\.css/);
        assert.doesNotMatch(html, /tailwind-cdn\.js/);
        assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/i);
        assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
      }
    });

- [ ] **Step 2: Write a failing test for the translation policy.**

    const policy = require(path.join(root, "assets/js/i18n/html-policy.js"));
    assert.equal(policy.isAllowedHtmlTranslation('<span class="text-gold">safe</span><br>'), true);
    assert.equal(policy.isAllowedHtmlTranslation('<a href="legal.html#privacy-policy" class="underline">safe</a>'), true);
    assert.equal(policy.isAllowedHtmlTranslation('<img src=x onerror="alert(1)">'), false);
    assert.equal(policy.isAllowedHtmlTranslation('<a href="https://evil.example">unsafe</a>'), false);

- [ ] **Step 3: Add a static assertion that `index.html` has `data-i18n="quick_order_privacy_notice"`.**

- [ ] **Step 4: Run `node --test tests/security-hardening.test.cjs`.** Expected: failure because the policy module, static Tailwind link, and non-inline markup do not yet exist.

### Task 2: Pin and precompile Tailwind CSS

**Files:** Modify `package.json`, `index.html`, `legal.html`; create `package-lock.json` and `assets/css/generated/tailwind.css`.

**Interfaces:** `npm run build:tailwind` invokes the local Tailwind executable using `config/tailwind.config.js` and writes `assets/css/generated/tailwind.css`.

- [ ] **Step 1: Use the failing CSP-readiness test from Task 1.** Run `node --test --test-name-pattern "pages use generated" tests/security-hardening.test.cjs`; expected failure names `tailwind-cdn.js`.

- [ ] **Step 2: Install the exact build dependency.** Run `npm install --save-dev --save-exact tailwindcss@3.4.17`.

- [ ] **Step 3: Replace both package scripts with local-binary commands.**

    "build:tailwind": "tailwindcss -i ./assets/css/source/tailwind-input.css -o ./assets/css/generated/tailwind.css --config ./config/tailwind.config.js --minify",
    "watch:tailwind": "tailwindcss -i ./assets/css/source/tailwind-input.css -o ./assets/css/generated/tailwind.css --config ./config/tailwind.config.js --minify --watch"

- [ ] **Step 4: Remove each runtime Tailwind script and its following inline configuration block; add `<link rel="stylesheet" href="assets/css/generated/tailwind.css">` before `assets/css/base/main.css`.**

- [ ] **Step 5: Run `npm run build:tailwind` then the Task 1 test.** Expected: the build succeeds; the test only still reports inline JavaScript or event handlers.

### Task 3: Enforce a fail-closed HTML translation policy

**Files:** Create `assets/js/i18n/html-policy.js`; modify `assets/js/i18n/translations.js`, `index.html`, `legal.html`.

**Interfaces:** `window.PremiumKhaoMaoHtmlPolicy.isAllowedHtmlTranslation(value)` is also exposed through `module.exports` for Node tests.

- [ ] **Step 1: Run `node --test --test-name-pattern "translation policy" tests/security-hardening.test.cjs`.** Expected: module-not-found failure.

- [ ] **Step 2: Implement the UMD policy.** It returns true only for text plus `<br>`, `<span class="…">`, `</span>`, `<a href="legal.html#privacy-policy" class="…">`, and `</a>`. The class value accepts only letters, digits, spaces, `_`, `-`, `/`, `:`, `[`, and `]`; every other tag, attribute, or href returns false.

- [ ] **Step 3: Load `html-policy.js` before `translations.js` on both pages.** In `applyHtmlTranslations`, set `el.innerHTML = value` only when the policy exists and returns true; otherwise set `el.textContent = value`. This is a fail-closed path.

- [ ] **Step 4: Run the focused policy test.** Expected: valid presentational markup passes; an event attribute and external URL are rejected.

### Task 4: Remove executable inline page behavior and add the LINE notice

**Files:** Create `assets/js/core/legal-page.js`; modify `assets/js/core/main.js`, `assets/js/i18n/translations.js`, `index.html`, and `legal.html`.

**Interfaces:** HTML provides `data-language`, `data-feed-platform`, `data-track-event`, `data-track-param`, `data-track-value`, and `data-placeholder-link`; `main.js` consumes them through one delegated click listener.

- [ ] **Step 1: Run the Task 1 CSP-readiness test.** Expected: failure identifies remaining inline scripts and `onclick` attributes.

- [ ] **Step 2: Replace language, feed, tracking, and placeholder `onclick` attributes with the declared `data-*` attributes.** Keep link targets and tracking event names unchanged.

- [ ] **Step 3: Add delegated click handling to `main.js`.** It uses `event.target.closest` to: prevent default for `data-placeholder-link`; call `setLanguage` for `data-language`; call `showFeed` for `data-feed-platform`; call `trackEvent` with `[data-track-param || "section"]: data-track-value` for tracking attributes.

- [ ] **Step 4: Move legal-page metadata language handling to `assets/js/core/legal-page.js`, load it after `translations.js`, and remove the legal inline script.** Remove the index analytics inline bootstrap because `main.js` initializes `window.dataLayer` before emitting events. Preserve the JSON-LD script because its type is non-executable.

- [ ] **Step 5: Add `quick_order_privacy_notice` in Thai and English.** Place it before the Quick Order submit button. The copy says the entered order details will open in LINE and must not include unnecessary personal data.

- [ ] **Step 6: Run `node --test tests/security-hardening.test.cjs tests/quick-order.test.cjs tests/social-feed.test.cjs`.** Expected: all tests pass.

### Task 5: Verify and commit the local hardening scope

**Files:** No planned modifications.

- [ ] **Step 1: Run the complete verification.**

    npm run build:tailwind
    node --test tests/*.test.cjs
    node --check assets/js/core/main.js
    node --check assets/js/core/legal-page.js
    node --check assets/js/core/quick-order.js
    node --check assets/js/i18n/html-policy.js
    node --check assets/js/i18n/translations.js
    git diff --check
    git status --short

Expected: every command exits 0 except `git status`, which must still identify `.gitignore` as a user-owned unrelated change.

- [ ] **Step 2: Stage only files owned by this plan and commit them.**

    git add -- package.json package-lock.json assets/css/generated/tailwind.css assets/js/core/main.js assets/js/core/legal-page.js assets/js/i18n/html-policy.js assets/js/i18n/translations.js index.html legal.html tests/security-hardening.test.cjs
    git commit -m "fix: harden static client security"
