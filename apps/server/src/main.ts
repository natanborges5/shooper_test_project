import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmetSecurityConfig } from './helmet';
import cookieParser from 'cookie-parser';
import { env } from './global/env.config';
import { patchNestJsSwagger } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { Logger } from '@nestjs/common';
const globalPrefix = '/api';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  app.use(helmetSecurityConfig);
  app.use(cookieParser(env.JWT_SECRET));
  app.enableCors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    // allowedHeaders: ['Content-Type'],
    credentials: true,
  });
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setOpenAPIVersion('3.1.0')
    .setTitle('Shooper Travel API')
    .setDescription('Server API')
    .addTag('auth', 'Auth API')
    .addTag('users', 'Users API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document, {
    jsonDocumentUrl: `${globalPrefix}/openapi.json`,
    yamlDocumentUrl: `${globalPrefix}/openapi.yaml`,
    explorer: true,
    customSiteTitle: 'Shooper Travel API',
  });
  if (env.NODE_ENV === 'development') {
    fs.writeFileSync('./openapi.yaml', yaml.stringify(document));
  }
  await app.listen(env.BACKEND_PORT ?? env.PORT, () => {
    Logger.log(
      `Server is running in [${env.NODE_ENV}] mode on [http://${env.HOSTNAME}:${env.BACKEND_PORT ?? env.PORT}] with timezone [${env.TZ}]`,
      'bootstrap',
    );
  });
}
bootstrap();
