# English Fast Learning — Task Plan

## Current Status: Phase 8 COMPLETE — All phases done

---

## Phase 1: Audio & Phoneme Audit ✅ COMPLETE
> Verify all 44 English sounds are properly covered and drillable.

- [x] Inventory all phonemes — **44/44 COVERED**
- [x] Verify minimal pair drills per contrast (9-16 pairs each)
- [x] Verify TTS playability (tables get play buttons)
- [x] Audit schwa, /ʒ/, diphthongs /ɪə/ /eə/ /ʊə/ → found critical gaps

---

## Phase 2: Fill Content Gaps ✅ COMPLETE
> Add missing drills, grammar, and verb coverage.

### 2A — Pronunciation ✅
- [x] Schwa /ə/ dedicated section (20 examples + drills)
- [x] /ʒ/ expanded (8 examples + /ʒ/ vs /ʃ/ drills)
- [x] Weak diphthongs drills (/ɪə/ /eə/ /ʊə/)
- [x] 13 consonant sections converted to tables → TTS playable

### 2B — Grammar ✅
- [x] 5 new files: passive voice, reported speech, relative clauses, indirect questions, used to/would
- [x] Past Perfect Continuous added to tenses-guide

### 2C — Verbs ✅
- [x] 50 more irregular verbs (#101-150)
- [x] -ed and -s pronunciation drills with exercises
- [x] 40 phrasal verbs by topic (work, relationships, daily life, travel)
- [x] `files-data.js` regenerated (48 files)

---

## Phase 3: Build the Fun Study Plan ✅ COMPLETE
> 16-week plan in 4 blocks mixing pronunciation + grammar + fun practice.

- [x] Block A (W1-4): Schwa, vowels, Present/Past Simple, top vocabulary
- [x] Block B (W5-8): Problem consonants, Present Perfect, Future, Conditionals
- [x] Block C (W9-12): Connected speech, Passive, Reported Speech, Relative Clauses
- [x] Block D (W13-16): Immersion, conversation, slang, final test
- [x] `plan-data.js` rewritten (112 days), `TOTAL_DAYS` updated, SW cache bumped

---

## Phase 4: Gamification ✅ COMPLETE
> XP, streaks, achievements, daily widgets.

- [x] XP system (50/day, 5/flashcard, 100/milestone, streak bonus)
- [x] 8 levels (Beginner → Master)
- [x] Daily streak tracking with fire icon
- [x] Sound of the Day (random phoneme + 3 playable words)
- [x] Phrase Roulette (random idiom, tap to reveal)
- [x] 15 achievement badges with animated unlock toasts
- [x] Gamification bar in dashboard (streak + level + XP + achievements count)
- [x] New module: `gamification.js`

---

## Phase 5: Redesign — Expandable Week Dashboard ✅ COMPLETE
> Main screen shows weeks as collapsible accordions with day tiles inside.

- [x] Redesign dashboard: weeks as expandable/collapsible accordion cards
- [x] Current week auto-expanded, rest collapsed by default
- [x] Week header: number, title (truncated), progress count (3/7), mini progress bar
- [x] Chevron indicator (▶ collapsed, ▼ expanded)
- [x] Block separators (Block A/B/C/D) with badge, label, week range
- [x] Expanded week shows 7 day-tiles in responsive grid
- [x] Day-tile: day #, label, duration, status icon, first activity preview
- [x] Current week highlighted (accent border), complete weeks (green border)
- [x] Click day-tile → navigates to day detail view
- [x] Click week header → toggle expand/collapse
- [x] Expand/collapse state persisted in localStorage
- [x] Gamification bar + widgets BEFORE weeks
- [x] Milestones and achievements AFTER weeks
- [x] Responsive: 7 cols desktop → 4 cols tablet → 3 cols mobile
- [x] Updated `views.js`: new `renderDashboard()`, `toggleWeek()`, `getCurrentWeekNumber()`
- [x] Updated `app.js`: `toggleWeek` event handler
- [x] Updated `styles.css`: accordion, block separators, new day tiles, media queries

---

## Phase 6: Redesign — Navigation Menu ✅ COMPLETE
> Main nav with access to all sections.

- [x] Bottom nav bar fixed at bottom with safe-area support
- [x] 4 tabs: Plan (book icon) | Flashcards (cards icon) | Translator (globe icon) | Achievements (star icon)
- [x] Each tab: icon + label, active tab highlighted in green
- [x] Achievements = dedicated full page with:
  - Stats grid (XP, Level, Current Streak, Best Streak, Days Done, Flashcards)
  - Level progress bar (big)
  - All 15 achievement badges (unlocked/locked)
- [x] Achievements section removed from dashboard (now its own page)
- [x] Header simplified: logo + TTS controls only (nav moved to bottom)
- [x] `main` padding-bottom increased for bottom nav clearance
- [x] Updated: `index.html` (bottom-nav, removed main-nav from header)
- [x] Updated: `app.js` (navigateTo handles achievements, bottom-tab selector)
- [x] Updated: `gamification.js` (new renderAchievementsView)
- [x] Updated: `styles.css` (bottom-nav, bottom-tab, achievements page, responsive)

---

## Phase 7: Redesign — Improved Day View ✅ COMPLETE
> Clicking a day shows the work clearly and attractively.

- [x] Day nav: circular prev/next buttons + centered day title/subtitle
- [x] Day header card: label, duration badge, week description, activity count
- [x] Activities as individual cards with:
  - Type icon: 🎧 dictation, 🎤 shadowing, 📖 reading, ▶ default, ☕ rest
  - Colored left border: yellow (dictation), purple (shadowing), green (reading)
  - Description + time in card header
- [x] "Ver contenido" button for .md files (toggleFileViewer preserved)
- [x] Details list and tips preserved in new card layout
- [x] Complete day button: sticky above bottom nav, pill-shaped, full width, shadow
- [x] Completed state: outlined green with no shadow
- [x] Responsive: cards and nav scale down on mobile
- [x] Updated: `views.js` (new renderDayView, renderActivity, getActivityIcon)
- [x] Updated: `styles.css` (day-header-card, activity-card, sticky button, type colors)

---

## Phase 8: Visual Polish & UX ✅ COMPLETE
> Final design details.

- [x] New CSS variables: --muted, --purple, --shadow-sm, --shadow-md, --radius-sm, --transition
- [x] Micro-animations:
  - fadeIn: dashboard, day view, achievements page
  - slideUp: week cards (staggered), activity cards (staggered)
  - popIn: unlocked achievements
  - checkPop: completed checkmarks
  - xpFloat: "+50 XP" floating text on day complete
- [x] XP float animation triggered on toggleDay (showXPFloat function)
- [x] Custom scrollbar (thin, themed)
- [x] Selection color (accent tint)
- [x] PWA manifest updated (16 weeks, new description)
- [x] Service worker cache version bumped (v3)
- [x] Progress bar text fixed (112 days)
- [x] files-data.js regenerated

---

## Notes

**Phoneme coverage: 44/44 (100%)**
**Grammar coverage: ~95%**
**Plan: 16 weeks, 112 days, 48 content files, gamification active.**
