import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackCommentController } from '../web/rest/feedback-comment.controller';
import { FeedbackCommentRepository } from '../repository/feedback-comment.repository';
import { FeedbackCommentService } from '../service/feedback-comment.service';

@Module({
    imports: [TypeOrmModule.forFeature([FeedbackCommentRepository])],
    controllers: [FeedbackCommentController],
    providers: [FeedbackCommentService],
    exports: [FeedbackCommentService],
})
export class FeedbackCommentModule {}
