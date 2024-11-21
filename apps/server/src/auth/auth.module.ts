import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../global/env.config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService<EnvConfig>) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            issuer: configService.get('JWT_ISSUER'),
            algorithm: 'HS512',
            expiresIn: configService.get('JWT_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [AuthController],
})
export class AuthModule {}
