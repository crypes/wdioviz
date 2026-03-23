import { Given, When, Then } from '@wdio/cucumber-framework';
import * as fs from 'fs/promises';
import * as path from 'path';

Given(/^I am on the login page$/, async () => {
    await browser.url('http://the-internet.herokuapp.com/login');
});

When(/^I login with valid credentials$/, async () => {
    await $('#username').setValue('tomsmith');
    await $('#password').setValue('SuperSecretPassword!');
    await $('button[type="submit"]').click();
});

Then(/^I should see the secure area$/, async () => {
    await expect($('#flash')).toBeExisting();
    await expect($('#flash')).toHaveText(expect.stringContaining('You logged into a secure area!'));
});

Then(/^the page visually matches "([^"]*)" screenshot "([^"]*)"$/, async (type: string, screenshotPath: string) => {
    // Create directory structure if it doesn't exist
    const baseDir = path.join(process.cwd(), 'results', 'screenshots', screenshotPath, type);
    await fs.mkdir(baseDir, { recursive: true });

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
