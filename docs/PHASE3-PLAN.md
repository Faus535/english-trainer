# Phase 3: Learning Strategy Redesign

> Living document. Update after each task is completed.

---

## Overview

The app is functional but needs strategic adjustments before real use. Four priorities identified, ordered by impact on a Spanish-speaking learner.

**Current state:** 112-day plan, 53-question placement test, 23 dictations, 20 shadowing sessions, phonetics-heavy first 8 weeks.

**Target state:** Balanced daily sessions with 30-35% listening, adaptive progression based on test results, and continuous assessment every 2 weeks.

---

## PHASE 3.1: Increase Listening to 30% of Daily Plan — COMPLETED 2026-03-20

**Problem:** Listening is the #1 barrier for Spanish speakers learning English (20 vowel sounds vs 5 in Spanish, connected speech, reduced forms). Currently only 23 dictation activities across 112 days — too few and too passive.

**Tasks:**

- [x] 3.1.1 — Audit current plan-data.js: count listening activities per week, identify gaps
- [x] 3.1.2 — Add listening activities to weeks 1-8 (currently phonetics-heavy, ~55% pronunciation)
  - Target: each day should have at least 1 active listening exercise (dictation, transcription, or minimal pair drill)
  - Use existing .md content: `listening/reduced-forms.md`, `listening/connected-speech-drills.md`, `listening/minimal-pairs-drills.md`, `listening/hardest-phrases.md`
- [x] 3.1.3 — Create new listening exercise types in the daily plan:
  - **Micro-dictation**: 3-5 short sentences per day (not full YouTube videos)
  - **Sound spotting**: Listen to a sentence, identify specific sounds (schwa, /θ/, linked words)
  - **Speed drill**: Same sentence at 0.7x → 0.9x → 1.0x → 1.1x speeds
- [x] 3.1.4 — Rebalance weekly distribution:
  - Weeks 1-4: 35% phonetics, 30% listening, 20% vocabulary, 15% grammar
  - Weeks 5-8: 25% phonetics, 30% listening, 20% vocabulary, 25% grammar
  - Weeks 9-12: 15% phonetics, 30% listening, 15% vocabulary, 40% grammar
  - Weeks 13-16: 10% phonetics, 35% listening, 15% vocabulary, 25% grammar, 15% conversation
- [x] 3.1.5 — Update plan-data.js with new activity distribution
- [x] 3.1.6 — Update views.js to render new listening exercise types (micro-dictation UI, speed drill controls)

**Acceptance criteria:**
- Every non-rest day has at least 1 active listening activity
- Listening represents 30%+ of total activities across the full plan
- New exercise types render correctly and use TTS at configurable speeds

---

## PHASE 3.2: Make Placement Test Skip Known Content — COMPLETED 2026-03-20

**Problem:** A student who scores A2+ in grammar still starts at Day 1 with basic content. The 53-question test classifies well but doesn't act on the results — everyone follows the same linear path.

**Tasks:**

- [x] 3.2.1 — Map test result levels to plan blocks:
  - A1 in all modules → Start at Day 1 (Block A)
  - A2 in grammar + A1 listening → Start at Day 1 but mark grammar days in Block A as optional
  - B1 in grammar → Skip to Block C grammar content (Week 9)
  - A2+ in pronunciation → Skip basic phonetics (Weeks 1-2), start at diphthongs (Week 3)
  - Profile "Reactivador" → Skip Block A, start at Block B (Week 5)
  - Profile "Intermedio" → Skip Blocks A+B, start at Block C (Week 9)
- [x] 3.2.2 — Add skip logic to state.js:
  - After test completion, auto-mark skipped days as "completed (skipped)"
  - Store `skipReason` per day ("level-test-skip")
  - Preserve ability to go back and review skipped content manually
- [x] 3.2.3 — Update dashboard UI:
  - Skipped days show with distinct style (gray + "Nivel superado" label)
  - "Your starting point" indicator on the first non-skipped day
  - Summary card: "Test result: A2 Grammar, A1 Listening — Starting at Week 5"
