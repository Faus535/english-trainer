# English Trainer — Review & Redesign Plan

> Living document. Update after each phase is completed.

---

## PHASE 1: UI/UX Audit for iPhone Readability

### 1.1 Color & Contrast Analysis

| Element | Current | Contrast vs bg (#1a1a2e) | WCAG AA (4.5:1) | Verdict |
|---------|---------|--------------------------|------------------|---------|
| Main text `--text` | #eee | ~13:1 | PASS | OK |
| Secondary `--text2` | #aab | ~6.5:1 | PASS | OK |
| Muted `--muted` | #778 | ~3.8:1 | FAIL | Too dim for body text. Fine for labels only |
| Accent `--accent` | #e94560 | ~4.8:1 | PASS (barely) | Fails on `--bg3` backgrounds |
| Green `--green` | #4ecca3 | ~8.5:1 | PASS | OK |
| Purple `--accent2` | #533483 | ~2.1:1 | FAIL | IPA text unreadable in low light |

**Problems found:**
- `--muted` (#778) is used for day numbers, week titles, tips, previews — these become invisible outdoors or in bright rooms on iPhone
- `--accent2` (#533483) used for IPA pronunciation is critically low contrast — the most important element for a pronunciation app
- `--accent` (#e94560) on `--bg3` (#0f3460) backgrounds (week headers, activity times) drops below 3:1
- Dark theme is good for night study but the extreme darkness (#1a1a2e) fights against iPhone's auto-brightness in daylight

### 1.2 Typography Analysis

| Element | Size | Issue |
|---------|------|-------|
| Tab labels | 0.65rem (~10.4px) | Below Apple HIG minimum (11px). Hard to read |
| Day preview | 0.65rem | Hidden on mobile (<500px) but still rendered |
| Week title | 0.75rem (~12px) | Borderline small for subtitle text |
| Table cells | 0.85rem (~13.6px) | OK but tight with play buttons |
| Day number | 0.75rem | Small + muted color = double penalty |
| Voice select | 0.72rem | Tiny on iPhone, hard to tap the dropdown text |
| MD content p | inherits (~16px) | Good base size |
| Flashcard word | 2.4rem / 1.8rem mobile | Good |

**Problems found:**
- 5 elements are below 12px effective size — Apple HIG recommends 11pt minimum, but readability for learning content should target 14px+
- Line heights on content areas (1.4–1.5) are acceptable but could benefit from 1.6 for reading comfort
- No dynamic font scaling — `user-scalable=no` in viewport meta actively prevents pinch-to-zoom, which is an accessibility violation

### 1.3 Layout & Touch Targets

| Component | Issue |
|-----------|-------|
| Header | Cramped on iPhone SE: title + slider + dropdown + 3 buttons all in one row. Wraps badly |
| Days grid | 7 columns on tablet, 4 on mobile — tiles become tiny (< 70px wide) with truncated content |
| Play buttons | 32px visual, but ::before extends to 44px — clever but the visual size feels small |
| Speed slider | 60px wide — hard to precisely control on touch |
| Bottom nav | Good: fixed, 44px+ height, safe area padding |
| File viewer | max-height 50vh on mobile — cuts off content, user must scroll inside a scroll (nested scroll) |

**Problems found:**
- `user-scalable=no` — must remove this. Users with vision issues cannot zoom
- Header overflow on small screens — too many controls fighting for space
- Nested scrolling (file viewer inside main) creates confusion on iOS (rubber-band bounce on both)
- Days grid 7-col → 4-col jump is abrupt; no intermediate breakpoint

### 1.4 iPhone-Specific Issues

- **Safe area**: Handled correctly with `env(safe-area-inset-*)` — good
- **Status bar**: `black-translucent` works but header's dark bg merges with status bar, no visual separation
- **Rubber banding**: Nested scroll in file viewer triggers iOS overscroll on wrong container
- **TTS**: iOS Safari pauses after 15s — already handled with resume interval — good
- **Portrait lock**: `orientation: portrait` in manifest — fine for reading
- **Home screen**: Standalone mode tested — works, but splash is generic

### 1.5 Verdict

**The UI works but is not optimized for sustained iPhone reading.** Main issues ranked by impact:

1. **Critical**: IPA color (#533483) is nearly invisible — this defeats the core purpose
2. **Critical**: `user-scalable=no` blocks accessibility zoom
3. **High**: Muted text too dim for outdoor/bright use on multiple key elements
4. **High**: Header is overcrowded on small iPhones (SE, Mini)
5. **Medium**: Tab label font too small (0.65rem)
6. **Medium**: Nested scroll UX in file viewer
7. **Low**: No light theme option for daytime use

---

## PHASE 2: UI Redesign — COMPLETED 2026-03-19

### 2.1 Color Fixes — DONE

- [x] `--accent2`: changed from #533483 to #a78bfa (light purple, ~7:1 contrast on dark bg)
- [x] `--muted`: changed from #778 to #99a (bumps to ~5:1, passes AA)
- [x] `--text2`: bumped from #aab to #bbc for better secondary text readability
- [x] Added `--ipa-color` variable (#c4b5fd) specifically for phonetic text
- [x] Removed `user-scalable=no` from viewport meta
- [ ] Test all color combos with WebAIM contrast checker (manual verification pending)

### 2.2 Typography Fixes — DONE

- [x] Tab labels: bumped from 0.65rem to 0.72rem
- [x] Week titles: bumped from 0.75rem to 0.82rem + changed color from --muted to --text2
- [x] Day numbers: bumped from 0.75rem to 0.8rem + use --text2 instead of --muted
- [x] Voice select: bumped from 0.72rem to 0.8rem (now in settings panel)
- [x] MD content paragraphs: set to 0.95rem with line-height 1.65
- [x] Day preview text: bumped from 0.65rem to 0.72rem + --text2 color
- [x] IPA elements: bumped from 0.85em to 0.88em + uses --ipa-color
- [ ] Add `font: -apple-system-body` option for native iOS Dynamic Type support (future)

### 2.3 Layout Improvements — DONE

- [x] Header: moved speed slider + voice select + export/reset to collapsible settings panel (gear icon)
- [x] Header simplified: title + stop button + theme toggle + gear icon
- [x] Days grid: changed to `repeat(auto-fill, minmax(80px, 1fr))` for fluid columns
- [x] File viewer: opens as full-screen overlay on mobile (<600px) instead of nested scroll
- [x] Added safe-area-inset-top padding to header for status bar separation
- [x] Settings panel responsive: stacks vertically on mobile

### 2.4 Light Theme — DONE

- [x] Added CSS custom properties for light mode via `.light-theme` class
- [x] Respects `prefers-color-scheme: light` media query automatically
- [x] Added manual theme toggle button (moon/sun icon) in header
- [x] Theme persisted in localStorage (`english_plan_theme`)
- [x] Dynamic meta theme-color update on toggle
- [x] All semi-transparent backgrounds adapted for light backgrounds

---

## PHASE 3: Learning Strategy Analysis

### 3.1 Current Structure Review

**What the plan does well:**
- 16 weeks / 112 days is a realistic timeframe for A2→B1 progress
- 25 min daily sessions match attention span research (Pomodoro-like)
- Rest days every 7th day prevent burnout
- Pronunciation-first approach (Schwa → vowels → consonants) is backed by phonetics research
- Spaced repetition through weekly reviews
- Multimodal: reading + listening + speaking (TTS) + writing (dictation)

**What needs evaluation:**
- **Progression pace**: Is jumping from Schwa (week 1) to Past Simple grammar (week 2) too fast? Mixing phonetics + grammar in the same session may overload working memory
- **No active speaking practice**: TTS speaks TO the user, but there's no mechanism for the user to speak and get feedback (speech recognition)
- **No spaced repetition algorithm**: Flashcards are random, not SM-2 or Leitner. Words seen once may never return
- **Video dependency**: Dictation relies on external YouTube — if videos go down, those activities break
- **No placement test**: Everyone starts at Day 1 regardless of level. An A2 learner and a complete beginner get the same path
- **Grammar integration**: Grammar topics (tenses, conditionals) appear scattered. No clear grammar progression thread
- **No conversation practice**: Milestone says "first real conversation" at week 13, but nothing in the app practices conversation
- **Vocabulary ceiling**: 1209 words covers A2-B1 well, but no word frequency prioritization in the study flow
- **No error tracking**: User can't see what they struggle with — no weak-area targeting

### 3.2 Redesign Considerations

**Keep (proven effective):**
- Daily micro-sessions (20-30 min)
- Pronunciation as the foundation
- Gamification (XP, streaks, achievements)
- Progressive difficulty blocks (A→D)
- Rest days
- TTS integration

**Improve:**
- [ ] **Separate pronunciation and grammar tracks**: Let users do pronunciation daily (10 min) + grammar 2x/week (15 min) instead of mixing both
- [ ] **Add spaced repetition to flashcards**: Implement Leitner system (5 boxes) — words move up when correct, drop back when wrong
- [ ] **Add speech recognition**: Use Web Speech API (`SpeechRecognition`) for pronunciation practice with feedback
- [ ] **Add placement test**: 5-minute quiz at start to skip known material (skip Block A if user knows basics)
- [ ] **Grammar roadmap**: Create a visible grammar progression separate from pronunciation
- [ ] **Weak-area tracking**: Log which flashcards are failed most, which dictation scores are low
- [ ] **Offline-safe content**: Replace some YouTube dependencies with inline audio or downloadable clips
- [ ] **Conversation simulator**: Simple prompt-response exercises (even without AI, scripted dialogues work)

**Radical alternative (if full redesign):**
- Switch from day-based linear plan to **skill-tree model**: user picks what to study (pronunciation, grammar, vocabulary, listening) with prerequisites
- Each skill has levels (1→5) with clear objectives
- Daily suggested path but freedom to choose
- This is more complex to implement but dramatically improves engagement for users who aren't complete beginners

### 3.3 Priority Matrix

| Change | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Fix IPA/muted colors | High | Low | DO FIRST |
| Remove user-scalable=no | High | Trivial | DO FIRST |
| Simplify header | Medium | Low | Phase 2.3 |
| Leitner flashcards | High | Medium | Next sprint |
| Speech recognition | High | Medium | Next sprint |
| Placement test | Medium | Low | Next sprint |
| Separate grammar track | Medium | Medium | Plan redesign |
| Light theme | Low | Medium | Backlog |
| Skill tree model | Very High | Very High | V2.0 |

---

## Execution Order

```
Phase 2.1 → Color fixes (1-2 hours)
Phase 2.2 → Typography fixes (1 hour)
Phase 2.3 → Layout improvements (2-3 hours)
Phase 3.2 → Leitner flashcards + speech recognition (1-2 days)
Phase 3.2 → Placement test + grammar separation (1 day)
Phase 2.4 → Light theme (half day, optional)
Phase 3.2 → Skill tree model (V2.0, major rewrite)
```

---

*Last updated: 2026-03-19*
