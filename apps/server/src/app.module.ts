import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [AuthModule, GlobalModule, RideModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
