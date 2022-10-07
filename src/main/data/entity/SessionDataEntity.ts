import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Record information about the session
@Entity({ name: 'SessionData' })
class MetadataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notes: string;
}

export default MetadataEntity;
