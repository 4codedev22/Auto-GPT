import { EntityRepository, Repository } from 'typeorm';
import { Feedback } from '../domain/feedback.entity';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {}
