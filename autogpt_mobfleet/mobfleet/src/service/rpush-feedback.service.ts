import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RpushFeedbackDTO } from '../service/dto/rpush-feedback.dto';
import { RpushFeedbackMapper } from '../service/mapper/rpush-feedback.mapper';
import { RpushFeedbackRepository } from '../repository/rpush-feedback.repository';

const relationshipNames = [];

@Injectable()
export class RpushFeedbackService {
    logger = new Logger('RpushFeedbackService');

    constructor(@InjectRepository(RpushFeedbackRepository) private rpushFeedbackRepository: RpushFeedbackRepository) {}

    async findById(id: number): Promise<RpushFeedbackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.rpushFeedbackRepository.findOne(id, options);
        return RpushFeedbackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RpushFeedbackDTO>): Promise<RpushFeedbackDTO | undefined> {
        const result = await this.rpushFeedbackRepository.findOne(options);
        return RpushFeedbackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RpushFeedbackDTO>): Promise<[RpushFeedbackDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.rpushFeedbackRepository.findAndCount(options);
        const rpushFeedbackDTO: RpushFeedbackDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(rpushFeedback =>
                rpushFeedbackDTO.push(RpushFeedbackMapper.fromEntityToDTO(rpushFeedback)),
            );
            resultList[0] = rpushFeedbackDTO;
        }
        return resultList;
    }

    async save(rpushFeedbackDTO: RpushFeedbackDTO, creator?: string): Promise<RpushFeedbackDTO | undefined> {
        const entity = RpushFeedbackMapper.fromDTOtoEntity(rpushFeedbackDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.rpushFeedbackRepository.save(entity);
        return RpushFeedbackMapper.fromEntityToDTO(result);
    }

    async update(rpushFeedbackDTO: RpushFeedbackDTO, updater?: string): Promise<RpushFeedbackDTO | undefined> {
        const entity = RpushFeedbackMapper.fromDTOtoEntity(rpushFeedbackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.rpushFeedbackRepository.save(entity);
        return RpushFeedbackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.rpushFeedbackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
