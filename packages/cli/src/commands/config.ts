import { Command } from 'commander';
import chalk from 'chalk';
import { Config } from '../config';

export function configCommand(program: Command): void {
  const config = program
    .command('config')
    .description('Manage DevMesh configuration');

  // ll config show
  config
    .command('show')
    .description('Show all configuration settings')
    .action(() => {
      const allConfig = Config.getAll();

      console.log(chalk.bold.cyan('DevMesh Configuration:'));
      console.log('');
      console.log(chalk.bold('API Base URL:'), allConfig.apiBaseUrl);
      console.log(chalk.bold('Auth Token:'), allConfig.authToken ? chalk.green('Set') : chalk.gray('Not set'));
      console.log(chalk.bold('Verbose:'), allConfig.verbose ? chalk.green('Enabled') : chalk.gray('Disabled'));
      console.log('');
      console.log(chalk.gray('Config file location: ~/.config/lovelogic-devmesh/'));
    });

  // ll config reset
  config
    .command('reset')
    .description('Reset configuration to defaults')
    .action(() => {
      Config.reset();
      console.log(chalk.green('✓ Configuration reset to defaults'));
      console.log(chalk.gray('API URL: http://localhost:3000'));
    });
}
