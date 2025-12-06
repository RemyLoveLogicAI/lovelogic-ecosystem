# DevMesh CLI

**Unified CLI for orchestrating AI development platforms**

## Overview

DevMesh is a powerful command-line interface that provides a unified way to interact with multiple AI development platforms. Currently supports LogicStarter API, with plugin architecture for future platform integrations (Genspark, Replit, Manus, etc.).

## Installation

### From Monorepo

```bash
# From the monorepo root
pnpm install
pnpm build

# Link globally
cd packages/devmesh
pnpm link --global
```

### Standalone Installation (Future)

```bash
npm install -g @lovelogic/devmesh
```

## Usage

DevMesh provides two command aliases:

- `ll` - Short form (recommended)
- `lovelogic` - Full form

### Core Commands

```bash
# Verify CLI is working
ll ping

# Check LogicStarter API health
ll api health

# Show API configuration
ll api config

# Set API endpoint URL
ll api set-url http://localhost:3000
ll api set-url https://api.lovelogic.cloud

# Show all configuration
ll config show

# Reset configuration to defaults
ll config reset

# Show help
ll --help
ll api --help
```

### Global Options

```bash
-v, --verbose          Enable verbose output
-c, --config <path>    Path to custom config file
--version              Show version number
--help                 Show help
```

## Configuration

DevMesh stores configuration in `~/.config/lovelogic-devmesh/config.json`

Default configuration:

```json
{
  "apiBaseUrl": "http://localhost:3000",
  "verbose": false
}
```

### Configuration Management

```bash
# View current configuration
ll config show

# Set API URL
ll api set-url https://api.lovelogic.cloud

# Reset to defaults
ll config reset
```

## Plugin Architecture

DevMesh is designed with a plugin system for future platform integrations. Each platform plugin can register its own commands and functionality.

### Plugin Interface

```typescript
interface PlatformPlugin {
  name: string;
  version: string;
  commands: PluginCommand[];
  initialize: () => Promise<void>;
}

interface PluginCommand {
  name: string;
  description: string;
  execute: (args: string[], options: CommandOptions) => Promise<void>;
}
```

### Planned Platform Integrations

- **Genspark** - `ll genspark <command>`
- **Replit** - `ll replit <command>`
- **Manus** - `ll manus <command>`
- **VoiceOps** - `ll voice <command>` (voice-driven development)

## Development

### Project Structure

```
packages/devmesh/
├── src/
│   ├── index.ts              # Main CLI entry point
│   ├── config.ts             # Configuration management
│   ├── types.ts              # TypeScript interfaces
│   └── commands/
│       ├── ping.ts           # Ping command
│       ├── api.ts            # API commands
│       └── config.ts         # Config commands
├── package.json
└── tsconfig.json
```

### Adding New Commands

1. Create a new file in `src/commands/`
2. Export a function that registers the command
3. Import and call it in `src/index.ts`

Example:

```typescript
// src/commands/example.ts
import { Command } from 'commander';
import chalk from 'chalk';

export function exampleCommand(program: Command): void {
  program
    .command('example')
    .description('Example command')
    .action(() => {
      console.log(chalk.green('Example executed!'));
    });
}

// src/index.ts
import { exampleCommand } from './commands/example';
exampleCommand(program);
```

### Creating a Platform Plugin

```typescript
// plugins/genspark.ts
import { PlatformPlugin } from '@lovelogic/devmesh';

export const gensparkPlugin: PlatformPlugin = {
  name: 'genspark',
  version: '0.1.0',
  commands: [
    {
      name: 'deploy',
      description: 'Deploy to Genspark',
      execute: async (args, options) => {
        // Implementation
      },
    },
  ],
  initialize: async () => {
    // Plugin initialization
  },
};
```

## VoiceOps Integration

DevMesh is designed to work seamlessly with VoiceOps for voice-driven development:

```
Voice Input → STT → Intent Parser → DevMesh Commands → Execution → TTS
```

Voice-safe commands (non-destructive operations):
- `ll ping`
- `ll api health`
- `ll config show`

Commands requiring confirmation:
- `ll api set-url`
- `ll config reset`

## Examples

### Basic Workflow

```bash
# 1. Verify CLI is working
ll ping

# 2. Check if API is running
ll api health

# 3. If API is not running, start it
cd packages/api
pnpm dev

# 4. Switch to production API
ll api set-url https://api.lovelogic.cloud

# 5. Verify connection
ll api health
```

### Troubleshooting

```bash
# API connection refused
ll api health
# Error: Cannot connect to API
# Solution: Make sure API is running (cd packages/api && pnpm dev)

# Reset configuration if something is wrong
ll config reset

# Enable verbose mode for debugging
ll --verbose api health
```

## License

UNLICENSED - Proprietary software for LoveLogic AI
