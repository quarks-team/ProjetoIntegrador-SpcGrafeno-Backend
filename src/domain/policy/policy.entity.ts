import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  version: number;
  @Column({ default: new Date() })
  createdAt: Date;
  @Column({ default: new Date() })
  updatedAt: Date;
  @Column({ nullable: true })
  excludedAt: Date;
}
