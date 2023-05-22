/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Unique } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ActiveStorageBlob } from './active-storage-blob.entity';

/**
 * A ActiveStorageAttachment.
 */
@Entity('active_storage_attachments')
@Unique('index_active_storage_attachments_uniqueness', ['recordType', 'recordId', 'name', 'blobs'])
export class ActiveStorageAttachment extends BaseEntity {
    @Column({ name: 'name', length: 255 })
    name: string;

    @Column({ name: 'record_type', length: 255 })
    recordType: string;

    @Column({ type: 'bigint', name: 'record_id' })
    recordId: number;

    @ManyToOne(type => ActiveStorageBlob)
    @JoinColumn({ name: 'blob_id' })
    blobs: ActiveStorageBlob;
}
