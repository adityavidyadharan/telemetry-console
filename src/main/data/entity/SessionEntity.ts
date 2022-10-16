import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SessionModelType } from '../models/SessionModel';

@Entity({ name: 'Sessions' })
class SessionEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  date: Date;

  @Column()
  notes: string;

  constructor(model: SessionModelType) {
    Object.assign(this, model);
  }
}

export default SessionEntity;
