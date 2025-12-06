# LogicStarter API

**Core AI agent backend for LoveLogic - Production endpoint: `https://api.lovelogic.cloud`**

## Overview

The LogicStarter API is a minimal but extensible HTTP backend built with Fastify and TypeScript. It serves as the foundation for the LoveLogic AI agent system.

## Features

- ✅ `/health` endpoint - Service health check with version info
- ✅ `/` landing page - Beautiful HTML confirmation page
- ✅ Environment-based configuration
- ✅ Graceful shutdown handling
- ✅ Structured logging
- 🔜 LogicStarter agent orchestration endpoints (future)
- 🔜 Authentication middleware (future)

## Local Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
# From the monorepo root
pnpm install

# Or from this package directory
cd packages/api
pnpm install
```

### Configuration

Copy the example environment file and customize as needed:

```bash
cp .env.example .env
```

Available environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (info/debug/warn/error)

### Running the Server

```bash
# Development mode with auto-reload
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

### Testing Endpoints

```bash
# Health check (JSON)
curl http://localhost:3000/health

# Landing page (HTML)
curl http://localhost:3000/
# Or open in browser: http://localhost:3000
```

Expected health response:

```json
{
  "service": "LoveLogic API",
  "status": "ok",
  "timestamp": "2025-12-05T07:26:43.123Z",
  "version": "0.1.0"
}
```

## Project Structure

```
packages/api/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── config.ts         # Configuration management
│   └── routes/
│       ├── health.ts     # Health check endpoint
│       └── landing.ts    # Landing page
├── package.json
├── tsconfig.json
└── .env.example
```

## Deployment

### Production Deployment to api.lovelogic.cloud

This API is designed to run behind a reverse proxy (nginx, Caddy, or Cloudflare Tunnel) that handles:

- HTTPS/TLS termination
- Domain routing to `api.lovelogic.cloud`
- Rate limiting (optional)
- CORS headers (if needed)

**Example nginx configuration:**

```nginx
server {
  listen 443 ssl http2;
  server_name api.lovelogic.cloud;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Docker deployment (optional):**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Environment Variables for Production

```bash
PORT=3000
NODE_ENV=production
LOG_LEVEL=warn
```

## Extension Points

The API is designed to be extended with:

1. **LogicStarter Agent Routes** - Add routes under `/v1/logicstarter/*` for agent orchestration
2. **Authentication** - Add middleware for API key or JWT validation
3. **Rate Limiting** - Add Fastify rate-limit plugin
4. **Database Integration** - Add MongoDB/PostgreSQL for agent state persistence
5. **WebSocket Support** - Add real-time agent communication

Example future route structure:

```
/health                          # Health check
/v1/logicstarter/agents          # List agents
/v1/logicstarter/agents/:id      # Get agent details
/v1/logicstarter/execute         # Execute agent task
/v1/logicstarter/status/:taskId  # Check task status
```

## License

UNLICENSED - Proprietary software for LoveLogic AI
