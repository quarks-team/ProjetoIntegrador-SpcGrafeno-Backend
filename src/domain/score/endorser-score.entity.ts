import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ai_score_results')
export class EndorserScore {
  @PrimaryGeneratedColumn('uuid', { name: 'result_id' })
  resultId: string;

  @Column({ name: 'final_score' })
  finalScore: number;

  @Column({ name: 'input_variables', type: 'jsonb' })
  inputVariables: any;

  @Column({ name: 'endorser_name' })
  endorserName: string;

  @Column({ name: 'cnpj', nullable: true })
  cnpj: string;

  @CreateDateColumn({
    name: 'created_timestamp',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;
}
