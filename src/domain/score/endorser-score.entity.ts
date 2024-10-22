import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ai_score_results')  // Mapeando explicitamente para a tabela 'ai_score_results'
export class EndorserScore {
  @PrimaryGeneratedColumn('uuid')  // Coluna result_id será um UUID
  resultId: string;  // Renomeado para 'resultId' para corresponder ao nome da coluna

  @Column({ name: 'final_score' })
  finalScore: number;  // Mapeando para 'final_score'

  @Column({ name: 'input_variables', type: 'jsonb' })
  inputVariables: any;  // Usando 'any' para armazenar JSONB (pode ser ajustado conforme a estrutura esperada)

  @Column({ name: 'endorser_name' })
  endorserName: string;  // Mapeando para 'endorser_name'

  @Column({ name: 'cnpj', nullable: true })  // Adicionando a coluna cnpj
  cnpj: string;  // Mapeando para 'cnpj'

  @CreateDateColumn({ name: 'created_timestamp', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;  // Mapeando para 'created_timestamp'
}
