import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { JwtPayloadDTO, JwtTokenDTO } from 'src/dto/jwt.dto';
import { CredentialsLoginDTO, SignUpDTO } from 'src/dto/user.dto';
import { EnvConfig } from 'src/global/env.config';
import { Password } from 'src/global/password';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}
  signJwtToken(payload: JwtPayloadDTO) {
    const token = this.jwtService.sign(payload);
    return JwtTokenDTO.schema.parse({
      type: 'Bearer',
      token,
      expiryAt: this.configService.get('JWT_EXPIRES'),
    });
  }
  async signup(data: SignUpDTO) {
    const userWithConflict = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userWithConflict) {
      throw new ConflictException(`User with this email already exists`);
    }
    const user = await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: await Password.generateHash(
            data.password,
          ),
          role: data.role,
        },
      });
    });
    return user;
  }
  async listUsers(){
    return await this.prisma.user.findMany({
      where: {
        role: "passenger"
      },
      select:{
        id: true,
        name: true,
        email: true,
      }
    })
  }
  async credentialsLogin(body: CredentialsLoginDTO): Promise<JwtTokenDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user)
      throw new UnauthorizedException('Email or Password not exits or matches');
    const passwordValidated = await Password.compareHash(
      body.password,
      `${user.password}`,
    );
    if (!passwordValidated) {
      throw new UnauthorizedException('Email or Password not exits or matches');
    }
    return this.signJwtToken({
      id: user.id,
    });
  }
  async findSession(id: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
      },
    });
  }
}