- [x] 3.2.4 — Add "Retake test" option in settings panel
  - Clears skip data and reassigns starting point
- [x] 3.2.5 — Update gamification: skipped days don't count toward XP or streaks

**Acceptance criteria:**
- Test results directly determine where the student starts
- Skipped content is visually distinct but accessible
- Student can retake test at any time
- XP system only rewards actual study, not skipped days

---

## PHASE 3.3: Add Mini-Tests Every 2 Weeks — COMPLETED 2026-03-20

**Problem:** Only 3 tests across 112 days (Day 27, 82, 109). No way to detect if the student is struggling or advancing faster than expected. Difficulty stays fixed regardless of performance.

**Tasks:**

- [x] 3.3.1 — Design mini-test format (shorter than placement test):
  - 5 vocabulary questions (translate, from current 2-week content)
  - 5 grammar questions (from current 2-week topics)
  - 3 listening questions (dictation at current level speed)
  - 2 pronunciation questions (minimal pairs from current phonetics)
  - **Total: 15 questions, ~5 minutes**
- [x] 3.3.2 — Create mini-test question pools per 2-week block:
  - Block A1 (Weeks 1-2): schwa, short vowels, present simple, top 100 words
  - Block A2 (Weeks 3-4): long vowels, diphthongs, past simple, top 200 words
  - Block B1 (Weeks 5-6): consonant pairs, present perfect, top 500 words
  - Block B2 (Weeks 7-8): consonant clusters, future tenses, phrasal verbs
  - Block C1 (Weeks 9-10): connected speech, conditionals, passive voice
  - Block C2 (Weeks 11-12): intonation, reported speech, relative clauses
  - Block D1 (Weeks 13-14): fluency, advanced grammar, 1000+ words
  - Block D2 (Weeks 15-16): full immersion review, all skills
- [x] 3.3.3 — Add mini-test to plan-data.js on days 14, 28, 42, 56, 70, 84, 98, 112
- [x] 3.3.4 — Create mini-test UI (reuse level-test patterns but shorter flow)
- [x] 3.3.5 — Implement adaptive difficulty based on mini-test results:
  - Score >= 80%: increase TTS speed by 0.1x, add harder vocabulary
  - Score 50-79%: maintain current difficulty
  - Score < 50%: suggest reviewing previous 2 weeks, slow TTS by 0.1x
  - Store difficulty adjustments in state.js
- [x] 3.3.6 — Show mini-test results with progress chart:
  - Per-skill scores over time (vocab, grammar, listening, pronunciation)
  - Trend arrows (improving / stable / declining)
  - Weak areas highlighted with "Review suggested" links

**Acceptance criteria:**
- Mini-test appears every 14 days (8 total across the plan)
- Questions are relevant to the content studied in the previous 2 weeks
- Results adjust difficulty (TTS speed, vocabulary level)
- Progress chart shows skill evolution over time

---

## PHASE 3.4: Rebalance Phonetics in Weeks 1-4 — COMPLETED 2026-03-20

**Problem:** Weeks 1-4 are ~60% phonetics — too heavy. Phonetics should be integrated with listening, not isolated. Students lose motivation doing pure pronunciation drills without practical context.

**Tasks:**

- [x] 3.4.1 — Restructure Weeks 1-4 daily sessions:
  - **Current**: 60% phonetics, 15% grammar, 15% vocab, 10% listening
  - **Target**: 35% phonetics, 30% listening, 20% vocab, 15% grammar
- [x] 3.4.2 — Convert isolated phonetics drills into integrated exercises:
  - Instead of "Learn the schwa sound" → "Listen to 5 sentences, count the schwas"
  - Instead of "Practice /θ/ vs /ð/" → "Dictation: write what you hear, then check your /θ/ pronunciation"
  - Pair every phonetics concept with a listening exercise that uses it
- [x] 3.4.3 — Add context to pronunciation:
  - Link each phonetic lesson to real vocabulary from the same day
  - Example: Day 3 teaches short /ɪ/ → vocabulary includes "sit, big, fish, listen, city"
  - Phonetics feels purposeful when tied to words you're actually learning
