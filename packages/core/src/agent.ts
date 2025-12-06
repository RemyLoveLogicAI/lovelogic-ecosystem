import { BrowserController } from '@nexus/browser';
import { VisionClient } from '@nexus/vision';
import { Planner, SimplePlanner, PlanResult } from './planner';
import chalk from 'chalk';

export class NavigatorAgent {
  private browser: BrowserController;
  private vision: VisionClient;
  private planner: Planner;

  constructor(browser: BrowserController, vision: VisionClient) {
    this.browser = browser;
    this.vision = vision;
    this.planner = new SimplePlanner();
  }

  async run(goal: string, maxSteps: number = 5): Promise<void> {
    console.log(chalk.bold.blue(`\n🤖 Agent Goal: ${goal}`));

    for (let i = 1; i <= maxSteps; i++) {
        console.log(chalk.yellow(`\n[Step ${i}/${maxSteps}] Observing...`));

        // 1. Observe
        const screenshotPath = await this.browser.screenshot();
        const analysis = await this.vision.analyze(screenshotPath, `Find elements relevant to: ${goal}`);

        let observation = analysis.description;
        if (analysis.elements && analysis.elements.length > 0) {
            observation += `\nDetected Elements: ${analysis.elements.map(e => e.label).join(', ')}`;
        }

        console.log(chalk.gray(`> Vision: ${observation}`));

        // 2. Plan
        console.log(chalk.yellow('Thinking...'));
        const plan: PlanResult = await this.planner.plan(goal, observation);
        console.log(chalk.magenta(`> Plan: ${plan.action} ${plan.target ? `on "${plan.target}"` : ''} (${plan.reasoning})`));

        // 3. Act
        if (plan.action === 'finish') {
            console.log(chalk.green('🎉 Goal Achieved (or Agent decided to stop).'));
            return;
        }

        if (plan.action === 'fail') {
             console.error(chalk.red('Agent gave up.'));
             return;
        }

        await this.executeAction(plan);

        // Wait a bit for page to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async executeAction(plan: PlanResult) {
      try {
          switch (plan.action) {
              case 'click':
                  if (plan.target) {
                      await this.browser.click(plan.target);
                  }
                  break;
              case 'type':
                  if (plan.target && plan.value) {
                      await this.browser.type(plan.target, plan.value);
                  }
                  break;
              case 'scroll':
                  // TODO: Implement scroll in BrowserController
                  console.log('Scrolling...');
                  break;
          }
      } catch (e: any) {
          console.error(chalk.red(`Action Failed: ${e.message}`));
      }
  }
}
