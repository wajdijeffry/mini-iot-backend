import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './sensor-data.entity';
import { SensorIngestionService } from './sensor-ingestion.service';

@Controller('api/sensor-data')
export class SensorDataController {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly ingestionService: SensorIngestionService,
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

  @Post('location')
  setLocation(@Body() body: { latitude: number; longitude: number }) {
    this.ingestionService.setLocation(body.latitude, body.longitude);
    return { success: true, latitude: body.latitude, longitude: body.longitude };
  }
}