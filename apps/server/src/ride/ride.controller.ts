import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { ConfirmRideDTO, EstimateRideCreatedDTO, EstimateRideDTO, ListRidesDTO } from '@server/dto/ride.dto';
import { addressValidationPipe, idValidationPipe, IdDTO } from '@server/dto/common';
import { z } from 'zod';
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
    type: ConfirmRideDTO,
  })
  @UseZodGuard('body', ConfirmRideDTO)
  @ZodSerializerDto(EstimateRideCreatedDTO)
  async confirmRide(@Body() ride: ConfirmRideDTO) {
    try {
      await this.rideService.confirmRide(ride);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  @Get("ride/:customer_id")
  @ApiQuery({
    name: 'driver_id',
    type: 'string',
    description: 'Driver id',
    required: false,
  })
  @UseZodGuard('params', IdDTO)
  @ApiOperation({
    description: 'Get Rides of an user / Busca corridas de um usuario',
    summary: 'getUserRides',
    operationId: 'getUserRides',
  })
  @ApiOkResponse({
    type: ListRidesDTO,
  })
  async getUserRides(@Param('customer_id') customerId: string,@Query('driver_id', idValidationPipe) driverId: string) {
    try {
      const result = await this.rideService.getRides(customerId, driverId)
      if (!result || result.rides.length === 0) {
        throw new NotFoundException({
          error_code: 'NO_RIDES_FOUND',
          error_description: 'Nenhuma corrida encontrada para os critérios fornecidos.',
        });
      }
      return result;
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
  @ApiOkResponse({
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
