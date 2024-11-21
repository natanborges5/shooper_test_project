import helmet from 'helmet';
import { env } from './global/env.config';

export const helmetSecurityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", ...env.CORS_ORIGINS],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        ...env.CORS_ORIGINS,
      ],
      styleSrc: ["'self'", "'unsafe-inline'", ...env.CORS_ORIGINS],
      imgSrc: ["'self'", 'data:', ...env.CORS_ORIGINS],
      connectSrc: ["'self'", ...env.CORS_ORIGINS, 'wss:'], // Allow WebSocket connections
      fontSrc: ["'self'", 'data:', ...env.CORS_ORIGINS],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", ...env.CORS_ORIGINS],
      frameSrc: ["'self'", ...env.CORS_ORIGINS],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  xssFilter: true,
  noSniff: true,
  ieNoOpen: true,
  hidePoweredBy: true,
});
