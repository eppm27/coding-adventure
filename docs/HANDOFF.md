# Personal-version handoff

## Local review

The project is a separate clone named `coding-adventure`, on branch `ellis/portfolio-polish`. It retains the original repository history through `c3750cd`. The surrounding website project was not modified.

Run the game and checks using the README. Review `git diff` and the new files before committing. There is no production build: the HTML, CSS, and JavaScript ship directly.

## Recommended repository name

`coding-adventure`

## Create the personal GitHub version after approval

The personal repository is now [eppm27/coding-adventure](https://github.com/eppm27/coding-adventure), created with authorization on 14 September 2026. The original history is retained. The steps below document how this separate repository was prepared; do not recreate it or re-add its existing remote.

1. Sign in to your GitHub account and create an empty repository named `coding-adventure`. Do not initialize it with a README, license, or `.gitignore`; this checkout already contains the project history. Alternatively, use GitHub’s Fork action on the original if you prefer GitHub to display the fork relationship automatically; choose `coding-adventure` as its name.
2. In a terminal, enter the local `coding-adventure` directory (the directory containing this README, not the surrounding website).
3. Review and validate:

   ```sh
   git status
   git diff
   npm test
   npm run check
   git remote -v
   ```

   `upstream` should fetch from the original repository and have push URL `DISABLED`. Leave that guard in place.

4. Commit the reviewed continuation locally:

   ```sh
   git add .
   git commit -m "Polish personal Coding Adventure continuation with team attribution"
   ```

5. Replace `YOUR_USERNAME` below with your GitHub username and connect only your personal repository:

   ```sh
   git remote add origin https://github.com/YOUR_USERNAME/coding-adventure.git
   git remote -v
   ```

6. Verify that `origin` points to your account, then publish the current branch as your personal repository’s `main`:

   ```sh
   git push -u origin HEAD:main
   ```

   This is a normal push, not a force push. An empty repository accepts the preserved history. A fork at the same original history should accept a fast-forward. If Git rejects the push because that repository already has different work, stop and inspect/merge that work rather than force-pushing.

7. Check the personal GitHub README, original contributor history, and source attribution. Keep the Project Origin section and contribution record.

## Vercel deployment after approval

1. In Vercel, add a new project and import **your personal** `coding-adventure` repository.
2. Select framework preset **Other**.
3. Set Root Directory to the repository root (the location of `index.html`). If publishing the standalone personal repository as instructed above, this is `.`; do not select the surrounding website project.
4. Leave Build Command empty (enable override and clear it if needed).
5. Set Output Directory to `.` and leave Install Command empty; there are no dependencies to install.
6. Do not add environment variables. Deploy when ready.
7. Verify `/`, `/escaperoom.html`, `/chooseyouradventure.html`, `/codebuilder.html`, `/debugdash.html`, and `/creativelab.html`, complete all five games, refresh the result records, and check an unknown URL.
8. Add the actual deployment URL under README → Play. No placeholder production URL is supplied.

Vercel’s static-site behavior serves these files without a server runtime. `404.html` supplies a recovery page for unknown paths; no rewrite/catch-all router is needed. `.vercelignore` excludes tests and development documentation. Vercel hosting itself has not been exercised because deployment was not authorized.

References: [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build) and [static-site 404 guidance](https://vercel.com/kb/guide/custom-404-page).

## Portfolio description

A browser-based coding game for students with five modes spanning coding quizzes, block ordering, debugging, and creative programming. This personal continuation of a team hackathon project adds data-driven quizzes, explicit game state, scoring, local records, and accessible responsive gameplay in vanilla JavaScript.

## Resume bullet

- Extended a collaborative hackathon prototype into a portfolio-ready vanilla JavaScript coding game, completing Adventure mode, adding three games, and implementing tested game state, accessible responsive controls, and local progress persistence.

## Remaining limitations

- No hosted URL exists yet; production smoke tests await an authorized deployment.
- Scores are local to a browser and can be cleared or edited; they are not verified competitive records.
- Refresh intentionally starts a new run; it preserves records/preferences, not in-progress sessions.
- Modern browsers supporting ES modules and native `<dialog>` are required.
- Browser QA covered the available in-app browser and responsive viewport emulation, not physical phones or a full Safari/Firefox/Chrome and screen-reader matrix.
- Reduced motion and blocked storage were tested through local fixtures; the user’s operating-system settings were not changed.
- Questions teach recognition and reasoning; Creative Lab runs only predefined commands, not arbitrary user code. Mobile block ordering uses accessible arrow controls.
- Historical team code had no license file at the inspected commit. No new license has been attached to the team’s work.
