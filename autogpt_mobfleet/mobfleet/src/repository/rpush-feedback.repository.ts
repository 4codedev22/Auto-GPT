import { EntityRepository, Repository } from 'typeorm';
import { RpushFeedback } from '../domain/rpush-feedback.entity';

@EntityRepository(RpushFeedback)
export class RpushFeedbackRepository extends Repository<RpushFeedback> {}
