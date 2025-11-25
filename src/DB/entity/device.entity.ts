import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ZoneEntity } from './zone.entity';

@Entity()
export class DeviceEntity {
  @PrimaryColumn()
  deviceId: number;

  @Column({ name: 'zone_id', nullable: true, default: null })
  zoneId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  deviceName: string;

  @ManyToOne(() => ZoneEntity)
  @JoinColumn({ name: 'zone_id' })
  zone?: ZoneEntity | null;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ type: 'float' })
  humidity: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number; // 위도: -90 ~ 90

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number; // 경도: -180 ~ 180

  @Column({ default: true })
  onConnect: boolean;

  @Column({ default: 1 })
  growthLevel: number;
}
