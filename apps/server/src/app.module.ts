import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [AuthModule, GlobalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
