# Global AGENTS Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the global Codex instructions so they are language-neutral, safe, and verifiable while preserving their concise style.

**Architecture:** Modify only the global instruction file at `C:\Users\TheAlmostzZ\.codex\AGENTS.md`. Keep its three existing sections, clarify applicability for JavaScript/TypeScript, and add compact guardrails for validation, verification, scope preservation, and safe diagnostic logging.

**Tech Stack:** Markdown

## Global Constraints

- Communicate in Thai.
- Preserve the file encoding.
- Do not alter unrelated instructions.
- Do not create unnecessary dependencies or project files.

---

### Task 1: Refine global agent guidance

**Files:**
- Modify: `C:\Users\TheAlmostzZ\.codex\AGENTS.md`
- Test: Manual content verification

**Interfaces:**
- Consumes: Existing global instruction sections for clarification, coding principles, final verification, and command logs.
- Produces: Global instructions that apply safely across language stacks.

- [ ] **Step 1: Define acceptance checks**

Confirm the completed file contains all of the following requirements:

```text
1. ES6+ and const guidance is explicitly limited to JavaScript/TypeScript.
2. Security guidance requires schema/allowlist validation, parameterized queries, and context-appropriate output encoding.
3. Finalization requires relevant test, lint, build, or targeted verification and reporting limitations.
4. Existing unrelated user changes and files outside scope are preserved.
5. Diagnostic logs are only created when necessary or requested and exclude secrets, tokens, and personal data.
```

- [ ] **Step 2: Apply the minimal instruction edits**

Update only the affected bullets in `C:\Users\TheAlmostzZ\.codex\AGENTS.md`; retain the existing headings, Thai communication requirement, ambiguity guidance, four-pillar structure, and concise command-log policy.

- [ ] **Step 3: Verify the resulting content**

Run:

```powershell
Get-Content -Raw 'C:\Users\TheAlmostzZ\.codex\AGENTS.md'
```

Expected: the five acceptance checks are explicitly covered, with no unrelated instruction removed.

- [ ] **Step 4: Report verification results**

Report the modified sections and confirm that no source code, dependency, or project configuration was changed.
