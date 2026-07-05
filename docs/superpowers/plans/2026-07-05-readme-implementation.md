# README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Thai-first GitHub README that accurately presents the Premium Khao Mao project for both visitors and developers.

**Architecture:** The work adds one new top-level `README.md` and derives all content from the current repository structure, scripts, and existing project documentation. The README will follow a showcase-first layout, then transition into setup, maintenance, and repository structure details without changing application code.

**Tech Stack:** Markdown, GitHub README conventions, npm scripts, Tailwind CSS, static HTML/CSS/JavaScript project structure

---

### Task 1: Gather source-of-truth project details

**Files:**
- Read: `package.json`
- Read: `docs/premium_khao_mao_plan.md`
- Read: `assets/js/core/main.js`
- Read: `assets/js/i18n/translations.js`
- Create: `README.md`

- [ ] **Step 1: Inspect the package scripts**

```powershell
Get-Content -Raw 'package.json'
```

- [ ] **Step 2: Confirm key pages and assets in the repo**

```powershell
rg --files
```

- [ ] **Step 3: Confirm feature evidence from the client code**

```powershell
Get-Content -TotalCount 220 'assets\js\core\main.js'
Get-Content -TotalCount 220 'assets\js\i18n\translations.js'
```

- [ ] **Step 4: Capture product and brand context from the existing documentation**

```powershell
Get-Content -Raw 'docs\premium_khao_mao_plan.md'
```

- [ ] **Step 5: Verify there is no existing README to preserve**

```powershell
Test-Path 'README.md'
```

- [ ] **Step 6: Commit checkpoint**

```bash
git status --short
```

Expected: no accidental source-code changes beyond planning docs before README creation.

### Task 2: Write the README content

**Files:**
- Create: `README.md`
- Reference: `docs/superpowers/specs/2026-07-05-readme-design.md`

- [ ] **Step 1: Create a showcase-first README structure**

```markdown
# Premium Khao Mao

คำอธิบายสั้นของโปรเจกต์

## ภาพรวมโปรเจกต์

## จุดเด่นของโปรเจกต์

## Tech Stack

## หน้าและความสามารถหลัก

## เริ่มต้นใช้งาน

## คำสั่งที่ใช้บ่อย

## โครงสร้างโปรเจกต์

## การแก้ไขคอนเทนต์

## เอกสารที่เกี่ยวข้อง

## สถานะโปรเจกต์
```

- [ ] **Step 2: Fill setup instructions from the actual npm scripts only**

```markdown
```bash
npm install
npm run build:tailwind
npm run watch:tailwind
```
```

- [ ] **Step 3: Document the current repository structure with exact folders and files**

```markdown
premium-khao-mao/
|- assets/
|  |- css/
|  |- images/
|  `- js/
|- config/
|- docs/
|- index.html
|- legal.html
`- package.json
```

- [ ] **Step 4: Add maintenance notes for multilingual content and page behavior**

```markdown
- ข้อความหลายภาษาอยู่ที่ `assets/js/i18n/translations.js`
- ข้อมูลสินค้า รีวิว FAQ และพฤติกรรมหน้าเว็บอยู่ที่ `assets/js/core/main.js`
- การตั้งค่า Tailwind อยู่ที่ `config/tailwind.config.js`
```

- [ ] **Step 5: Save the final README**

```powershell
Get-Content -Raw 'README.md'
```

Expected: the file contains all agreed sections in Thai-first wording and does not claim unsupported tooling or deployment steps.

- [ ] **Step 6: Commit checkpoint**

```bash
git status --short
```

Expected: `README.md` appears as a new file alongside plan/spec docs.

### Task 3: Verify accuracy and readability

**Files:**
- Verify: `README.md`
- Verify against: `package.json`

- [ ] **Step 1: Re-read the generated README**

```powershell
Get-Content -Raw 'README.md'
```

- [ ] **Step 2: Re-check the npm scripts for exact command names**

```powershell
Get-Content -Raw 'package.json'
```

- [ ] **Step 3: Confirm repository status**

```bash
git status --short
```

Expected: only the intended new documentation files are present.

- [ ] **Step 4: Commit**

```bash
git add README.md docs/superpowers/specs/2026-07-05-readme-design.md docs/superpowers/plans/2026-07-05-readme-implementation.md
git commit -m "docs: add project readme"
```

Expected: a documentation-only commit is created when the user wants a commit.
