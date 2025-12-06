#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { pingCommand } from './commands/ping';
import { apiCommand } from './commands/api';
import { configCommand } from './commands/config';
import { browserCommand } from './commands/browser';
import { agentCommand } from './commands/agent';

const program = new Command();

program
  .name('ll')
  .description('DevMesh - Unified CLI for orchestrating AI development platforms')
  .version('0.1.0')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-c, --config <path>', 'Path to config file');

// Register commands
pingCommand(program);
apiCommand(program);
configCommand(program);
browserCommand(program);
agentCommand(program);

// Custom help
program.on('--help', () => {
  console.log('');
  console.log(chalk.bold.cyan('Examples:'));
  console.log('  $ ll ping                    # Verify CLI is working');
  console.log('  $ ll api health              # Check API health');
  console.log('  $ ll api health              # Check API health');
  console.log('  $ ll browser open google.com # Open URL');
  console.log('  $ ll api set-url <url>       # Set API endpoint');
  console.log('  $ ll config show             # Show configuration');
  console.log('');
  console.log(chalk.bold.cyan('Future Platform Integrations:'));
  console.log('  $ ll genspark <command>      # Genspark platform (coming soon)');
  console.log('  $ ll replit <command>        # Replit platform (coming soon)');
  console.log('  $ ll manus <command>         # Manus platform (coming soon)');
  console.log('');
});

// Error handling
program.exitOverride();

try {
  program.parse(process.argv);

  // Show help if no command provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
} catch (err: any) {
  if (err.code !== 'commander.help' && err.code !== 'commander.version') {
    console.error(chalk.red('Error:'), err.message);
    process.exit(1);
  }
}
