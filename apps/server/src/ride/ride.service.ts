import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfirmRideDTO, EstimateRideCreatedDTO, EstimateRideDTO, ListRidesDTO } from '@server/dto/ride.dto';
import { EnvConfig } from '@server/global/env.config';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RideService extends Client {
  private readonly logger = new Logger(RideService.name);
  private readonly accessKey = this.config.get("GOOGLE_API_KEY");
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<EnvConfig>
  ) {
    super()
  }

  async estimateRide(data: EstimateRideDTO) {
    const originCoordinates = await this.getCoordinates(data.origin)
    const destinationCoordinates = await this.getCoordinates(data.destination)
    const route = await this.directions({
      params:{
        origin: {
          latitude: originCoordinates.lat,
          longitude: originCoordinates.lng
        },
        destination: {
          latitude: destinationCoordinates.lat,
          longitude: destinationCoordinates.lng
        },
        key: this.accessKey
      }
    })
    const routeLegsData = route.data.routes.at(0)?.legs.at(0)
    if(!routeLegsData) throw new InternalServerErrorException("Route error")
    const distance = routeLegsData.distance.value
    const eligibleDrivers = await this.prisma.driver.findMany({
      where:{
        minKm: {
          lte: distance / 1000
        }
      },
      include: {
        user: true,
        ride: {
          select: {
            review: {
              where: {
                authorRole: "passenger"
              },
              select: {
                rating: true,
                comment: true,
              }
            }
          }
        }
      },
      orderBy: {
        tax: 'asc'
      }
    })
    const result: EstimateRideCreatedDTO = {
      origin: {
        latitude: originCoordinates.lat,
        longitude: originCoordinates.lng
      },
      destination: {
        latitude: destinationCoordinates.lat,
        longitude: destinationCoordinates.lng
      },
      distance,
      duration: routeLegsData.duration.text ?? "",
      options: eligibleDrivers.map((driver) => {
        return {
          id: driver.id,
          description: driver.description,
          name: driver.user.name,
          review: {
            comment: driver.ride.at(0)?.review.at(0)?.comment ?? "No review available",
            rating: driver.ride.at(0)?.review.at(0)?.rating ?? 0,
          },
          value: Number((Number(driver.tax ) * (distance / 1000)).toFixed(2)),
          vehicle: driver.vehicle
        }
      }),
      routeResponse: route.data
    } 
    return result
  }
  async confirmRide(data: ConfirmRideDTO){
    await this.prisma.ride.create({
      data: {
        driverId: data.driver.id,
        destination: data.destination,
        origin: data.origin,
        distance: Number(data.distance),
        duration: data.duration,
        passengerId: data.customer_id,
        status: "confirmed",
        value: data.value
      }
    })
  }
  async getRides(customer_id: string, driver_id?: string){
    this.logger.log(driver_id)
    const rides = await this.prisma.ride.findMany({
      where:{
        passengerId: customer_id,
        ...driver_id ? {
          driverId: driver_id
        } : undefined
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        driver: {
          include: {
            user: true,
          }
        },
      }
    })
    const result: ListRidesDTO = {
      customer_id,
      rides: rides.map(ride => {
        return {
          id: ride.id,
          date: ride.createdAt.toString(),
          origin: ride.origin,
          destination: ride.destination,
          distance: ride.distance,
          duration: ride.duration,
          driver: {
            id: ride.driverId,
            name: ride.driver.user.name
          },
          value: ride.value
        }
      })
    }
    return result
  }
  async getCoordinates(address: string): Promise<LatLngLiteral> {
    const googleRes = await this.geocode({
      params: {
        address: address,
        key: this.accessKey,
      },
    });

    const { lng, lat } = googleRes.data.results[0].geometry.location;
    return { lng, lat };
  }
  async getAddresses(address: string): Promise<string[]> {
    const googleRes = await this.geocode({
      params: {
        address: address,
        key: this.accessKey,
      },
    });
    const result = googleRes.data.results.map((address) => address.formatted_address);
    return result
  }
}