import {
  Entity,
  PrimaryColumn,
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
  device_id: string;

  @Column({ type: 'varchar', length: 255 })
  zone_id: string;

  @Column({ type: 'int', nullable: true })
  let: number;

  @Column({ type: 'int', nullable: true })
  lot: number;

  @ManyToOne(() => Zone)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;
}
