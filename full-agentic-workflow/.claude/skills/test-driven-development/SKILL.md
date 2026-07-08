---
name: test-driven-development
description: Use this skill whenever implementing a new feature or fixing a bug in this project. Drives the work test-first through a strict Red-Green-Refactor cycle, one test at a time, using this project's `npm test` / `npm run lint` / `npm run build` commands.
---

1. Write exactly one failing test for the next smallest unit of behavior — do not write
   implementation code first, and do not write more than one new test at a time.
2. Run `npm test` and confirm the new test fails, and read the failure output to confirm it fails
   for the expected reason (missing behavior), not a typo/import/syntax error.
3. Write the minimal code needed to make that one test pass — do not add behavior that isn't
   covered by a test yet.
4. Run `npm test` again and confirm every test passes (the new one and all existing ones).
5. Refactor if the implementation or test has duplication, unclear naming, or structural debt,
   keeping behavior unchanged. Rerun `npm test` after any refactor to confirm it's still green.
6. Repeat from step 1 for the next piece of behavior until the feature/bugfix is complete.
7. Before considering the work done, run the full verification gate:
   `npm run lint && npm test && npm run build`.
