# Validation record

Validated locally on 11–13 September 2026. Production deployment was intentionally not performed.

## Automated checks

- `npm test`: **21 tests passed, 0 failed** using Node’s built-in test runner.
- `npm run check`: JavaScript syntax, module imports, machine-specific production paths, and 65 local references checked across 24 source files.
- `git diff --check`: passed.
- No lint tool or production build is configured or required. The app has no runtime dependencies.

Tests cover question schema/counts, category/difficulty filtering, randomized selection without duplicates, shuffled answer correctness, missing/invalid data, scoring, first-try streaks, retries, duplicate/invalid answers, completion, reset/immutability, isolated high scores, corrupt/blocked/quota-limited storage, and bounds/non-overlap for six moving or static targets.

## Browser checks

| Area | Result |
| --- | --- |
| Home | All five modes opened through their Play links; saved score/streak records displayed. |
| Escape Room | Desktop and 390px full runs completed; six targets, movement, pause, click/keyboard opening, correct/wrong answers, explanations, retries, removal, completion, and replay passed. |
| Code Builder | Three-round completion on desktop and 390px, native drag reorder, keyboard/arrow reorder, incorrect hints, scoring, replay, and saved completion passed. |
| Debug Dash | Six-round completion on desktop and 390px, retry explanations, scoring, next-game navigation, and replay passed. A complete blocked-storage run and replay also passed. |
| Creative Lab | World/character choices, add/reorder/remove, starter plan, run/stop/reset, and 12-step repeated mobile completion passed. Sprite remained in bounds; completion persisted. Reset during a run cancelled pending steps; all Add buttons disabled at the eight-action limit. |
| Dialog | One dialog, Escape dismissal, focus return, and forward/backward focus wrapping verified. Solving the final target then dismissing also completed the level. |
| Adventure | All six combinations (Front-End/Back-End × Beginner/Intermediate/Advanced) played through all five stages to results with correct path/difficulty labels. |
| Adventure reset | Replay resets score/progress; rapid double-click on Restart leaves one question panel and a clean run. |
| Persistence | Escape record survived refresh and appeared on home. Adventure path/difficulty survived reload. Records stored separately per challenge. |
| Responsive | Home, all five game screens, and Adventure setup checked at 1440, 1280, 1024, 768, and 390px with no horizontal overflow. Escape targets remained within the arena at all five widths. |
| Mobile | 390px Escape Room completed with a fitting question dialog and feedback. Adventure questions/retries/completion exercised at 390px, including a complete blocked-storage run. |
| Reduced motion | A local fixture returning the reduced-motion preference produced static targets and the correct disabled movement status. Two separate position observations were identical; target interaction worked. Shared reduced-motion state also disabled decorative animations and Lab transitions; a Lab plan completed without movement animation. |
| Missing data | Fixtures supplying empty quiz and Builder/Debug banks showed a focused recovery screen with a working home route rather than a blank game. |
| Blocked storage | A fixture throwing when localStorage is accessed still allowed a complete Adventure run, honest storage-unavailable result text, and replay. |
| Focus after stages | Advancing focuses the new question heading; stage content scrolls into view. |
| 404 | Custom 404 page rendered and its home link worked locally. Vercel’s automatic unknown-route handling awaits deployment. |
| Console | No errors observed during the replacement app’s checks, including failure fixtures. Original prototype errors are documented separately in AUDIT.md. |

New pure-logic tests also cover progressive difficulty, block permutations, shared immutable reorder, Builder/Debug completion, command whitelisting, repeat and stage bounds, completion idempotence, and migration of existing saved scores.

## Reproduce failure fixtures

```sh
python3 tests/serve-fixtures.py
```

- [Reduced-motion preference](http://127.0.0.1:4174/motion/escaperoom.html)
- [Blocked localStorage](http://127.0.0.1:4174/blocked/chooseyouradventure.html)
- [Empty question bank](http://127.0.0.1:4174/empty/escaperoom.html)

The fixture server changes browser API responses only in those test pages. It does not change operating-system settings or production files. It binds to localhost and is excluded from Vercel deployment.

## Scope limits

Browser checks used the available in-app browser and viewport emulation. Physical touch devices, full screen-reader testing, 200% text enlargement, and a full cross-browser matrix remain unverified. Reduced-motion detection was simulated; the CSS preference rule and target math were inspected/tested, but the OS preference was not toggled. No claim of WCAG certification is made. A production smoke test remains necessary after an authorized Vercel deployment.
