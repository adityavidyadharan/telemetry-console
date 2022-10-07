import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataModelType } from '../models/DataModel';

@Entity({ name: 'Data' })
class DataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date' })
  time: Date;

  @Column()
  message_id: string;

  @Column()
  message: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column()
  unit: string;

  constructor(model: DataModelType) {
    Object.assign(this, model);
  }
}

export default DataEntity;
