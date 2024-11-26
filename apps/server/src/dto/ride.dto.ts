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
  distance: z.string(),
  duration: z.string(),
  driver: z.object({
    id: z.string(),
    name: z.string()
  }),
  value: z.number(),
});

export class ConfirmRideDTO extends createZodDto(ConfirmRideSchema) {}