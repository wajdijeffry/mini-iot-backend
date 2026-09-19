import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SensorData } from './sensor-data.entity';
import { SensorDataController } from './sensor-data.controller';
import { SensorIngestionService } from './sensor-ingestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData]), HttpModule],
  controllers: [SensorDataController],
  providers: [SensorIngestionService],
})
export class SensorDataModule {}
