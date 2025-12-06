import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      service: 'LoveLogic API',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: config.version,
    });
  });
}
