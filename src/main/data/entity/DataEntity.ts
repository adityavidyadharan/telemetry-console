import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataModelType } from '../models/DataModel';

@Entity({ name: 'Data' })
class DataEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column({ name: 'date' })
  time: Date;

  @Column()
  id: string;

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
