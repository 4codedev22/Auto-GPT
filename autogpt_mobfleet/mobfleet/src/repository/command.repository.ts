import { EntityRepository, Repository } from 'typeorm';
import { Command } from '../domain/command.entity';

@EntityRepository(Command)
export class CommandRepository extends Repository<Command> {}
