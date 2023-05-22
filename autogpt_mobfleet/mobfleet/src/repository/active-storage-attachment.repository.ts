import { EntityRepository, Repository } from 'typeorm';
import { ActiveStorageAttachment } from '../domain/active-storage-attachment.entity';

@EntityRepository(ActiveStorageAttachment)
export class ActiveStorageAttachmentRepository extends Repository<ActiveStorageAttachment> {}
