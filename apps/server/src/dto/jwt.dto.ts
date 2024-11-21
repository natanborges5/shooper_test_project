import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export enum TokenType {
  BEARER = 'Bearer',
}

export const JwtTokenSchema = z.object({
  type: z
    .nativeEnum(TokenType)
    .default(TokenType.BEARER)
    .describe('Token Type'),
  token: z.string().describe('JWT Token Type'),
  expiryAt: z.string().describe('Expiration At'),
});

export class JwtTokenDTO extends createZodDto(JwtTokenSchema) {}

export const JwtPayloadSchema = z.object({
  id: z.string().uuid(),
  iss: z.string().nullish(),
  iat: z.number().nullish(),
  exp: z.number().nullish(),
});

export class JwtPayloadDTO extends createZodDto(JwtPayloadSchema) {}

export const SessionSchema = z
  .object({
    id: z.string().uuid(),
    role: z.nativeEnum(Role),
    email: z.string().email(),
    name: z.string(),
    iss: z.string(),
    iat: z.number(),
    exp: z.number(),
  })
  .describe('Account Session Data');

export class SessionDTO extends createZodDto(SessionSchema) {}
