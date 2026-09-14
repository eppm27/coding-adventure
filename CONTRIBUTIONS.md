# Contribution record

## Collaborative foundation

Source: [Milktea0408/Hackathon](https://github.com/Milktea0408/Hackathon), imported at commit `c3750cd` (`Merge pull request #4 from Milktea0408/ellis/b`).

The shared project supplied the Coding Adventure concept, home and level navigation, a moving-virus Escape Room prototype, quiz data, a partial Adventure flow, and original media. Git author identities include Ellis Mon, eppm27, and Milktea0408. This document does not infer which original features any person created.

## Personal continuation

The working branch `ellis/portfolio-polish` contains the following new work, developed for Ellis Mon’s personal version with AI coding assistance:

- Complete, distinct five-stage Front-End/Back-End adventures at all three difficulties.
- A replacement bank of 60 data-driven questions with precise answer explanations and randomized selection/options.
- Predictable state transitions with duplicate-answer protection, first-try scoring, streaks, and explicit completion/empty states.
- Accessible DOM targets in bounded cells, animation tied to frame time, pause-on-aim/focus, and reduced-motion support.
- A single native question dialog with explicit keyboard focus wrapping and retry behavior.
- Responsive mission screens, HUD, path selection, completion, restart, and replay.
- Defensive local record/preference persistence with records separated by challenge.
- Three additional games: block ordering, debugging challenges, and a bounded creative command interpreter.
- An illustrated outdoor world, original Pip mascot and level art, licensed local fonts, and five-mode completion badges.
- Dependency-free logic tests, static reference/syntax checks, browser QA fixtures, and deployment documentation.

The old implementation and media were removed from the active tree after inspection because they were replaced or no longer used. They remain recoverable in the original Git history; contributor history was not rewritten. The current interface uses original generated scenery, original SVG illustrations, and licensed local fonts instead of the historical image/music assets. See [asset provenance](assets/README.md). No audio plays.

## Repository boundary

The original remote is named `upstream`, with its local push URL set to `DISABLED` as an accidental-push guard. The personal repository is [eppm27/coding-adventure](https://github.com/eppm27/coding-adventure). Publication to this separate repository was authorized on 14 September 2026. No deployment has been performed.

See [docs/HANDOFF.md](docs/HANDOFF.md) for the personal-repository workflow and deployment instructions. Keep this origin statement, the README attribution, and original history with the personal version.

## Interview guidance

Explain the shared prototype first, then demonstrate the changes above. Discuss the state transition and selection tests, the mobile target-boundary calculation, and the localStorage failure path. Review and understand the code before claiming implementation expertise. Do not claim production usage, user counts, performance gains, or ownership of original team features that have not been established.
