import { Command } from 'commander';
import chalk from 'chalk';

export function pingCommand(program: Command): void {
  program
    .command('ping')
    .description('Verify DevMesh CLI is working')
    .action(() => {
      console.log(chalk.green('✓ Pong! DevMesh CLI is operational.'));
      console.log(chalk.gray(`Version: 0.1.0`));
      console.log(chalk.gray(`Node: ${process.version}`));
    });
}
