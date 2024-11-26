import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Session,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UseZodGuard, ZodValidationPipe } from 'nestjs-zod';
import { JwtAuth } from '@server/auth/jwt/jwt.decorator';
import { GoogleMapsService } from './google.maps.service';
import { GetCoordinatesDTO } from '@server/dto/google-maps.dto';
import { GeocodeResponseData } from '@googlemaps/google-maps-services-js';
@Controller('maps')
@ApiTags('maps')
@JwtAuth()
@UsePipes(ZodValidationPipe)
export class GoogleMapsController {
  private readonly logger = new Logger(GoogleMapsController.name);
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  @Post("coordinates")
  @ApiOperation({
    description: 'Get coordinates / Busca as coordenadas',
    summary: 'getCoordinates',
    operationId: 'getCoordinates',
  })
  @ApiBody({
    type: GetCoordinatesDTO,
  })
  @UseZodGuard('body', GetCoordinatesDTO)
  // @ZodSerializerDto(GeocodeResponseData)
  // @ApiCreatedResponse({
  //   type: GeocodeResponseData,
  // })
  async getCoordinates(@Body() address: GetCoordinatesDTO) {
    try {
      const result = await this.googleMapsService.getCoordinates(address.address);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
