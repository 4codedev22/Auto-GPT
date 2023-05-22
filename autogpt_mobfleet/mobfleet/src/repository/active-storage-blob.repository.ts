import { EntityRepository, Repository } from 'typeorm';
import { ActiveStorageBlob } from '../domain/active-storage-blob.entity';

@EntityRepository(ActiveStorageBlob)
export class ActiveStorageBlobRepository extends Repository<ActiveStorageBlob> {}
