# README Design Spec

## Context

This repository contains a static marketing website for Premium Khao Mao. The current project includes:

- `index.html` as the main landing page
- `legal.html` for privacy and ordering terms
- Tailwind CSS build scripts in `package.json`
- localized content in `assets/js/i18n/translations.js`
- interactive page logic and structured page data in `assets/js/core/main.js`
- a longer product and brand plan in `docs/premium_khao_mao_plan.md`

There is no existing `README.md`.

## Goal

Create a GitHub-friendly README that works for both:

- visitors who want to quickly understand the project and its brand direction
- developers who need to run, update, and maintain the site

## Recommended Approach

Use a showcase-first README with technical sections underneath.

Why this approach:

- the repository represents a branded landing page, so the first impression matters
- the codebase is simple enough that developer setup can remain concise
- a mixed README prevents duplication between a portfolio-style overview and internal setup notes

## Alternatives Considered

### 1. Showcase-first

Recommended.

Start with project overview, highlights, and stack, then move into setup and structure.

### 2. Developer-first

Open with installation and build commands, then add business context later.

Tradeoff: easier for internal engineering use, but weaker as a public-facing GitHub landing page.

### 3. Minimal README

Keep only a short overview, commands, and folder structure.

Tradeoff: easiest to maintain, but undersells the branding and multilingual capabilities in the repo.

## README Structure

The README should contain:

1. Project title and short summary
2. Key highlights
3. Tech stack
4. Important pages and capabilities
5. Getting started
6. Available npm scripts
7. Project structure
8. Content maintenance notes
9. Related documentation
10. Project status

## Content Decisions

- Primary language: Thai
- Technical terms may remain in English where they are standard and clearer
- Keep setup instructions accurate to the current repo only
- Do not claim frameworks or tooling that are not actually present
- Mention i18n support because it is implemented in code
- Mention Tailwind build flow because it exists in `package.json`

## Scope Boundaries

Included:

- create a new `README.md`
- document current project structure and commands
- describe existing features and maintenance points

Excluded:

- changing website code or content
- adding screenshots or badges that do not yet exist
- inventing deployment steps without repository evidence

## Verification

Before completion, verify that:

- the README reflects the real files and scripts in the repo
- commands match `package.json`
- section names are readable and scan-friendly on GitHub
- no unsupported claims are introduced
