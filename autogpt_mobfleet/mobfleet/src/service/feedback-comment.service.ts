import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { FeedbackCommentDTO } from '../service/dto/feedback-comment.dto';
import { FeedbackCommentMapper } from '../service/mapper/feedback-comment.mapper';
import { FeedbackCommentRepository } from '../repository/feedback-comment.repository';

const relationshipNames = [];
relationshipNames.push('account');
relationshipNames.push('feedback');

@Injectable()
export class FeedbackCommentService {
    logger = new Logger('FeedbackCommentService');

    constructor(
        @InjectRepository(FeedbackCommentRepository) private feedbackCommentRepository: FeedbackCommentRepository,
    ) {}

    async findById(id: number): Promise<FeedbackCommentDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.feedbackCommentRepository.findOne(id, options);
        return FeedbackCommentMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<FeedbackCommentDTO>): Promise<FeedbackCommentDTO | undefined> {
        const result = await this.feedbackCommentRepository.findOne(options);
        return FeedbackCommentMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<FeedbackCommentDTO>): Promise<[FeedbackCommentDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.feedbackCommentRepository.findAndCount(options);
        const feedbackCommentDTO: FeedbackCommentDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(feedbackComment =>
                feedbackCommentDTO.push(FeedbackCommentMapper.fromEntityToDTO(feedbackComment)),
            );
            resultList[0] = feedbackCommentDTO;
        }
        return [feedbackCommentDTO, resultList[1]];
    }

    async save(feedbackCommentDTO: FeedbackCommentDTO, creator?: string): Promise<FeedbackCommentDTO | undefined> {
        const entity = FeedbackCommentMapper.fromDTOtoEntity(feedbackCommentDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.feedbackCommentRepository.save(entity);
        return FeedbackCommentMapper.fromEntityToDTO(result);
    }

    async update(feedbackCommentDTO: FeedbackCommentDTO, updater?: string): Promise<FeedbackCommentDTO | undefined> {
        const entity = FeedbackCommentMapper.fromDTOtoEntity(feedbackCommentDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.feedbackCommentRepository.save(entity);
        return FeedbackCommentMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.feedbackCommentRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
