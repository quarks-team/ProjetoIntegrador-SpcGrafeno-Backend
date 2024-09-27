import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPolicy {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, default: false })
  isActive: boolean;
  @Column()
  userId: string;
  @Column()
  policyId: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
