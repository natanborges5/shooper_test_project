import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string(),
  role: z.nativeEnum(Role),
});

export class SignUpDTO extends createZodDto(SignUpSchema) {}

export const CredentialsLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class CredentialsLoginDTO extends createZodDto(CredentialsLoginSchema) {}
export const PublicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(3),
});
export class PublicUserDTO extends createZodDto(PublicUserSchema) {}