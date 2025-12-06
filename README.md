# LoveLogic AI Ecosystem

**Human-first AI technology that combines emotional intelligence ("Love") with computational intelligence ("Logic").**

## Overview

The LoveLogic ecosystem consists of three core components:

1. **LogicStarter** - Core AI agent engine for reasoning, task execution, and automation
2. **DevMesh** - Unified CLI for orchestrating AI development platforms
3. **VoiceOps** - Voice-driven development and agent control layer

## Project Structure

```
lovelogic-ecosystem/
├── packages/
│   ├── api/          # LogicStarter API backend (api.lovelogic.cloud)
│   ├── devmesh/      # DevMesh CLI tool
│   └── voiceops/     # VoiceOps architecture and design
├── package.json
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Run API in development mode
pnpm dev:api

# Run CLI in development mode
pnpm dev:cli
```

## Packages

### [@lovelogic/api](./packages/api)

LogicStarter API backend - a minimal but extensible HTTP API that will eventually power the LogicStarter agent system.

**Production URL:** `https://api.lovelogic.cloud` (pending DNS configuration)

### [@lovelogic/devmesh](./packages/devmesh)

DevMesh CLI - a unified developer interface for orchestrating AI platforms like Genspark, Replit, and Manus.

**CLI Command:** `ll` or `lovelogic`

### [@lovelogic/voiceops](./packages/voiceops)

VoiceOps - voice-driven development architecture integrating STT → intent parsing → DevMesh execution → TTS.

## Domains

The LoveLogic ecosystem uses the following domains:

- **lovelogic.cloud** - Backend infrastructure and API services
  - `api.lovelogic.cloud` - LogicStarter API
  - `agents.lovelogic.cloud` - Agent management (future)
  - `status.lovelogic.cloud` - Health/status pages (future)

- **lovelogic.me** - Personal/founder identity space
  - `ceo.lovelogic.me` - Founder profile (future)
  - `id.lovelogic.me` - Personal AI twin (future)

## Development Workflow

1. Make changes to packages
2. Run `pnpm build` to compile TypeScript
3. Test locally before deploying
4. See individual package READMEs for specific instructions

## License

UNLICENSED - Proprietary software for LoveLogic AI

---

**Built with ❤️ + 🧠 by LoveLogic AI**
