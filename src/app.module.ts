import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { SensorData } from './sensor-data/sensor-data.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [SensorData],
      synchronize: true,
    }),
    SensorDataModule,
  ],
})
export class AppModule {}