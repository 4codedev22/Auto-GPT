import { EntityRepository, Repository } from 'typeorm';
import { Charge } from '../domain/charge.entity';

@EntityRepository(Charge)
export class ChargeRepository extends Repository<Charge> { }
