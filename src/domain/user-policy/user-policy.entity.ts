import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_policy')
export class UserPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', nullable: true, default: false })
  isActive: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'policy_id' })
  policyId: number;

  @Column({
    name: 'acceptance_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  acceptanceDate: Date;

  @Column({
    name: 'is_mandatory',
  })
  isMandatory: boolean;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
