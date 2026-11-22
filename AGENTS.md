# AGENTS.md — Digital Weekly Planner

> **GSD Framework** · Spec-Driven Development for AI agents
> This file is loaded automatically by AI coding assistants (Antigravity, Claude Code, etc.)
> at the start of every session. Keep it lean — it points to the real specs on disk.

---

## Project at a Glance

**Digital Weekly Planner** — a fully client-side, zero-dependency interactive HTML/CSS/JS planner.
- **Stack:** Vanilla HTML5 · CSS3 (custom properties, grid, flex) · ES6+ JavaScript (IIFE, localStorage)
- **Files:** `index.html` (900 ln) · `app.js` (3167 ln) · `styles.css` (3578 ln)
- **Storage:** `localStorage` (key: `digital_weekly_planner_clean_v3`), multi-week keyed by Monday date
- **Auth:** Google OAuth 2.0 via GIS for Drive cloud backup (optional)

## Read These First

| File | Purpose |
|------|---------|
| [`.planning/PROJECT.md`](.planning/PROJECT.md) | Vision, constraints, non-goals |
| [`.planning/REQUIREMENTS.md`](.planning/REQUIREMENTS.md) | Full feature list & acceptance criteria |
| [`.planning/ROADMAP.md`](.planning/ROADMAP.md) | Phased milestones |
| [`.planning/STATE.md`](.planning/STATE.md) | **Current progress — always check this first** |

## Working Rules for Agents

1. **Read `STATE.md` before every session** — it tells you exactly where work was left off.
2. **Never touch working features without a task in STATE.md** — no speculative refactors.
3. **No build tools, no npm, no bundlers** — this is a pure static site. Keep it that way.
4. **Keep the IIFE pattern** — all JS lives inside `(() => { 'use strict'; ... })()`.
5. **Preserve all CSS custom properties** — the pastel color system in `:root` is intentional.
6. **localStorage is the source of truth** — no server, no backend, no fetch calls for data.
7. **Google Drive sync is optional** — it must gracefully degrade when OAuth is not configured.
8. **Mobile-first** — the Vivo V50 breakpoint at ~420px is the primary mobile target.
9. **Accessibility** — ARIA roles and labels must be preserved on all interactive elements.
10. **After every task** — update `STATE.md` to mark progress and log what changed.

## Architecture Quick-Map

```
index.html          — Static shell; all dynamic content injected by app.js
app.js              — Single IIFE module:
  ├─ DEFAULT_DATA   — Template week/habit/priority/note data
  ├─ State vars     — plannerData, weekOffset, modalContext, etc.
  ├─ Audio          — Web Audio API tick sounds
  ├─ Week nav       — getMondayOfWeek(), switchWeek(), getWeekStorageKey()
  ├─ Persistence    — loadStoredData(), persistData(), snapshots, Drive backup
  ├─ Render         — renderDays(), renderHabits(), renderPriorities(), renderNotes()
  ├─ Modals         — editModal (tasks/habits/priorities), noteModal (rich notes)
  ├─ Drive sync     — Google Identity Services OAuth + Drive REST API v3
  └─ Mobile UX      — Day filter bar, slider nav, touch events
styles.css          — CSS custom properties → layout → day columns → modals → print
```

