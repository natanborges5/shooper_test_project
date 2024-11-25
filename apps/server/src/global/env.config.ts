import { Logger } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { StrToIntNumberSchema } from 'src/dto/common';
import { z } from 'zod';

export const EnvConfigSchema = z
  .object({
    TZ: z
      .string()
      .default('America/Sao_Paulo')
      .describe('The timezone the app is running in'),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('production')
      .describe('The environment the app is running in'),

    HOSTNAME: z
      .string()
      .default('0.0.0.0')
      .describe('The host the app is running on'),

    PORT: StrToIntNumberSchema.default(3000).describe(
      'The port the app is running on',
    ),
    BACKEND_PORT: StrToIntNumberSchema.optional().describe(
      'The port the app is running on',
    ),
    FRONTEND_PORT: StrToIntNumberSchema.optional().describe(
      'The port the frontend app is running on',
    ),
    DATABASE_URL: z
      .string()
      .url()
      .describe('The URL of the Postgres database')
      .default(
        'postgresql://postgres:postgres@localhost:5432/postgres?schema=public',
      ),
    REDIS_URL: z
      .string()
      .url()
      .describe('The URL of the Redis database')
      .default('redis://localhost:6379'),
    NEXT_PUBLIC_BACKEND_URL: z
      .string()
      .url()
      .describe('The URL for Backend Server')
      .optional()
      .default('http://localhost:5000'),
    NEXT_PUBLIC_FRONTEND_URL: z
      .string()
      .url()
      .describe('The URL for Frontend Server')
      .optional()
      .default('http://localhost:3000'),
    JWT_ISSUER: z.string().default('shooperTravelNMB'),
    JWT_SECRET: z.string().default('7f3c8b291d3d4bcf9a8ac9d7d6f1f237'),
    JWT_EXPIRES: z.string().default('7d'),
    JWT_COOKIE_NAME: z.string().optional().default('__Secure-Shooper-Session'),
    CORS_ORIGINS: z
      .string()
      .optional()
      .default('')
      .transform((val) => {
        return val.split(',').map((origin) => origin.trim());
      }),
  })
  .transform((data) => {
    data.BACKEND_PORT = data.BACKEND_PORT ?? data.PORT ?? 8080;
    data.CORS_ORIGINS = [
      ...data.CORS_ORIGINS,
      data.NEXT_PUBLIC_BACKEND_URL,
      data.NEXT_PUBLIC_FRONTEND_URL,
    ];
    if (data.NODE_ENV === 'development') {
      data.CORS_ORIGINS.push(`http://localhost:${data.FRONTEND_PORT ?? 3000}`);
      data.CORS_ORIGINS.push(`http://localhost:${data.BACKEND_PORT}`);
    }
    data.CORS_ORIGINS = [
      ...new Set(data.CORS_ORIGINS.filter((origin) => !!origin)),
    ];
    return data;
  });

export class EnvConfig extends createZodDto(EnvConfigSchema) {
  private static instance: EnvConfig;
  public static getInstance() {
    if (!EnvConfig.instance) {
      EnvConfig.instance = EnvConfig.parse();
    }
    process.env.TZ = EnvConfig.instance.TZ;
    return EnvConfig.instance;
  }

  private constructor() {
    super();
  }

  static parse() {
    const parsed = EnvConfig.schema.safeParse(process.env);
    if (!EnvConfig.instance) {
      if (parsed.success) {
        EnvConfig.instance = parsed.data;
        return parsed.data;
      }
      Logger.error(
        `Some environment variables are invalid or not set: ${JSON.stringify(
          parsed.error.errors,
          null,
          2,
        )}`,
        'EnvConfig',
      );
      process.exit(1);
    }
    Logger.log('Environment variables validated and loaded', 'EnvConfig');
    return EnvConfig.instance;
  }
}

export const env = EnvConfig.getInstance();

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }
}
