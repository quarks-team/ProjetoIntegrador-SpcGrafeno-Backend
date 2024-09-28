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

  @Column()
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
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
