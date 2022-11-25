import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from 'typeorm';
import SessionEntity from './SessionEntity';

@Entity({ name: 'Data' })
@Index(['message', 'label'])
class DataEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  time: Date;

  // ID given by the data
  @Column()
  id: string;

  @Column()
  message: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({
    nullable: true,
  })
  unit: string;

  @ManyToOne(() => SessionEntity, (session) => session.data, {
    onDelete: 'CASCADE',
  })
  session: SessionEntity;
}

export default DataEntity;
