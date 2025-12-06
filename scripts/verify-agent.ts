
import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';

async function verifyAgent() {
    console.log(chalk.blue('Running Verification: Phase 6 - The Navigator Agent 🦅\n'));

    // We will verify by running the CLI command directly
    // This tests the full integration: CLI -> Agent -> Browser + Vision + Planner

    console.log(chalk.bold('Testing Goal: "Click Login Button"'));

    try {
        const output = await executeInCLI(['agent', 'run', 'Click Login Button']);
        console.log(output);

        // Verification Checks
        const checks = [
            { text: 'Agent Goal: Click Login Button', label: 'Goal Initialization' },
            { text: '[BrowserController] Taking screenshot', label: 'Observation (Screenshot)' },
            { text: '[VisionClient] Analyzing image', label: 'Vision Analysis' },
            { text: 'Thinking...', label: 'Planning Step' },
            { text: 'Plan: click', label: 'Action Decision' },
            { text: 'Goal Achieved', label: 'Loop Completion' }
        ];

        let allPass = true;
        checks.forEach(check => {
            if (output.includes(check.text)) {
                console.log(chalk.green(`✓ ${check.label}`));
            } else {
                console.error(chalk.red(`✖ Missing: ${check.label} (Expected text: "${check.text}")`));
                allPass = false;
            }
        });

        if (allPass) {
            console.log(chalk.green('\n✅ Phase 6 Verified: The Agent can Observe, Plan, and Act!'));
        } else {
            console.error(chalk.red('\n✖ Phase 6 Verification Failed: Missing key steps in log.'));
            process.exit(1);
        }

    } catch (e: any) {
        console.error(chalk.red('CLI Execution failed:'), e.message);
        process.exit(1);
    }
}

async function executeInCLI(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        const cmd = 'npx';
        const cmdArgs = ['tsx', 'packages/devmesh/src/index.ts', ...args];

        console.log(`> ${cmd} ${cmdArgs.join(' ')}`);

        const child = spawn(cmd, cmdArgs, {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: path.resolve(__dirname, '../')
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Command failed with code ${code}\nStderr: ${errorOutput}`));
            }
        });
    });
}

verifyAgent().catch(console.error);
