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

  @Column({ type: 'int', nullable: true })
  lon: number; // 위도

  @Column({ type: 'int', nullable: true })
  lat: number; // 경도
}
