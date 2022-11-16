import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Type } from 'class-transformer';
import DataEntity from './DataEntity';

@Entity({ name: 'Sessions' })
class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column()
  date: Date;

  @Column({
    nullable: true,
  })
  notes: string;

  @OneToMany(() => DataEntity, (data) => data.session, {
    onDelete: 'CASCADE',
  })
  @Type(() => DataEntity)
  data: DataEntity[];
}

export default SessionEntity;
