import { EntityRepository, Repository } from 'typeorm';
import { NotificationAccount } from '../domain/notification-account.entity';

@EntityRepository(NotificationAccount)
export class NotificationAccountRepository extends Repository<NotificationAccount> {}
