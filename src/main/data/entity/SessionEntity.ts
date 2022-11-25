import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Type } from 'class-transformer';
import DataEntity from './DataEntity';
import AppDataSource from '../data-source';

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

  @OneToMany(() => DataEntity, (data) => data.session)
  @Type(() => DataEntity)
  data: Promise<DataEntity>[];

  populated: boolean;

  @AfterLoad()
  async checkPopulated() {
    const data = await AppDataSource.getRepository(SessionEntity)
      .createQueryBuilder()
      .innerJoin('Data', 'd', 'SessionEntity.id=d.sessionId')
      .where('SessionEntity.id=:id', { id: this.id })
      .getCount();
    this.populated = data === 1;
  }
}

export default SessionEntity;
