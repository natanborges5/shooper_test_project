import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/global/env.config';
import { UserService } from 'src/auth/user.service';
import { JwtPayloadDTO, SessionDTO } from 'src/dto/jwt.dto';
import { JwtExtractor } from './jwt-extractor';

@Injectable()
@ApiBearerAuth()
export class JwtGuard implements CanActivate {
  logger: Logger = new Logger('JwtGuard');
  constructor(
    protected readonly configService: ConfigService<EnvConfig>,
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionCookie = Buffer.from(
      request.cookies[this.configService.getOrThrow('JWT_COOKIE_NAME')] ?? '',
      'base64',
    ).toString('utf8');
    let token: string | undefined = '';
    if (sessionCookie) {
      request.headers.authorization = `Bearer ${sessionCookie}`;
    }
    if (request.headers.authorization) {
      token = JwtExtractor.extractFromAuthHeader(request.headers.authorization);
    }
    if (!token) {
      throw new UnauthorizedException('No jwt session');
    }
    try {
      const verified = this.jwtService.verify(token);
      const payload = JwtPayloadDTO.schema.parse(verified);
      request['session'] = SessionDTO.schema.parse({
        ...payload,
        ...(await this.userService.findSession(payload.id)),
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid jwt session');
    }
    return true;
  }
}
