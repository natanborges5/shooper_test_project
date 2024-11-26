import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { RideModule } from './ride/ride.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';

@Module({
  imports: [AuthModule, GlobalModule, RideModule, GoogleMapsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
