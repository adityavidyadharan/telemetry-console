import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SessionEntity from './SessionEntity';

@Entity({ name: 'Data' })
@Index(['session', 'message', 'label'])
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
  @JoinColumn({
    name: 'sessionId',
  })
  session: SessionEntity;

  @Column()
  sessionId: number;
}

export default DataEntity;
