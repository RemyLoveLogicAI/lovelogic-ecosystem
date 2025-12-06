# Nexus AI

**Autonomous AI agent ecosystem with browser automation, vision, and voice capabilities.**

## Overview

Nexus AI is a modular system for building autonomous AI agents that can:

1. **@nexus/core** - Autonomous agent engine with goal-driven planning
2. **@nexus/cli** - Unified command-line interface (`nx` or `nexus`)
3. **@nexus/browser** - Browser automation with Puppeteer
4. **@nexus/vision** - Vision/VLM integration for screen analysis
5. **@nexus/voice** - Voice-driven development
6. **@nexus/api** - Backend API service

## Project Structure

```
nexus-ai/
├── packages/
│   ├── api/          # Backend API service
│   ├── browser/      # Browser automation
│   ├── cli/          # Command-line interface
│   ├── core/         # Agent engine
│   ├── vision/       # VLM integration
│   └── voice/        # Voice-driven development
├── package.json
└── pnpm-workspace.yaml
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run CLI
pnpm dev:cli

# Run API
pnpm dev:api
```

## CLI Commands

```bash
# Using the CLI (after build + link)
nx agent run "search for weather in SF"
nx browser open https://example.com
nx browser screenshot
nx browser analyze
```

## License

UNLICENSED - Proprietary

---

**Built with 🤖 Nexus AI**
