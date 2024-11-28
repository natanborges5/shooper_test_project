import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  Res,
  Session,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CredentialsLoginDTO, PublicUserDTO, SignUpDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { env, EnvConfig } from 'src/global/env.config';
import datefns from 'date-fns';
import { JwtTokenDTO, SessionDTO } from 'src/dto/jwt.dto';
import { JwtAuth } from 'src/auth/jwt/jwt.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
@Controller('auth')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly userService: UserService,
  ) {}
  private responseSessionToken(
    jwtToken: JwtTokenDTO,
    request: Request,
    response: Response,
  ) {
    const domains = env.CORS_ORIGINS.map((url) => {
      const { hostname, port } = new URL(url);
      let domain = hostname;
      if (port) {
        domain += `:${port}`;
      }
      return domain;
    });
    if (
      domains.find((domain) => domain.startsWith(request.hostname)) ||
      env.NODE_ENV !== 'production'
    ) {
      response.cookie(
        this.configService.getOrThrow('JWT_COOKIE_NAME'),
        Buffer.from(jwtToken.token, 'utf8').toString('base64'),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          // signed: true,
          priority: 'high',
          expires: datefns.addDays(Date.now(), 7),
        },
      );
    }
    response.send(jwtToken);
    return jwtToken;
  }
  @Post('sign-up')
  @ApiOperation({ operationId: 'signUp' })
  async signUp(@Body() data: SignUpDTO) {
    try {
      return await this.userService.signup(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('login/credentials')
  @ApiOperation({ operationId: 'credentialsLogin' })
  @ApiCreatedResponse({
    type: JwtTokenDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Email or Password not exits or matches',
  })
  async login(
    @Body() body: CredentialsLoginDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const jwtToken = await this.userService.credentialsLogin(body);
    return this.responseSessionToken(jwtToken, request, response);
  }

  @Get('session')
  @ApiOperation({ operationId: 'session' })
  @ApiOkResponse({
    type: SessionDTO,
  })
  @JwtAuth()
  async session(@Session() session: SessionDTO) {
    return session;
  }
  @Get('users')
  @ApiOperation({ operationId: 'getAllUsers' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    description: 'Driver role',
    required: true,
  })
  @ApiOkResponse({
    type: PublicUserDTO,
    isArray: true,
  })
  async getAllUsers(@Query('role', new ParseEnumPipe(Role)) role: Role) {
    try {
      return await this.userService.listUsers(role);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Post('logout')
  @ApiOperation({ operationId: 'logout' })
  async logout(@Req() request: Request, @Res() response: Response) {
    response.cookie(this.configService.getOrThrow('JWT_COOKIE_NAME'), '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      priority: 'high',
      expires: new Date(),
    });
    response.status(HttpStatus.OK).send();
  }
}
