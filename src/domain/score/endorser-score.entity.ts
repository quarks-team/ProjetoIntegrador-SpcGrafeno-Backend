import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EndorserScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  active: number;

  @Column()
  cnpj: string;

  @Column()
  canceled: number;

  @Column()
  finished: number;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
