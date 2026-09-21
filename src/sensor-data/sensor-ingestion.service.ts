import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SensorData } from './sensor-data.entity';

// Default coordinates, used until the frontend sends the user's real location
const DEFAULT_LATITUDE = 2.73;
const DEFAULT_LONGITUDE = 101.94;

@Injectable()
export class SensorIngestionService implements OnModuleInit {
  private readonly logger = new Logger(SensorIngestionService.name);
  private latitude = DEFAULT_LATITUDE;
  private longitude = DEFAULT_LONGITUDE;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
  ) {}

  // Called by the controller when the frontend sends real geolocation
  setLocation(latitude: number, longitude: number): void {
    this.latitude = latitude;
    this.longitude = longitude;
    this.logger.log(`Location updated to lat=${latitude}, lon=${longitude}`);
    // Fetch immediately with the new location instead of waiting for the next cron tick
    this.fetchAndStoreReading();
  }

  async onModuleInit() {
    await this.fetchAndStoreReading();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.fetchAndStoreReading();
  }

  private async fetchAndStoreReading(): Promise<void> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m`;

      const response = await firstValueFrom(this.httpService.get(url));
      const current = response.data?.current;

      if (!current || typeof current.temperature_2m !== 'number') {
        this.logger.warn('Open-Meteo response missing expected fields');
        return;
      }

      const reading = this.sensorDataRepository.create({
        sensor_name: 'outdoor_temperature',
        value: current.temperature_2m,
      });

      await this.sensorDataRepository.save(reading);
      this.logger.log(`Saved reading: ${current.temperature_2m}°C`);

      if (typeof current.relative_humidity_2m === 'number') {
        const humidityReading = this.sensorDataRepository.create({
          sensor_name: 'outdoor_humidity',
          value: current.relative_humidity_2m,
        });
        await this.sensorDataRepository.save(humidityReading);
      }
    } catch (error) {
      this.logger.error('Failed to fetch/store sensor data', error instanceof Error ? error.message : String(error));
    }
  }
}