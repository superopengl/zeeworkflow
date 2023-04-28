import { Entity, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn, Column, DeleteDateColumn, Index, Unique, OneToMany } from 'typeorm';
import { Task } from './Task';


@Entity()
@Index('idx_org_client_unique', ['orgId', 'userId'], { unique: true, where: `"deletedAt" IS NULL` })
export class OrgClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  orgId: string;

  @Column('uuid', { nullable: true })
  @Index()
  userId: string;

  @Column()
  clientAlias: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Task, task => task.orgClient, { onDelete: 'SET NULL', eager: false, orphanedRowAction: 'delete' })
  tasks: Task[];
}
