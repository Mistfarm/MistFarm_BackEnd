import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../DB/entity/user.entity';
import { PLANTS, PlantType } from './zone.types';

@Entity({ name: 'zones' })
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  zone_id: string;

  @Column({ type: 'varchar', length: 30 })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 15 })
  zone_name: string;

  @Column({
    type: 'enum',
    enum: PLANTS,
    default: 'none',
  })
  plants: PlantType;

  @Column({ type: 'boolean', default: false })
  auto_fog_mode: boolean;

  @Column({ type: 'varchar', length: 7, default: '00:00:00' })
  auto_fog_on_time: string;

  @Column({ type: 'varchar', length: 7, default: '00:00:00' })
  auto_fog_off_time: string;

  @Column({ type: 'boolean', default: false })
  fog_power: boolean;

  @Column({ type: 'integer', default: 0 })
  nutrient: number;
}
