import { EntityRepository, Repository } from 'typeorm';
import { FeedbackComment } from '../domain/feedback-comment.entity';

@EntityRepository(FeedbackComment)
export class FeedbackCommentRepository extends Repository<FeedbackComment> {}
