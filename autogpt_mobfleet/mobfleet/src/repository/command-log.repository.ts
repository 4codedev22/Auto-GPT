import { EntityRepository, Repository } from 'typeorm';
import { CommandLog } from '../domain/command-log.entity';

@EntityRepository(CommandLog)
export class CommandLogRepository extends Repository<CommandLog> {}
