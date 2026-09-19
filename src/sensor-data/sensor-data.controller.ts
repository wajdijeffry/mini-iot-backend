import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './sensor-data.entity';

@Controller('api/sensor-data')
export class SensorDataController {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
  ) {}

  @Get()
  async getSensorData(@Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 50;

    const history = await this.sensorDataRepository.find({
      order: { timestamp: 'DESC' },
      take,
    });

    return {
      latest: history[0] ?? null,
      history,
    };
  }
}