# Prompt for Pogo: Set up WebdriverIO Visual Testing Demo

Pogo, your task is to create a minimal, working WebdriverIO project with **Cucumber + TypeScript + the official wdio-visual-service** (NOT Applitools) for visual regression testing.

**Important workflow change**:
1. First, clone my existing repo:  
   `git clone https://github.com/crypes/wdioviz.git`
2. `cd wdioviz`
3. Read the file `prompt.md` in the root of the repo — it contains the **detailed step-by-step instructions** for the rest of the setup.
4. Follow **every instruction in `prompt.md`** exactly, in order.
5. After each major phase described in `prompt.md`, commit the changes with a clear message and push to `origin main` using `git push origin main`.
   - You have access to the repo via the `gh` tool (GitHub CLI) — assume you're already authenticated with push permissions.

**Key goals from prompt.md (for your reference only — follow the file itself):**
- Install Node.js (if needed) and npm
- Run `npm init wdio@latest .` and answer prompts precisely:
  - TypeScript
  - Cucumber with default feature/step file locations
  - Include sample tests
  - Local Chrome (headless OK, but headed + 1920×1080 is fine for visual)
  - **Include the Visual Testing Service** (wdio-visual-service)
  - Accept any sample visual test files if offered
- Modify the sample login scenario on http://the-internet.herokuapp.com/login
- Add a step: `Then the page visually matches "full" screenshot "accounts/summary/abc"`
- Implement the step definition to:
  - Parse type ("full") and name ("accounts/summary/abc")
  - Capture full-page screenshot → save as `results/screenshots/accounts/summary/abc/full/before.png`
  - Pause 2 seconds
  - Use wdio-visual-service to compare current view against baseline
  - Save actual as `after.png` and diff as `diff.png` in same folder
  - First run should auto-accept baseline
- Run `npm run wdio` to verify
- Commit & push after each logical phase

**Safety rules**
- Never force-push (`git push --force`) unless I explicitly tell you.
- If any command fails, debug it step-by-step and explain what went wrong.
- Use console.log or commit messages to document progress.
- If `prompt.md` is missing or malformed, stop and ask me for clarification.
- Target URL for tests: http://the-internet.herokuapp.com/login

**Start now**:
1. Clone the repo.
2. cd into it.
3. Read `prompt.md`.
4. Execute its instructions phase by phase, committing and pushing as directed.

Proceed carefully and confirm each major step. Ask only if blocked or if `prompt.md` is unclear.