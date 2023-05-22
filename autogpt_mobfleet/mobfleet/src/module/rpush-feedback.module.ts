import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpushFeedbackController } from '../web/rest/rpush-feedback.controller';
import { RpushFeedbackRepository } from '../repository/rpush-feedback.repository';
import { RpushFeedbackService } from '../service/rpush-feedback.service';

@Module({
    imports: [TypeOrmModule.forFeature([RpushFeedbackRepository])],
    controllers: [RpushFeedbackController],
    providers: [RpushFeedbackService],
    exports: [RpushFeedbackService],
})
export class RpushFeedbackModule {}
