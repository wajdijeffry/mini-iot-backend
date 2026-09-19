import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensor_name: string;

  @Column('float')
  value: number;

  @CreateDateColumn()
  timestamp: Date;
}