- [x] 3.4.4 — Update plan-data.js activities for Weeks 1-4:
  - Each day: 1 phonetics .md + 1 listening exercise + 1 vocabulary set + 1 grammar intro (where applicable)
  - Remove duplicate phonetics-only blocks
  - Add new integrated activity type: `"type": "phonetics-listening"` (combines both)
- [x] 3.4.5 — Create integrated exercise UI:
  - Step 1: Read the phonetics rule (from .md)
  - Step 2: Listen to examples (TTS)
  - Step 3: Identify the sound in sentences (interactive)
  - Step 4: Practice with vocabulary words containing the sound
- [x] 3.4.6 — Update views.js to render the new `phonetics-listening` activity type

**Acceptance criteria:**
- Weeks 1-4 phonetics drops from ~60% to ~35%
- Every phonetics lesson is paired with a listening exercise
- Vocabulary words match the phonetics focus of the day
- New integrated exercise type renders and functions correctly

---

## Execution Order

```
Phase 3.1 → Listening boost (modify plan-data.js + new exercise types)
Phase 3.4 → Rebalance phonetics weeks 1-4 (depends on 3.1 for listening content)
Phase 3.2 → Test skip logic (independent, but better after plan is rebalanced)
Phase 3.3 → Mini-tests every 2 weeks (depends on 3.2 for test infrastructure)
```

**Dependencies:**
- 3.1 and 3.4 modify the same plan-data.js — execute together to avoid conflicts
- 3.2 can start in parallel if working on different files (state.js, views.js)
- 3.3 depends on 3.2's test patterns and 3.1's content distribution

---

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Listening % of daily activities | ~10-15% | 30-35% |
| Phonetics % in Weeks 1-4 | ~60% | ~35% |
| Tests across 112 days | 3 | 11 (3 full + 8 mini) |
| Days skippable by test | 0 | Up to 56 (Blocks A+B) |
| Adaptive difficulty adjustments | None | Every 2 weeks |

---

*Created: 2026-03-20*
*Completed: 2026-03-20*

## Implementation Notes

### Phase 3.1 — Interactive Listening Exercises
The modular system already had listening at 35% weight. Implementation added:
- **Micro-dictation**: TTS-powered sentence dictation with show/hide answers
- **Speed drills**: Same sentence at 0.7x → 0.85x → 1.0x → 1.15x
- **Minimal pair drills**: Interactive sound comparison with TTS
- **Accent exercises**: Word comparison across accents
- **Context listening**: Sentences with cultural/slang notes
All placeholders in `session.js renderUnitContent()` replaced with interactive exercises.

### Phase 3.2 — Test Skips Content
The modular system already sets per-module CEFR levels from the placement test, which IS the skip mechanism. Added:
- `retakeTest()` function in `level-test.js`
- "Repetir test" button in settings panel
- Test results summary card on dashboard showing current levels per module
- Adaptive difficulty display on dashboard

### Phase 3.3 — Mini-Tests Every 2 Weeks
New file `mini-test.js` (500+ lines) with:
- Question pools per CEFR level (A1→C1), ~12 vocab + 8 grammar + 6 listening + 4 pronunciation per level
- 15-question mini-test: 5 vocab + 5 grammar + 3 listening + 2 pronunciation
- Trigger: every 8 completed listening units (~2 weeks at 3-4 sessions/week)
- Adaptive difficulty: adjusts TTS speed, enables vocab boost, enables listening slowdown
- Progress chart: bar chart showing skill evolution across mini-tests
- Trend indicators: up/down/stable arrows per skill

### Phase 3.4 — Integrated Phonetics-Listening
Replaced isolated pronunciation exercises with integrated format:
- Step 1: Listen to example words (TTS)
- Step 2: Hear sound in context sentences
- Step 3: Repeat and compare
- Vocabulary words matched to phonetics focus of each unit
- `getPronunciationWords()` and `getPronContextSentences()` generate content based on unit title
