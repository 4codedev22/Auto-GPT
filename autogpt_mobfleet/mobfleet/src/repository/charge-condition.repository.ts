import { EntityRepository, Repository } from 'typeorm';
import { ChargeCondition } from '../domain/charge-condition.entity';

@EntityRepository(ChargeCondition)
export class ChargeConditionRepository extends Repository<ChargeCondition> {}
