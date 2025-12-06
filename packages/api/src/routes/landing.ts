import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const landingHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LoveLogic API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 600px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .tagline {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      font-weight: 300;
    }
    .status {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .link {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .link:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.875rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>LoveLogic AI</h1>
    <p class="tagline">Human-first AI technology combining ❤️ Love + 🧠 Logic</p>

    <div class="status">
      <span class="status-indicator"></span>
      <strong>API Status:</strong> Online
    </div>

    <div class="links">
      <a href="/health" class="link">Health Check</a>
    </div>

    <div class="footer">
      <p>LogicStarter API v0.1.0</p>
      <p>Production endpoint: <code>api.lovelogic.cloud</code></p>
    </div>
  </div>
</body>
</html>
`;

export async function landingRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.type('text/html').send(landingHTML);
  });
}
