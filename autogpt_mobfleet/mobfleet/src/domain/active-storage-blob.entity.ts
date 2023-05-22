/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ActiveStorageAttachment } from './active-storage-attachment.entity';

/**
 * A ActiveStorageBlob.
 */
@Entity('active_storage_blobs')
export class ActiveStorageBlob extends BaseEntity {
    @Column({ name: 'key', length: 255, unique: true })
    key: string;

    @Column({ name: 'filename', length: 255 })
    filename: string;

    @Column({ name: 'content_type', length: 255, nullable: true })
    contentType: string;

    @Column({ name: 'metadata', length: 255, nullable: true })
    metadata: string;

    @Column({ type: 'bigint', name: 'byte_size' })
    byteSize: number;

    @Column({ name: 'checksum', length: 255 })
    checksum: string;

    @OneToMany(
        type => ActiveStorageAttachment,
        other => other.blobs,
    )
    activeStorageAttachments: ActiveStorageAttachment[];
}
