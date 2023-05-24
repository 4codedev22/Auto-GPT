import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { FeedbackDTO } from './dto/feedback.dto';
import { FeedbackMapper } from './mapper/feedback.mapper';
import { FeedbackRepository } from '../repository/feedback.repository';

const relationshipNames = [];
relationshipNames.push('account');

@Injectable()
export class FeedbackService {
    logger = new Logger('FeedbackService');

    constructor(@InjectRepository(FeedbackRepository) private feedbackRepository: FeedbackRepository) {}

    async findById(id: number): Promise<FeedbackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.feedbackRepository.findOne(id, options);
        return FeedbackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<FeedbackDTO>): Promise<FeedbackDTO | undefined> {
        const result = await this.feedbackRepository.findOne(options);
        return FeedbackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<FeedbackDTO>): Promise<[FeedbackDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.feedbackRepository.findAndCount(options);
        const feedbackDTO: FeedbackDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(feedback => feedbackDTO.push(FeedbackMapper.fromEntityToDTO(feedback)));
            resultList[0] = feedbackDTO;
        }
        return [feedbackDTO, resultList[1]];
    }

    async save(feedbackDTO: FeedbackDTO, creator?: string): Promise<FeedbackDTO | undefined> {
        const entity = FeedbackMapper.fromDTOtoEntity(feedbackDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.feedbackRepository.save(entity);
        return FeedbackMapper.fromEntityToDTO(result);
    }

    async update(feedbackDTO: FeedbackDTO, updater?: string): Promise<FeedbackDTO | undefined> {
        const entity = FeedbackMapper.fromDTOtoEntity(feedbackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.feedbackRepository.save(entity);
        return FeedbackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.feedbackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
