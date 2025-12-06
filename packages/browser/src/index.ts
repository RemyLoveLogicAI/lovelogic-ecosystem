import puppeteer, { Browser, Page } from 'puppeteer';
import { spawn } from 'child_process';

export class BrowserController {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Initializes the browser. Tries to connect to existing instance on port 9222.
   * If failing, spawns a new detached Chrome process and connects to it.
   */
  public async init() {
    if (this.browser) return;

    const browserURL = 'http://127.0.0.1:9222';

    try {
      this.browser = await puppeteer.connect({
        browserURL,
        defaultViewport: null,
      });
      // console.log('[BrowserController] Connected to existing browser.');
    } catch (e) {
      console.log('[BrowserController] Launching new persistent browser...');
      const executablePath = puppeteer.executablePath();

      // Spawn detached process
      const chromeProcess = spawn(
        executablePath,
        [
          '--remote-debugging-port=9222',
          '--no-first-run',
          '--no-default-browser-check',
          '--start-maximized'
          // '--headless=new' // user can enable if desired, default to headed for now
        ],
        {
          detached: true,
          stdio: 'ignore'
        }
      );

      chromeProcess.unref();
      // console.log(`[BrowserController] Chrome spawned (pid ${chromeProcess.pid}). Waiting for connection...`);

      // Robust polling for connection
      let connected = false;
      const maxRetries = 20;
      const delay = 500;

      for (let i = 0; i < maxRetries; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, delay));
          this.browser = await puppeteer.connect({
            browserURL,
            defaultViewport: null,
          });
          connected = true;
          // console.log('[BrowserController] Connection successful.');
          break;
        } catch (e) {
          // console.log(`[BrowserController] Retry ${i + 1}/${maxRetries} connecting to browser...`);
        }
      }

      if (!connected) {
        throw new Error(`Failed to connect to browser after ${maxRetries * delay}ms. Is Chrome installed?`);
      }
    }

    if (!this.browser) throw new Error('Browser not initialized');
    const pages = await this.browser.pages();
    console.log(`[BrowserController] Found ${pages.length} pages.`);
    this.page = pages[0] || await this.browser.newPage();
  }

  async screenshot(path?: string): Promise<string> {
    await this.init();
    if (!this.page) throw new Error('Page not attached');
    const finalPath = path || `screenshot-${Date.now()}.png`;
    console.log(`[BrowserController] Taking screenshot: ${finalPath}`);
    await this.page.screenshot({ path: finalPath });
    return finalPath;
  }

  async getAccessibilityTree(): Promise<any> {
    await this.init();
    if (!this.page) throw new Error('Page not attached');
    console.log('[BrowserController] Fetching accessibility tree...');
    return this.page.accessibility.snapshot();
  }

  async open(url: string): Promise<void> {
    await this.init();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    console.log(`[BrowserController] Navigating to: ${url}`);
    if (this.page) {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
  }

  async search(query: string): Promise<void> {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await this.open(searchUrl);
  }

  async click(selector: string): Promise<void> {
    await this.init();
    if (!this.page) throw new Error('Page not attached');
    console.log(`[BrowserController] Clicking: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 5000 });
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.init();
    if (!this.page) throw new Error('Page not attached');
    console.log(`[BrowserController] Typing "${text}" into ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 5000 });
    await this.page.type(selector, text);
  }

  async read(selector: string): Promise<string> {
    await this.init();
    if (!this.page) throw new Error('Page not attached');
    console.log(`[BrowserController] Reading from: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 5000 });
    const content = await this.page.$eval(selector, (el) => el.textContent);
    return content || '';
  }

  async close(): Promise<void> {
    // We do NOT close the browser process to maintain persistence, unless explicitly requested.
    // user can kill chrome manually or we implement a 'kill' method.
    if (this.browser) {
       this.browser.disconnect(); // Just disconnect the websocket
       this.browser = null;
       this.page = null;
    }
  }
}
