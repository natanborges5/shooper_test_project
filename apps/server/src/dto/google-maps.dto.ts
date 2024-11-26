import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateRideSchema = z
  .object({
    origin: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    destination: z.object({
      latitude: z.number(),
      longitude: z.number()
    })
  })

export class CreateRideDTO extends createZodDto(CreateRideSchema) {}
const address = z
  .object({
    address: z.string()
  })

export class GetCoordinatesDTO extends createZodDto(address) {}