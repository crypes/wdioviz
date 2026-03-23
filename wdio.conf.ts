import * as path from 'path';
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    
    specs: ['./features/**/*.feature'],
    
    exclude: [],
    
    maxInstances: 1,
    
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1920,1080']
        }
    }],
    
    logLevel: 'info',
    
    bail: 0,
    
    waitforTimeout: 10000,
    
    connectionRetryTimeout: 120000,
    
    connectionRetryCount: 3,
    
    services: [
        [
            'visual',
            {
                baselineFolder: path.join(process.cwd(), 'results', 'screenshots', 'baseline'),
                screenshotPath: path.join(process.cwd(), 'results', 'screenshots', 'actual'),
                formatImageName: '{tag}-{logName}-{width}x{height}',
                savePerInstance: true,
            }
        ]
    ],
    
    framework: 'cucumber',
    
    reporters: ['spec'],
    
    cucumberOpts: {
        require: ['./features/step-definitions/**/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    }
};
