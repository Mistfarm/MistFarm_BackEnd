import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.entity';

@Entity({ name: 'device' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  deviceId: string;

  @Column({ name: 'zone_id' })
  zoneId: string;

  @ManyToOne(() => Zone)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number; // 위도: -90 ~ 90

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number; // 경도: -180 ~ 180
}
