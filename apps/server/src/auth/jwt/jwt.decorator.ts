import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';

export const Roles = Reflector.createDecorator<string[]>();

export const JwtAuth = () =>
  applyDecorators(UseGuards(JwtGuard), ApiBearerAuth());
