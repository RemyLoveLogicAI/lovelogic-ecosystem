
import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log('--- DEBUG INFO ---');
        try {
            // @ts-ignore
            console.log('Puppeteer Cache Directory:', puppeteer.configuration?.cacheDirectory);
        } catch (e) {}

        console.log('Resolved Executable Path:', puppeteer.executablePath());

        console.log('Attempting to launch...');
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });
        console.log('Launch Success!');
        await browser.close();
    } catch (e: any) {
        console.error('Launch Failure:', e.message);
        if (e.message.includes('Could not find Chrome')) {
             console.log('SUGGESTION: Verify that the path above exists.');
        }
    }
})();
