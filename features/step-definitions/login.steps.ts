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
    // Get browser/device info for baseline path
    const { width, height } = await browser.getWindowSize();
    const tag = 'desktop_chrome'; // This matches wdio-visual-service default
    const fileName = `${screenshotPath}--${width}x${height}.png`;
    
    // Baseline path (where wdio-visual-service expects it)
    const baselineDir = path.join(process.cwd(), 'results', 'screenshots', 'baseline', tag, path.dirname(screenshotPath));
    const baselinePath = path.join(baselineDir, path.basename(fileName));
    
    // Check if baseline exists
    let baselineExists = false;
    try {
        await fs.access(baselinePath);
        baselineExists = true;
    } catch {
        baselineExists = false;
    }
    
    if (!baselineExists) {
        // First run: create baseline
        console.log(`Baseline not found. Creating baseline at: ${baselinePath}`);
        await fs.mkdir(baselineDir, { recursive: true });
        
        // Save screenshot as baseline
        await browser.saveFullPageScreen(baselinePath);
        
        // Pause 2 seconds as requested
        await browser.pause(2000);
        
        console.log('Baseline created. Future runs will compare against this baseline.');
    } else {
        // Subsequent runs: compare with baseline
        console.log(`Comparing with baseline: ${baselinePath}`);
        
        // Pause 2 seconds as requested
        await browser.pause(2000);
        
        // This will compare and fail if mismatch > threshold
        const result = await browser.checkFullPageScreen(screenshotPath);
        
        // result is the mismatch percentage (0 = identical)
        if (result > 0) {
            console.log(`Visual diff detected: ${result}% mismatch`);
            // The service saves actual/diff images automatically
        } else {
            console.log('Visual match: 0% difference');
        }
    }
});
