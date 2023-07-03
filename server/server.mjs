import fastify from 'fastify';
import app from './index.mjs';

const server = fastify({
  logger: true
});

server.register(app);

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

