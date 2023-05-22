import { EntityRepository, Repository } from 'typeorm';
import { SmsToken } from '../domain/sms-token.entity';

@EntityRepository(SmsToken)
export class SmsTokenRepository extends Repository<SmsToken> {}
