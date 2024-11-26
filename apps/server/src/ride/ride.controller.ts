import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiBody, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
import { UseZodGuard, ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';
import { RideService } from './ride.service';
import { EstimateRideCreatedDTO, EstimateRideDTO } from '@server/dto/ride.dto';
import { addressValidationPipe } from '@server/dto/common';
@Controller('ride')
@ApiTags('ride')
@UsePipes(ZodValidationPipe)
export class RideController {
  private readonly logger = new Logger(RideController.name);
  constructor(private readonly rideService: RideService) {}

  @Post("estimate")
  @ApiOperation({
    description: 'Estimate Ride / Calcular corrida',
    summary: 'estimateRide',
    operationId: 'estimateRide',
  })
  @ApiBody({
    type: EstimateRideDTO,
  })
  @UseZodGuard('body', EstimateRideDTO)
  @ZodSerializerDto(EstimateRideCreatedDTO)
  @ApiCreatedResponse({
    type: EstimateRideCreatedDTO,
  })
  async estimateRide(@Body() ride: EstimateRideDTO) {
    try {
      const result = await this.rideService.estimateRide(ride);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  @Patch("confirm")
  @ApiOperation({
    description: 'Confirm Ride / Confirmar corrida',
    summary: 'confirmRide',
    operationId: 'confirmRide',
  })
  @ApiBody({
    type: EstimateRideDTO,
  })
  @UseZodGuard('body', EstimateRideDTO)
  @ZodSerializerDto(EstimateRideCreatedDTO)
  @ApiCreatedResponse({
    type: EstimateRideCreatedDTO,
  })
  async confirmRide(@Body() ride: EstimateRideDTO) {
    try {
      await this.rideService.estimateRide(ride);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  @Get("address")
  @ApiQuery({
    name: 'street',
    type: 'string',
    description: 'Street name',
    required: true,
  })
  @ApiOperation({
    description: 'Estimate Ride / Calcular corrida',
    summary: 'getAddress',
    operationId: 'getAddress',
  })
  @ApiCreatedResponse({
    type: String,
    isArray: true,
  })
  async getAddress(@Query('street', addressValidationPipe) street: string,) {
    try {
      const result = await this.rideService.getAddresses(street)
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
