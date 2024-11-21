import { Global, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  PrismaModule,
  loggingMiddleware,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { EnvConfig } from './env.config';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig.parse],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
        explicitConnect: false,
        prismaOptions: {
          errorFormat: 'pretty',
          log: ['info', 'query', 'warn', 'error'],
        },
      },
    }),
  ],
  exports: [AuthModule],
  providers: [
    providePrismaClientExceptionFilter({
      // Prisma Error Code: HTTP Status Response
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    AuthModule,
  ],
})
export class GlobalModule {}
