import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../DB/entity/user.entity';
import { PLANT_TYPES, PlantType } from './plant.types';

@Entity({ name: 'zone' })
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  @Column({ name: 'id' })
  zoneId: string;

  @Column({ name: 'user_id', type: 'varchar', length: 30 })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'zone_name', type: 'varchar', length: 15 })
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
}