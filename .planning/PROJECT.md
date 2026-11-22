# PROJECT.md — Digital Weekly Planner

**Version:** 1.0  
**Last Updated:** 2026-11-08  
**Status:** Active Development

---

## Vision

A **beautiful, fully offline, zero-dependency** digital weekly planner that runs entirely in the browser. It should feel like a premium paper planner — aesthetic, tactile, and distraction-free — but with the power of interactivity: habit tracking, progress visualization, cloud backup, and smart time scheduling.

> **Core promise:** Open `index.html` in any browser, and it just works. No server. No login required. No dependencies.

---

## What It Is

- An interactive 7-day planner with per-day task lists and SVG donut progress rings
- A weekly habit tracker matrix (habits × days checkboxes)
- A weekly priorities list (global tasks independent of a single day)
- A rich notes section with title, date, and description cards
- A "Next Week" planning panel to plan ahead without losing this week
- Google Drive cloud backup (optional, OAuth-gated)
- Full print/PDF export with clean print styles
- Excel and JSON export/restore
- Auto-save to localStorage every change + 45s heartbeat + beforeunload

---

## Core Constraints (Never Violate These)

| Constraint | Reason |
|-----------|--------|
| Pure static HTML/CSS/JS — no build step | Zero friction deployment; works offline via file:// |
| No npm, no bundlers, no frameworks | Keeps the project portable and dependency-free |
| Single IIFE module pattern in app.js | Avoids global scope pollution |
| All state in localStorage | Works offline; no server needed |
| Google Drive is optional/graceful | Users who don't sign in must have full functionality |
| Pastel color system via CSS custom properties | Brand identity; changing breaks the aesthetic |
| ARIA labels on all interactive elements | Accessibility requirement |
| Mobile layout targets Vivo V50 (~420px) | Primary mobile user device |

---

## Non-Goals

- ❌ User accounts / multi-user sync (Drive is per-user optional only)
- ❌ React, Vue, Svelte, or any JS framework
- ❌ Backend API or database
- ❌ Recurring task engine / calendar subscriptions (iCal)
- ❌ Dark mode (the pastel aesthetic is intentionally light)
- ❌ Native mobile app (PWA is acceptable if it stays static)

---

## Key Design Decisions

1. **IIFE pattern** — `app.js` wraps everything in `(() => { 'use strict'; })()` to prevent global leaks
2. **Week-keyed storage** — each week has its own `localStorage` key derived from the Monday date, enabling true multi-week planning
3. **SVG donut rings** — progress is visualized via `stroke-dashoffset` on `<circle>` elements, computed per day
4. **Scroll-wheel time picker** — the task modal uses a custom wheel UX (not `<input type="time">`) for aesthetic consistency
5. **Google Identity Services** — uses `gsi/client` library (not deprecated gapi.auth2) for Drive OAuth
6. **5-snapshot rolling backup** — localStorage keeps the last 5 auto-saves for undo safety

