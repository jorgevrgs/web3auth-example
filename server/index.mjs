import jwt from 'jsonwebtoken';
import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import packageJson from '../package.json' assert { type: 'json' };

const app = async (fastify, opts) => {
  await fastify.register(fp(cors), {
    origin: '*',
    exposedHeaders: true
  });

  fastify.get('/', async (request, reply) => {
    return {
      status: 'success',
      version: packageJson.version
    }
  });

  fastify.get('/api/jwks', async (request, reply) => {
    return {
      keys: [
        {
          "kty": "RSA",
          "n": process.env.RSA_MODULUS,
          "e": "AQAB",
          "kid": process.env.RSA_KID,
          "alg": "RS256",
          "use": "sig"
        }
      ]
    }
  });

  fastify.post('/api/token', async (request, reply) => {
    const privateKeyBase64 = process.env.RSA_PRIVATE_KEY_BASE64;
    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');

    const A_HOUR_IN_SECONDS = 60 * 60 * 1;
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + A_HOUR_IN_SECONDS;

    const payload = {
      sub: request.body.sub,
      email: request.body.email,
      aud: process.env.JWT_AUDIENCE,
      iss: process.env.ISSUER,
      iat: issuedAt,
      exp: expiresAt
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      keyid: process.env.RSA_KEY_ID
    });

    return { token };
  })
}

export default app;

