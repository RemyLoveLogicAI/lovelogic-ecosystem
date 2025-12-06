import { Command } from 'commander';
import { BrowserController } from '@nexus/browser';
import { VisionClient } from '@nexus/vision';
import chalk from 'chalk';

export const browserCommand = (program: Command) => {
  const browser = new BrowserController();
  const vision = new VisionClient();

  const browserCmd = program.command('browser')
    .description('Manage browser automation');

  browserCmd.command('open <url>')
    .description('Open a URL in the browser')
    .action(async (url: string) => {
      try {
        console.log(chalk.blue(`Opening ${url}...`));
        await browser.open(url);
        console.log(chalk.green('✓ Browser opened successfully'));
      } catch (error: any) {
        console.error(chalk.red('✖ Failed to open browser:'), error.message);
        process.exit(1);
      } finally {
        await browser.close();
      }
    });

  browserCmd.command('search <query>')
    .description('Search for a query')
    .action(async (query: string) => {
      try {
        console.log(chalk.blue(`Searching for "${query}"...`));
        await browser.search(query);
        console.log(chalk.green('✓ Search initiated'));
      } catch (error: any) {
        console.error(chalk.red('✖ Failed to search:'), error.message);
        process.exit(1);
      } finally {
        await browser.close();
      }
    });

  browserCmd.command('click <selector>')
    .description('Click an element')
    .action(async (selector: string) => {
      try {
        await browser.click(selector);
        console.log(chalk.green(`✓ Clicked ${selector}`));
      } catch (error: any) {
        console.error(chalk.red('✖ Click failed:'), error.message);
        process.exit(1);
      } finally {
        await browser.close();
      }
    });

  browserCmd.command('type <selector> <text>')
      .description('Type text into an element')
      .action(async (selector: string, text: string) => {
        try {
          await browser.type(selector, text);
          console.log(chalk.green(`✓ Typed into ${selector}`));
        } catch (error: any) {
          console.error(chalk.red('✖ Type failed:'), error.message);
          process.exit(1);
        } finally {
          await browser.close();
        }
      });

  browserCmd.command('read <selector>')
      .description('Read text from an element')
      .action(async (selector: string) => {
        try {
          const text = await browser.read(selector);
          console.log(text);
        } catch (error: any) {
          console.error(chalk.red('✖ Read failed:'), error.message);
          process.exit(1);
        } finally {
          await browser.close();
        }
      });

  browserCmd.command('screenshot [path]')
      .description('Take a screenshot')
      .action(async (path?: string) => {
        try {
           const savedPath = await browser.screenshot(path);
           console.log(chalk.green(`✓ Screenshot saved to ${savedPath}`));
        } catch (error: any) {
           console.error(chalk.red('✖ Screenshot failed:'), error.message);
           process.exit(1);
        } finally {
           await browser.close();
        }
      });

  browserCmd    .command('analyze')
    .description('Analyze the current screen using VLM')
    .action(async () => {
      try {
        console.log(chalk.blue('Capturing detailed accessibility tree...'));
        const axTree = await browser.getAccessibilityTree();

        console.log(chalk.blue('Taking screenshot for vision analysis...'));
        const screenshotPath = await browser.screenshot();

        console.log(chalk.magenta('Analyzing with VLM...'));
        const result = await vision.analyze(screenshotPath);

        console.log(chalk.green('\n--- 👁️ Vision Analysis ---'));
        console.log(chalk.bold(result.description));
        if (result.elements && result.elements.length > 0) {
            console.log('\nDetected Elements:');
            result.elements.forEach(el => console.log(`- ${el.label}`));
        }
        console.log(chalk.green('-------------------------\n'));

      } catch (e: any) {
        console.error(chalk.red(`Failed to analyze: ${e.message}`));
      } finally {
        await browser.close();
      }
    });
};
