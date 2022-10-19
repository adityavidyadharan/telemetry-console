import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Data' })
class DataEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column()
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
}

export default DataEntity;
