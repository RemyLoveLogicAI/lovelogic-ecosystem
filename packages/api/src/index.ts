import Fastify from 'fastify';
import { config } from './config';
import { healthRoutes } from './routes/health';
import { landingRoutes } from './routes/landing';

const fastify = Fastify({
  logger: {
    level: config.logLevel,
  },
});

// Register routes
fastify.register(landingRoutes);
fastify.register(healthRoutes);

// Echo endpoint for testing
fastify.get('/echo', async (request: any, reply) => {
  const { message = 'Hello World' } = request.query as { message?: string };
  return reply.send({
    echo: message,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, closing server...`);
    await fastify.close();
    process.exit(0);
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });

    fastify.log.info('╔════════════════════════════════════════════╗');
    fastify.log.info('║      LoveLogic API - LogicStarter         ║');
    fastify.log.info('╚════════════════════════════════════════════╝');
    fastify.log.info('');
    fastify.log.info(`🚀 Server running on: http://localhost:${config.port}`);
    fastify.log.info(`📊 Health check: http://localhost:${config.port}/health`);
    fastify.log.info(`🌐 Production URL: https://api.lovelogic.cloud (pending DNS)`);
    fastify.log.info(`📦 Version: ${config.version}`);
    fastify.log.info(`🔧 Environment: ${config.nodeEnv}`);
    fastify.log.info('');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
