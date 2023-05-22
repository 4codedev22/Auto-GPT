import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from '../web/rest/feedback.controller';
import { FeedbackRepository } from '../repository/feedback.repository';
import { FeedbackService } from '../service/feedback.service';

@Module({
    imports: [TypeOrmModule.forFeature([FeedbackRepository])],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: [FeedbackService],
})
export class FeedbackModule {}
