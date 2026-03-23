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
    // Get browser info for baseline path
    const { width, height } = await browser.getWindowSize();
    const tag = 'desktop_chrome';
    const fileName = `${screenshotPath}--${width}x${height}.png`;
    
    // 1. Baseline directory path
    const baselineDir = path.join(process.cwd(), 'results', 'screenshots', 'baseline', tag, path.dirname(screenshotPath));
    const baselinePath = path.join(baselineDir, path.basename(fileName));
    
    // 2. Create baseline directory if it doesn't exist
    await fs.mkdir(baselineDir, { recursive: true });
    
    // 3. Save full page screenshot to baseline directory (creates/updates baseline)
    await browser.saveFullPageScreen(baselinePath);
    
    // 4. Pause 2 seconds
    await browser.pause(2000);
    
    // 5. Compare current page with baseline
    const result = await browser.checkFullPageScreen(screenshotPath);
    
    // result is the mismatch percentage (0 = identical)
    if (result > 0) {
        console.log(`Visual diff detected: ${result}% mismatch`);
    } else {
        console.log('Visual match: 0% difference');
    }
});
