# Files changed

## Replaced

- `index.html`: illustrated five-game map and explorer journal.
- `escaperoom.html`: Escape Room setup, gameplay, result, and dialog shell.
- `chooseyouradventure.html`: path/difficulty setup and Adventure shell.
- `README.md`: actual features, local instructions, screenshot, origin, and contributors.

## Added

- `style.css`: shared responsive visual system for all screens.
- `favicon.svg`: retained fallback icon; pages use the original mascot icon.
- `codebuilder.html`, `debugdash.html`, `creativelab.html`: new game shells.
- `assets/`: generated scenery, original mascot/bug/level SVGs, licensed local fonts, and provenance.
- `scripts/challenges.js`: 9 ordering puzzles and 12 debugging questions.
- `scripts/new-game-state.js`: pure ordering and bounded command interpreter logic.
- `scripts/code-builder.js`, `scripts/debug-dash.js`, `scripts/creative-lab.js`: new mode controllers.
- `scripts/progress.js`, `scripts/session-ui.js`, `scripts/motion.js`: shared completion records, results, and motion preference.
- `tests/new-games.test.js`: new-mode logic and persistence coverage.
- `docs/screenshots/`: final home and five-mode screenshots.
- `404.html`: unknown-route recovery page.
- `scripts/questions.js`: 60-question bank.
- `scripts/game-state.js`: pure selection, scoring, state transitions, and target positioning.
- `scripts/storage.js`: defensive record/preference persistence.
- `scripts/ui.js`: shared question rendering and focus helpers.
- `scripts/game.js`: both mode controllers, animation lifecycle, dialog events, and completion.
- `scripts/home.js`: home record display.
- `scripts/check.js`: static/syntax/reference validation.
- `tests/game.test.js`: dependency-free pure-logic tests.
- `tests/serve-fixtures.py`: local browser failure/preference fixtures.
- `package.json`: developer checks only; no application dependencies.
- `.gitignore`, `.vercelignore`: local/deployment exclusions.
- `CONTRIBUTIONS.md`: shared origin versus personal continuation.
- `docs/AUDIT.md`, `docs/TESTING.md`, `docs/HANDOFF.md`, `docs/FILES.md`, `docs/home.png`: audit, evidence, publishing instructions, inventory, and screenshot.

## Removed from active tree (preserved in Git history)

- `main.js`, `datastore.js`, `escaperoom.js`, `chooseyouradventure.js`.
- `style-index.css`, `style-escaperoom.css`, `style-chooseyouradventure.css`.
- Empty `ehe.txt`.
- Six unused original image files and three unused music tracks.

## Local Git configuration

Created branch `ellis/portfolio-polish`, renamed the original remote to `upstream`, and set its push URL to `DISABLED`. No changes were pushed and no history was rewritten. These local remote settings do not travel with a future clone; the documentation records them explicitly.
