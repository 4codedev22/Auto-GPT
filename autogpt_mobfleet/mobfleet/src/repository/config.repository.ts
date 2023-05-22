import { EntityRepository, Repository } from 'typeorm';
import { Config } from '../domain/config.entity';

@EntityRepository(Config)
export class ConfigRepository extends Repository<Config> {}
