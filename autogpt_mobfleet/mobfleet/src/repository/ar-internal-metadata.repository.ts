import { EntityRepository, Repository } from 'typeorm';
import { ArInternalMetadata } from '../domain/ar-internal-metadata.entity';

@EntityRepository(ArInternalMetadata)
export class ArInternalMetadataRepository extends Repository<ArInternalMetadata> {}
