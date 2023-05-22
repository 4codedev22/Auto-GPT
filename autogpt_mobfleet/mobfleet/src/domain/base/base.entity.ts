import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;
  @CreateDateColumn({ nullable: true, name: 'created_at', type: 'datetime' })
  createdAt?: any;
  @DeleteDateColumn({ nullable: true, name: 'deleted_at', type: 'datetime' })
  deletedAt?: any;
  @UpdateDateColumn({ nullable: true, name: 'updated_at', type: 'datetime' })
  updatedAt?: any;
  @Column({ nullable: true, name: 'last_modified_by' })
  lastModifiedBy?: string;
}
