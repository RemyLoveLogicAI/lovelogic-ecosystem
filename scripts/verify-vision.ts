
import { BasicIntentParser } from '../packages/voiceops/src/intent/parser';
import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';

async function verifyVision() {
    console.log(chalk.blue('Running Verification: Phase 5 - VLM Integration (The Eyes) 👁️\n'));

    // 1. Initialize VoiceOps
    console.log(chalk.bold('Step 1: VoiceOps Parsing'));
    const parser = new BasicIntentParser();
    const res = await parser.parse("What do you see?");

    if (res.intent === 'browser.analyze') {
        console.log(chalk.green('✓ "What do you see?" -> intent: browser.analyze'));
    } else {
        console.error(chalk.red('✖ Failed to parse analyze intent'));
        process.exit(1);
    }

    // 2. Execute CLI Command
    console.log(chalk.bold('\nStep 2: CLI Execution (VisionClient)'));
    const cliPath = path.resolve(__dirname, '../packages/devmesh/src/index.ts');

    try {
        const output = await executeInCLI(['browser', 'analyze']);
        console.log(output);

        if (output.includes('[MOCK VLM]')) {
            console.log(chalk.green('✓ VLM Provider invoked successfully'));
            console.log(chalk.green('✓ Mock description received'));
        } else {
            console.error(chalk.red('✖ Output missing Mock VLM signature'));
            process.exit(1);
        }

    } catch (e: any) {
        console.error(chalk.red('CLI Execution failed:'), e.message);
        process.exit(1);
    }

    console.log(chalk.green('\n✅ Phase 5 Verified: System has "Sight" (Mock VLM active)'));
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

verifyVision().catch(console.error);
