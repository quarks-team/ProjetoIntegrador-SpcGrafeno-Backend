import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('policy') // Nome da tabela
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' }) // Mapeamento para a coluna "name"
  name: string;

  @Column({ name: 'description' }) // Mapeamento para a coluna "description"
  description: string;

  @Column({ name: 'version' }) // Mapeamento para a coluna "version"
  version: number;

  @Column({ name: 'is_active', default: true }) // Mapeamento para "is_active"
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Mapeamento para "created_at"
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) // Mapeamento para "updated_at"
  updatedAt: Date;

  @Column({ name: 'excluded_at', type: 'timestamp', nullable: true }) // Mapeamento para "excluded_at"
  excludedAt: Date;
}
