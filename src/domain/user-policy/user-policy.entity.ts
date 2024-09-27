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
}
