# RailPrep by Anmol

## Current State

The app has:
- A 5-screen React SPA: Home → Configure → Quiz → Result → Review
- A Motoko backend with a `questions` list that starts **empty** — this is the root cause of the "0 questions" bug. The backend has no seed data.
- Question fetching via `getQuestions(exam, section, topic, count, difficulty)`.
- Basic timer, answer map, skip map in QuizPage.
- Simple result page with correct/incorrect/skipped counts, but scoring formula is wrong (uses raw % not the RRB -0.33/-0.10 system).
- No leaderboard, no performance dashboard, no AI weakness analyzer, no smart revision, no streaks/badges, no All India Rank simulation.
- Homepage shows live question count from backend (which is 0).
- Modes are "full_mock" (100q/90min), "sectional" (30q/30min), "speed_drill" (10q/10min) — not matching spec (25/20min, 50/40min, 100/75min).

## Requested Changes (Diff)

### Add

**Backend:**
- Seed the `questions` stable list with 100+ high-quality RRB MCQs across all 4 sections and 3 exam types, all 4 difficulty levels. This is CRITICAL to fix the 0-question bug.
- New stable types and APIs:
  - `TestResult` record: userId, score, finalScore, correct, wrong, skipped, timeTaken, examType, mode, accuracy, timestamp
  - `saveResult(result: TestResult)` — server-side score recalculation before saving, prevents manipulation
  - `getLeaderboard(category: Text)` → [LeaderboardEntry] for daily/weekly/all-time
  - `getUserStats(userId: Text)` → UserStats (streak, badges, testHistory last 20)
  - `getTopicWrongAnswers(userId: Text)` → [TopicStat] for weakness analysis
  - `recordWrongAnswer(userId: Text, topic: Text, section: Text)` — track per-topic mistakes
  - `getQuestionsByIds(ids: [Text])` → [Question] for revision mode

**Frontend:**
- Fix exam modes to match spec: 25q/20min, 50q/40min, 100q/75min
- Fix homepage counter: always show "100000+" regardless of backend count
- Add fallback question generator (20 generic questions) if backend returns 0
- "Loaded backup questions." toast when fallback is used
- Proper loading spinner on QuizPage before questions load
- Block exam UI render until questions.length > 0
- Timer starts only after questions load; auto-submits at 0; no negative
- Fix scoring formula: +1 correct, -0.33 wrong, -0.10 skipped; round to 2dp
- Result page: show Total, Attempted, Correct, Wrong, Skipped, Raw Score, Negative Deduction, Final Score, Accuracy%, Performance message (Excellent/Very Good/Average/Needs Improvement)
- Question palette: mark-for-review state (orange), attempted, not-attempted indicators
- Tab-switch anti-cheat detection with warning toast
- Lock test after submit (prevent double-submit)
- Performance Dashboard page (`/dashboard`): Score Trend, Accuracy Trend, Section Performance, Time Analysis charts using recharts; last 20 test history stored in localStorage
- AI Weakness Analyzer section on dashboard: weakest 3 topics, strongest 2 topics, repeated mistakes (3+), suggested improvement topics
- Smart Revision mode page (`/revision`): filter by wrong/weak/last7days/bookmarked; 10/20/30 question modes
- Leaderboard page (`/leaderboard`): Daily/Weekly/All-time tabs; top 3 highlighted Gold/Silver/Bronze; rank by finalScore → accuracy → timeTaken
- All India Rank Simulation on result page: simulated 100,000 student distribution, show rank, percentile, top 1%/5%/10% status
- Streak & Badges panel on dashboard: daily streak counter, 8 badge types with auto-assignment logic
- Nav bar updated: add links to Dashboard, Leaderboard, Revision
- Bookmarking questions during review

### Modify

- `QuizContext.tsx`: Update `getModeConfig` to use new modes (25q/1200s, 50q/2400s, 100q/4500s). Add `markForReview` map to quiz state. Add `bookmarks` set to context.
- `ConfigurePage.tsx`: Update mode cards to show new counts/times. Rename modes: "Quick Test" (25q/20min), "Mock Test" (50q/40min), "Full Mock" (100q/75min).
- `QuizPage.tsx`: Full rewrite with robust loading/error states, fallback generation, tab-switch detection, mark-for-review, double-submit prevention, anti-cheat.
- `ResultPage.tsx`: Full rewrite with new scoring formula, All India Rank simulation, full stats breakdown.
- `HomePage.tsx`: Hardcode "100,000+" question count display.
- `AppLayout.tsx`: Add nav links for Dashboard, Leaderboard, Revision.
- `App.tsx`: Add routes for /dashboard, /leaderboard, /revision.

### Remove

- The old "speed_drill"/"full_mock"/"sectional" mode enum values (replace with new ones)

## Implementation Plan

1. **Backend**: Add 100+ seed questions to stable list; add `saveResult`, `getLeaderboard`, `getUserStats`, `getTopicWrongAnswers`, `recordWrongAnswer`, `getQuestionsByIds` APIs.
2. **QuizContext**: Update mode configs, add markForReview and bookmarks state.
3. **QuizPage**: Robust loading with fallback generator, tab-switch detection, mark-for-review, double-submit lock.
4. **ResultPage**: New scoring formula, All India Rank simulation, full stats.
5. **ConfigurePage**: New mode cards matching 25/50/100 spec.
6. **HomePage**: Hardcode 100,000+ counter.
7. **New pages**: DashboardPage, LeaderboardPage, RevisionPage.
8. **AppLayout + App.tsx**: Add new routes and nav links.
