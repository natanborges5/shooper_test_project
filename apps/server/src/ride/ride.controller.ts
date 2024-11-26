import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Session,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UseZodGuard, ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';
import { JwtAuth } from '@server/auth/jwt/jwt.decorator';
import { CreateRideDTO } from '@server/dto/google-maps.dto';
import { RideService } from './ride.service';
@Controller('ride')
@ApiTags('ride')
@JwtAuth()
@UsePipes(ZodValidationPipe)
export class RideController {
  private readonly logger = new Logger(RideController.name);
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({
    description: 'Ride Registration / Cadastro de Corrida',
    summary: 'createRide',
    operationId: 'createRide',
  })
  @ApiBody({
    type: CreateRideDTO,
  })
  @UseZodGuard('body', CreateRideDTO)
  // @ZodSerializerDto(any)
  // @ApiCreatedResponse({
  //   type: any,
  // })
  async createRide(@Body() orderItem: CreateRideDTO) {
    try {
      const result = await this.createRide(orderItem);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
