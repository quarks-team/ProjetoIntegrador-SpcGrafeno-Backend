import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')  // Mapeando explicitamente para a tabela 'user'
export class User {
  @PrimaryGeneratedColumn()  // A coluna id será um auto-incremento
  id: number;  // Mudando de 'uuid' para 'number' para corresponder ao tipo SERIAL

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ name: 'consent_status', default: false, nullable: true })
  consentStatus: boolean;

  @Column({ name: 'consent_date', nullable: true })
  consentDate: Date | null;  // Usando 'null' para ser consistente com o banco de dados

  @Column({ name: 'cnpj', nullable: true })
  cnpj: string | null;  // Usando 'null' para ser consistente com o banco de dados

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
