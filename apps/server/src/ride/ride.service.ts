import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}
}