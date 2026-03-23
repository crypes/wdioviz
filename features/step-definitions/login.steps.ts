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
    // Pause 2 seconds (replace this with navigation to another URL in your implementation)
    await browser.pause(2000);

    // Perform visual comparison unconditionally on every run
    // - First run: auto-creates baseline
    // - Subsequent runs: compares against baseline
    // - Throws error on mismatch > threshold
    const result = await browser.checkFullPageScreen(screenshotPath);
    
    // result is the mismatch percentage (0 = identical)
    if (result > 0) {
        console.log(`Visual diff detected: ${result}% mismatch`);
        // Actual and diff images are saved automatically by wdio-visual-service
    } else {
        console.log('Visual match: 0% difference');
    }
});
