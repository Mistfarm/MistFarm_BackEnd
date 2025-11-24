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
  zoneId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 15 })
  zoneName: string;

  @Column({
    type: 'enum',
    enum: PLANTS,
    default: 'none',
  })
  plants: PlantType;

  @Column({ type: 'time', default: '00:00:00' })
  autoFogOnTime: string;

  @Column({ type: 'time', default: '00:00:00' })
  autoFogOffTime: string;

  @Column({ type: 'boolean', default: false })
  fogPower: boolean;

  @Column({ type: 'integer', default: 0 })
  nutrient: number;
}
