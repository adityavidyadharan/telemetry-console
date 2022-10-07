import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SessionModelType } from '../models/SessionModel';
import MetadataEntity from './SessionDataEntity';

@Entity({ name: 'Sessions' })
class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  date: Date;

  @OneToOne((_type) => MetadataEntity)
  @JoinColumn()
  information: MetadataEntity;

  constructor(model: SessionModelType) {
    Object.assign(this, model);
  }
}

export default SessionEntity;
