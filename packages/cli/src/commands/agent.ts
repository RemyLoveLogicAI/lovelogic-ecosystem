import { Command } from 'commander';
import chalk from 'chalk';
import { NavigatorAgent } from '@nexus/core';
import { BrowserController } from '@nexus/browser';
import { VisionClient } from '@nexus/vision';

export function agentCommand(program: Command) {
  const agent = program.command('agent')
    .description('Autonomous Agent Commands');

  agent
    .command('run <goal>')
    .description('Run the autonomous agent with a high-level goal')
    .action(async (goal: string) => {
        console.log(chalk.bold.blue(`\n🦅 Launching Navigator Agent...`));
        console.log(chalk.gray(`Goal: "${goal}"`));

        // 1. Initialize Capabilities
        const browser = new BrowserController();
        const vision = new VisionClient();

        try {
            await browser.init();

            // 2. Initialize Agent
            const agent = new NavigatorAgent(browser, vision);

            // 3. Execute
            await agent.run(goal);

        } catch (e: any) {
            console.error(chalk.red(`\n💥 Agent Crashed: ${e.message}`));
        } finally {
            await browser.close();
            console.log(chalk.gray('Browser session closed.'));
        }
    });
};
