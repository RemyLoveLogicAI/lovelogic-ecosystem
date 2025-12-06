import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { Config } from '../config';
import { HealthResponse } from '../types';

export function apiCommand(program: Command): void {
  const api = program
    .command('api')
    .description('Interact with LogicStarter API');

  // ll api health
  api
    .command('health')
    .description('Check LogicStarter API health status')
    .action(async () => {
      const spinner = ora('Checking API health...').start();

      try {
        const apiUrl = Config.getApiUrl();
        const response = await axios.get<HealthResponse>(`${apiUrl}/health`, {
          timeout: 5000,
        });

        spinner.succeed(chalk.green('API is healthy'));

        console.log('');
        console.log(chalk.bold('Service:'), response.data.service);
        console.log(chalk.bold('Status:'), chalk.green(response.data.status));
        console.log(chalk.bold('Version:'), response.data.version);
        console.log(chalk.bold('Timestamp:'), response.data.timestamp);
        console.log(chalk.bold('Endpoint:'), apiUrl);
      } catch (error: any) {
        spinner.fail(chalk.red('API health check failed'));

        if (error.code === 'ECONNREFUSED') {
          console.log('');
          console.log(chalk.yellow('⚠ Cannot connect to API'));
          console.log(chalk.gray(`Endpoint: ${Config.getApiUrl()}`));
          console.log(chalk.gray('Make sure the API server is running:'));
          console.log(chalk.gray('  cd packages/api && pnpm dev'));
        } else if (error.response) {
          console.log('');
          console.log(chalk.red(`HTTP ${error.response.status}: ${error.response.statusText}`));
        } else {
          console.log('');
          console.log(chalk.red(error.message));
        }

        process.exit(1);
      }
    });

  // ll api config
  api
    .command('config')
    .description('Show current API configuration')
    .action(() => {
      console.log(chalk.bold('Current API Configuration:'));
      console.log('');
      console.log(chalk.bold('Base URL:'), Config.getApiUrl());
      const token = Config.getAuthToken();
      console.log(chalk.bold('Auth Token:'), token ? chalk.green('Set') : chalk.gray('Not set'));
    });

  // ll api set-url <url>
  api
    .command('set-url <url>')
    .description('Set the API base URL')
    .action((url: string) => {
      Config.setApiUrl(url);
      console.log(chalk.green('✓ API URL updated'));
      console.log(chalk.bold('New URL:'), url);
    });
}
