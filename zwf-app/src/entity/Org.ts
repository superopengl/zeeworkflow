import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, DeleteDateColumn, OneToMany, JoinColumn, OneToOne, Unique } from 'typeorm';

@Entity()
export class Org {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  name: string;

  @Column()
  businessName: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  tel: string;

  @Column({ nullable: true })
  abn: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ generatedType:'STORED', asExpression: `"createdAt" + '14 days'::interval`})
  trialEndsTill: Date;
}


