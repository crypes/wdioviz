# WebdriverIO + Cucumber + TypeScript + wdio-visual-service Setup Instructions

Follow these phases exactly in order. Commit and push after each major phase completes successfully.

## Phase 1: Prerequisites

- Check if Node.js is installed: run `node -v`
  - If not installed or version < 18, install the latest LTS version (use nvm, direct download, brew, etc.)
- Confirm npm is available: `npm -v`
- Ensure the working directory is clean (`git status` should show no uncommitted changes unless expected)

Commit (if any setup scripts or notes were added):  
`git add . && git commit -m "Phase 1: Prerequisites checked and Node/npm ready"`

Push: `git push origin main`

## Phase 2: Clone and initialize project

(If already cloned, skip clone step)

- Clone the repo if not already present: `git clone https://github.com/crypes/wdioviz.git`
- `cd wdioviz`
- Run the WebdriverIO installer:  
  `npm init wdio@latest .`

Answer the interactive installer prompts **exactly** as follows:

- Where should your tests be launched from? → **On my local machine**
- Which framework do you want to use? → **Cucumber (https://cucumber.io/)**
- Do you want to use a compiler? → **TypeScript (https://www.typescriptlang.org/)**
- Where are your feature files located? → accept default (`./features/**/*.feature`)
- Where are your step definitions located? → accept default (`./features/step-definitions/**/*.ts`)
- Do you want WebdriverIO to generate some sample files for you? → **Yes**
- Do you want to add a framework-specific service? → **Yes** → select **Visual Testing Service** (`@wdio/visual-service`)
- Which browser do you want to use? → **Chrome**
- Do you want to run the tests in headless mode? → **Yes** (you can override to headed + 1920x1080 later)
- Accept any other defaults unless they conflict

After installation:
- Run `npm install` to ensure dependencies are resolved

Commit:  
`git add . && git commit -m "Phase 2: WebdriverIO initialized with Cucumber, TypeScript, sample tests, and wdio-visual-service"`

Push: `git push origin main`

## Phase 3: Verify basic setup

- Run the sample tests: `npm run wdio`
- Confirm the sample Cucumber tests run and pass (or at least execute without framework-level errors)
- If minor fixes are needed (e.g. TypeScript config, missing imports), make them

Commit any fixes:  
`git commit -m "Phase 3: Verified sample tests run successfully" && git push origin main`

## Phase 4: Configure visual testing service (if not auto-added perfectly)

- Open `wdio.conf.ts`
- Ensure the `services` array includes `'visual'` (or the full config object if needed)
- Add or confirm visual service config (example minimal setup):

```ts
services: [
    [
        'visual',
        {
            baselineFolder: path.join(process.cwd(), 'results', 'screenshots', 'baseline'),
            screenshotPath: path.join(process.cwd(), 'results', 'screenshots', 'actual'),
            formatImageName: '{tag}-{logName}-{width}x{height}',
            savePerInstance: true,
            // autoSaveBaseline: true,  // optional, but first run should auto-accept anyway
        }
    ]
],
```

- Create the `results/screenshots` folder structure if needed (can be done in code later)

Commit:  
`git add wdio.conf.ts && git commit -m "Phase 4: Configured wdio-visual-service paths and options"`

Push: `git push origin main`

## Phase 5: Add visual regression step to login scenario

Target URL: http://the-internet.herokuapp.com/login

1. Open the sample feature file (likely `features/login.feature` or similar)
2. In the successful login scenario, add this exact step at the end (after successful login assertion):

```gherkin
Then the page visually matches "full" screenshot "accounts/summary/abc"
```

3. In the corresponding step definition file (e.g. `features/step-definitions/login.steps.ts`):

Add or update the step definition:

```ts
Then(/^the page visually matches "([^"]*)" screenshot "([^"]*)"$/, async (type: string, screenshotPath: string) => {
    // Create directory structure if it doesn't exist
    const baseDir = path.join(process.cwd(), 'results', 'screenshots', screenshotPath, type);
    await fs.promises.mkdir(baseDir, { recursive: true });

    const beforePath = path.join(baseDir, 'before.png');

    // Capture full-page screenshot as baseline candidate
    await browser.saveFullPageScreen(beforePath);

    // Pause 2 seconds as requested
    await browser.pause(2000);

    // Compare with baseline using wdio-visual-service
    // checkFullPageScreen will:
    // - auto-create baseline on first run
    // - compare on subsequent runs
    // - save actual as after.png and diff as diff.png in configured paths
    // - fail test on mismatch > threshold
    await browser.checkFullPageScreen(screenshotPath);
});
```

- Use `import * as fs from 'fs/promises';` and `import * as path from 'path';` at the top if needed.
- Ensure the step uses `checkFullPageScreen` (full-page visual check) — it handles baseline/actual/diff automatically per docs.

Commit:  
`git add features/ && git commit -m "Phase 5: Added visual regression step to login scenario using checkFullPageScreen"`

Push: `git push origin main`

## Phase 6: Final verification & cleanup

- Run the full suite: `npm run wdio`
- Confirm:
  - First run: baseline (`before.png`) is created, test passes
  - Second run (or force mismatch e.g. by changing page): actual (`after.png`) + diff (`diff.png`) generated, test fails on mismatch
- Review `results/screenshots/accounts/summary/abc/full/` folder for before/after/diff files
- Add a comment in the feature file or README.md:  
  "Visual regression demo using wdio-visual-service on login page"

Commit:  
`git add . && git commit -m "Phase 6: Verified visual testing works - baseline creation, comparison, diff output"`

Push: `git push origin main`

**Final notes**
- If the visual service is not listed in installer, install manually: `npm install @wdio/visual-service` and add to services array.
- Use `browser.setWindowSize(1920, 1080)` in hooks or beforeScenario if visual consistency is needed (optional for now).
- All paths should use `path.join` for cross-platform safety.
- If errors occur (TypeScript, missing imports, service config), debug step-by-step.

You have completed the task when the visual test runs successfully twice: once creating baseline, once comparing (with intentional mismatch to see diff if desired).
```
