# REQUIREMENTS.md — Digital Weekly Planner

**Version:** 1.0  
**Last Updated:** 2026-11-08

Each requirement has an ID (`REQ-XXX`), a status, and acceptance criteria.

---

## ✅ Implemented (Existing Features)

### REQ-001 · 7-Day Task Grid
- **Description:** Mon–Sun columns each display a list of time-stamped tasks
- **Acceptance:** Each day shows task rows with checkbox, time badge, and editable text; completion toggles strikethrough + ring update
- **Status:** ✅ Done

### REQ-002 · SVG Donut Progress Rings
- **Description:** Each day header shows a circular progress ring reflecting % of tasks completed
- **Acceptance:** Ring `stroke-dashoffset` updates in real-time on check/uncheck; colour matches day's pastel theme
- **Status:** ✅ Done

### REQ-003 · Weekly Habit Tracker
- **Description:** A matrix card showing habits (rows) × days (columns) as checkboxes
- **Acceptance:** Each cell is independently checkable; habits are editable/deletable; "Add Habit" appends a new row
- **Status:** ✅ Done

### REQ-004 · Weekly Priorities
- **Description:** A global priority list (not day-specific) with time and completion state
- **Acceptance:** Items have time badges; badge counter shows `done/total`; add/edit/delete works
- **Status:** ✅ Done

### REQ-005 · Rich Notes
- **Description:** Note cards with title, formatted date, and description
- **Acceptance:** Notes modal allows title + date (auto or custom) + description; cards render in notes panel
- **Status:** ✅ Done

### REQ-006 · Next Week Planning Panel
- **Description:** A section to pre-plan items for next week without navigating away
- **Acceptance:** Accessible via "Next Week →" pill in toolbar; items persist independently
- **Status:** ✅ Done

### REQ-007 · Multi-Week Navigation
- **Description:** Navigate between arbitrary past and future weeks
- **Acceptance:** Each week has isolated localStorage data; "Today" pill returns to current week; date picker lets jumping to any week
- **Status:** ✅ Done

### REQ-008 · Auto-Save & Snapshots
- **Description:** All changes auto-save to localStorage immediately (debounced) + 45s heartbeat + beforeunload
- **Acceptance:** No data loss on tab close; last 5 snapshots kept for undo recovery
- **Status:** ✅ Done

### REQ-009 · Google Drive Cloud Backup
- **Description:** Optional OAuth-gated backup to Google Drive as `weekly-planner-backup.json`
- **Acceptance:** Sign-in via GIS; auto-backup on data change (4s debounced); manual backup button; status dot in Share menu
- **Status:** ✅ Done

### REQ-010 · Export & Restore
- **Description:** Export planner data as JSON or Excel (.xls); restore from JSON file
- **Acceptance:** Print/PDF via `window.print()`; Excel via HTML table blob; JSON download/upload round-trips perfectly
- **Status:** ✅ Done

### REQ-011 · Custom Time Picker
- **Description:** Scroll-wheel HH / MM / AM-PM picker in task/priority modal
- **Acceptance:** Supports mouse wheel, touch drag, and arrow button clicks; preview badge updates live
- **Status:** ✅ Done

### REQ-012 · Mobile Day Filter Bar
- **Description:** Horizontal scrollable day-filter nav on mobile (<768px)
- **Acceptance:** "All Days" shows full grid; individual day pills show only that column; active state highlighted
- **Status:** ✅ Done

### REQ-013 · Day Slider Navigation
- **Description:** Previous/Next chevron buttons to slide day columns on small screens
- **Acceptance:** Buttons navigate day-by-day; active day highlighted; smooth scroll behaviour
- **Status:** ✅ Done

### REQ-014 · Tactile Audio Feedback
- **Description:** Subtle tick sound on task check/uncheck via Web Audio API
- **Acceptance:** Sound plays on check (C5→G5 chirp) and uncheck (A4 tone); mutable via sound toggle; gracefully silent if AudioContext blocked
- **Status:** ✅ Done

### REQ-015 · Print / PDF Layout
- **Description:** Clean print stylesheet that hides toolbar, buttons, and interactive chrome
- **Acceptance:** `@media print` rules apply `.no-print` class; output looks like a clean paper planner
- **Status:** ✅ Done

### REQ-016 · Weekly Completion Progress Bar
- **Description:** Toolbar bar showing overall weekly task completion
- **Acceptance:** `#overallBarFill` width + `#overallStat` text update in real time across all 7 days
- **Status:** ✅ Done

---

## 🚧 Planned / Backlog Features

### REQ-017 · Reset Confirmation Guard
- **Description:** The Reset button should require a confirmation step before clearing all data
- **Acceptance:** Clicking Reset shows an inline confirmation ("Sure? Yes / Cancel") before wiping; cancellable via button, click-outside, or Escape
- **Status:** ✅ Done

### REQ-018 · Drag-and-Drop Task Reordering
- **Description:** Tasks within a day column should be reorderable via drag-and-drop
- **Acceptance:** Native HTML5 drag events (no library); order persists to localStorage
- **Status:** 📋 Backlog

### REQ-019 · Keyboard Shortcuts
- **Description:** Power-user keyboard shortcuts for common actions
- **Acceptance:** `T` → Today, `N` → Next Week, `A` → Add task (in focused column), `Esc` → close modal; shown in a help overlay (`?`)
- **Status:** 📋 Backlog

### REQ-020 · PWA / Installable App
- **Description:** Add `manifest.json` and a service worker to make the planner installable as a PWA
- **Acceptance:** Chrome "Install" prompt appears; works fully offline after first load; Logo.png used as app icon
- **Status:** 📋 Backlog

### REQ-021 · Repeating / Template Habits
- **Description:** Mark a habit as "weekly template" so it auto-populates on every new week
- **Acceptance:** Template habits appear pre-populated when a new week is initialized; toggleable per-habit
- **Status:** 📋 Backlog

### REQ-022 · Task Search / Filter
- **Description:** A search bar to filter tasks across all days by keyword
- **Acceptance:** Typing in search bar dims non-matching tasks; clears on Escape
- **Status:** 📋 Backlog

### REQ-023 · Colour Theme Customizer
- **Description:** Let users pick their own pastel colour for each day's header
- **Acceptance:** Colour picker in day header; selection persists to localStorage; resets with planner reset
- **Status:** 📋 Backlog

### REQ-024 · Note Full-Text Search
- **Description:** Search across note titles and descriptions
- **Acceptance:** Filter note cards live as user types; no matches shows empty-state message
- **Status:** 📋 Backlog

### REQ-025 · Undo Last Action
- **Description:** Undo the most recent add/edit/delete/check action
- **Acceptance:** `Ctrl+Z` or Undo button reverts last state using the 5-snapshot rolling backup
- **Status:** 📋 Backlog

