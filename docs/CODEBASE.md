# English Fast Learning PWA — Codebase Reference

> Last updated: 2026-03-19 | Vanilla JS PWA | No build tools | Offline-first | Dark/Light theme

## Architecture

- **SPA** with centralized event delegation (`data-action` attributes)
- **State**: localStorage with `STORAGE_PREFIX = 'english_plan_'`
- **Rendering**: Imperative DOM updates via `render()` → `innerHTML`
- **Pattern**: CQRS-inspired (render reads state, handlers mutate + re-render)

## Directory Structure

```
english-app/
├── index.html              Main document (76 lines)
├── manifest.json           PWA manifest (standalone, portrait)
├── sw.js                   Service worker (cache-first + bg update, CACHE_VERSION=4)
├── css/styles.css          All styles (dark/light theme, mobile-first, WCAG AA)
├── js/
│   ├── app.js              Bootstrap, routing, event delegation, theme, settings panel
│   ├── state.js            localStorage persistence (completedDays, milestones, notes)
│   ├── tts.js              Web Speech API (queue, iOS workarounds, chunk splitting)
│   ├── views.js            Dashboard, day detail, file viewer rendering
│   ├── gamification.js     XP (50/day), 8 levels, 16 achievements, streaks, phonemes
│   ├── flashcards.js       1209-word cards with history navigation
│   ├── translator.js       MyMemory API (es↔en)
│   ├── markdown.js         MD→HTML parser with TTS play buttons on tables
│   ├── utils.js            escapeHtml, cleanForSpeech, debounce
│   ├── plan-data.js        16-week curriculum (112 days, 4 blocks)
│   ├── vocab-data.js       1209 entries {en, ipa, es, type, ex}
│   └── files-data.js       Inlined .md content (~389KB, auto-generated)
├── icons/                  PWA icons (192px, 512px)
└── english/                Source .md content (vocabulary, grammar, trainer, etc.)
```

## JS Modules Detail

### app.js — Entry Point
- `initApp()` → validates data, inits theme + TTS, registers SW, renders
- `initTheme()` / `toggleTheme()` → dark/light mode, persisted in localStorage
- `toggleSettings()` → collapsible settings panel (speed, voice, export, reset)
- `navigateTo(page)` → routes: plan | flashcards | translator | achievements
- `setupEventDelegation()` → single click/change/input listener on document
- `handleKeyNav(key)` → Arrow keys, Space, Enter, Escape, P (pronounce)

### state.js — Persistence
- `loadState(key, fallback)` / `saveState(key, val)` → JSON ↔ localStorage
- `toggleDay(dayNum)` → marks complete, triggers XP + achievement check
- `saveDictationNote(dayNum, actIndex, text)` / `loadDictationNote()`
- `exportProgress()` → downloads full state as JSON
- Keys: completedDays, completedMilestones, dictationNotes, expandedWeeks, unlockedAchievements, flashcardCount, activityDates

### tts.js — Text-to-Speech
- `initTTS()` → loads English voices, prefers "Natural"/"Premium"
- `speak(text, onEnd)` → cleans text, speaks via SpeechSynthesisUtterance
- `playCell(btn, text)` / `playAllTable(tableEl)` / `playAllMd(viewerEl)`
- `splitIntoChunks(text, 200)` → sentence-boundary splitting
- iOS fix: `setInterval` every 10s calls `speechSynthesis.resume()`
- Rate: 0.3x–1.5x (default 0.8x), configurable via header slider

### views.js — Rendering
- `renderDashboard()` → gamification header, sound of day, phrase roulette, week accordions, milestones
- `renderDayView(n)` → activities, file viewers, dictation/shadowing embeds
- `toggleFileViewer()` → renders MD with "Leer todo" (read all) button
- `DAY_MAP{}` → O(1) lookup built once on load
- Block separators: A (wk1-4), B (wk5-8), C (wk9-12), D (wk13-16)

### gamification.js — Progression
- XP: 50/day, 5/flashcard, 100/milestone, +20 streak bonus (>3 days)
- 8 levels: Beginner(0) → Master(7000+)
- 16 achievements: first_day, week_1, streak_3/7/14, flash_50/200, block_a-d, halfway, graduate, milestones
- 19 phonemes (Sound of the Day), 20 idioms (Phrase Roulette)
- `showAchievementToast()`, `showXPFloat()` → UI animations

### flashcards.js — Vocabulary Cards
- `flashcardHistory[]` + `flashcardIndex` for back/forward navigation
- `getRandomWord()` from VOCAB_DATA (1209 words)
- Card shows: word, IPA, example, hidden translation
- 3 TTS buttons: word only | example only | both

### translator.js — Translation
- API: `api.mymemory.translated.net/get?q=...&langpair=es|en`
- Direction toggle: es→en or en→es
- TTS on English results only

### markdown.js — Content Renderer
- Supports: headers, lists, blockquotes, tables, bold/italic/code/links
- Tables get per-cell play buttons on English columns
- Skip columns: Spanish, IPA, type, nivel, significado, etc.
- `findFile(path)` → searches FILES_DATA (exact, partial, filename match)

### plan-data.js — Curriculum
- 16 weeks × 7 days = 112 days (day 7 = rest)
- Activity types: `file` (md path), `dictation` (YouTube ID), `shadowing` (YouTube ID)
- 15 dictation videos (BBC, Rachel's English, TED)
- 10 shadowing videos
- 14 milestones, 10 motivational quotes

## UI Architecture

### Navigation (4 tabs, bottom nav)
1. **Plan** — Dashboard with week accordions + day tiles
2. **Flashcards** — Random vocabulary cards
3. **Translator** — es↔en with TTS
4. **Achievements** — Stats + 16 badges

### Design System
- Dark: `--bg:#1a1a2e`, `--accent:#e94560`, `--green:#4ecca3`, `--text:#eee`, `--ipa-color:#c4b5fd`
- Light: `--bg:#f5f5f7`, `--accent:#d63150`, `--green:#30a879`, `--text:#1c1c1e`, `--ipa-color:#7c3aed`
- Theme: auto (prefers-color-scheme) + manual toggle, persisted in localStorage
- Border radius: 12px (cards), 8px (small)
- Accessibility: WCAG AA contrast, keyboard nav, aria labels, 44px touch targets, pinch-to-zoom enabled

### Event Flow
```
User click → data-action attribute → switch(action) → handler → saveState() → render()
```

## Service Worker Strategy
- **Install**: cache all assets, skipWaiting
- **Activate**: delete old caches, clients.claim
- **Fetch**: cache-first, background fetch to update cache

## Data Sizes
- vocab-data.js: 1209 entries
- files-data.js: ~389KB (43+ markdown files inlined)
- plan-data.js: ~600 lines (112 days curriculum)

## Build & Deploy
1. Edit .md files in `english/` directory
2. Run `./generate-files-data.sh` → rebuilds `js/files-data.js`
3. Bump `CACHE_VERSION` in `sw.js`
4. Deploy as static files (no server needed)
