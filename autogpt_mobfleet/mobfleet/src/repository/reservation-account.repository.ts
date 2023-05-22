import { EntityRepository, Repository } from 'typeorm';
import { ReservationAccount } from '../domain/reservation-account.entity';

@EntityRepository(ReservationAccount)
export class ReservationAccountRepository extends Repository<ReservationAccount> {}
