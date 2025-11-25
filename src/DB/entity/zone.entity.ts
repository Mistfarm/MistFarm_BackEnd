import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PLANT_TYPES, PlantType } from '../../domain/zone/plant.types';

@Entity()
export class ZoneEntity {
  @PrimaryGeneratedColumn('uuid')
  zoneId: string;

  @Column({
    name: 'register_id',
    nullable: true,
  })
  zoneRegisterId: string;

  @Column({
    name: 'zone_password',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  zonePassword: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'zone_name', type: 'varchar', length: 15, nullable: true })
  zoneName: string;

  @Column({
    name: 'plants',
    type: 'enum',
    enum: PLANT_TYPES,
    default: 'none',
  })
  plants: PlantType;

  @Column({ name: 'auto_fog_mode', type: 'boolean', default: false })
  autoFogMode: boolean;

  @Column({ name: 'auto_fog_on_time', type: 'time', default: '00:00:00' })
  autoFogOnTime: string;

  @Column({ name: 'auto_fog_off_time', type: 'time', default: '00:00:00' })
  autoFogOffTime: string;

  @Column({ name: 'fog_power', type: 'boolean', default: false })
  fogPower: boolean;

  @Column({ name: 'nutrient', type: 'integer', default: 0 })
  nutrient: number;

  @Column({ name: 'is_not_used', type: 'boolean', default: false })
  isNotUsed: boolean;
}
