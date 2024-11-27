import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const EstimateRideSchema = z.object({
  customer_id: z.string().uuid(),
  origin: z.string().min(4),
  destination: z.string().min(4),
});

export class EstimateRideDTO extends createZodDto(EstimateRideSchema) {}
export const EstimateRideCreatedSchema = z.object({
  origin: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  distance: z.number(),
  duration: z.string(),
  options: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    vehicle: z.string(),
    review: z.object({
      rating: z.number(),
      comment: z.string()
    }),
    value: z.number()
  })),
  routeResponse: z.record(z.any())
});
export class EstimateRideCreatedDTO extends createZodDto(EstimateRideCreatedSchema) {}

export const ConfirmRideSchema = z.object({
  customer_id: z.string().uuid(),
  origin: z.string().min(4),
  destination: z.string().min(4),
  distance: z.number(),
  duration: z.string(),
  driver: z.object({
    id: z.string(),
    name: z.string()
  }),
  value: z.number(),
});

export class ConfirmRideDTO extends createZodDto(ConfirmRideSchema) {}

const RideSchema = z.object({
  id: z.string(),
  date: z.string().datetime(), // Use `.datetime()` para validar um ISO 8601 datetime string
  origin: z.string(),
  destination: z.string(),
  distance: z.number(),
  duration: z.string(), // Pode ser ajustado para um formato específico, se necessário
  driver: z.object({
    id: z.string(),
    name: z.string(),
  }),
  value: z.number(),
});
const ListRidesSchema = z.object({
  customer_id: z.string(),
  rides: z.array(RideSchema)
})
export class ListRidesDTO extends createZodDto(ListRidesSchema) {}