import { Global, Module } from '@nestjs/common';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
@Global()
@Module({
  providers: [RideService],
  controllers: [RideController],
  exports: [RideService],
})
export class RideModule {}
