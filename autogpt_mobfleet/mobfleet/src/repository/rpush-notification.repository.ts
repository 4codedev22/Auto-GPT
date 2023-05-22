import { EntityRepository, Repository } from 'typeorm';
import { RpushNotification } from '../domain/rpush-notification.entity';

@EntityRepository(RpushNotification)
export class RpushNotificationRepository extends Repository<RpushNotification> {}
