import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateRideDTO } from '@server/dto/google-maps.dto';
import { EnvConfig } from '@server/global/env.config';

@Injectable()
export class GoogleMapsService extends Client {
  private readonly accessKey = this.config.get("GOOGLE_API_KEY");

  constructor(private config: ConfigService<EnvConfig>) {
    super();
  }
  async getCoordinates(address: string) {
    const googleRes = await this.geocode({
      params: {
        address: `${address}`,
        key: this.accessKey,
      },
    });

    return googleRes.data;

  }
  async getDistanceMatrix(data: CreateRideDTO) {
    const googleRes = await this.distancematrix({
      params: {
        destinations: [{
          latitude: data.destination.latitude,
          longitude: data.destination.longitude,
        }],
        origins: [
          {
            latitude: data.origin.latitude,
            longitude: data.origin.longitude,
          }
        ],
        key: this.accessKey,
      },
    });

    return googleRes.data;
  }
}