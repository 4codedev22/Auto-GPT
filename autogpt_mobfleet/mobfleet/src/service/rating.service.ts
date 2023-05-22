import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RatingDTO } from '../service/dto/rating.dto';
import { RatingMapper } from '../service/mapper/rating.mapper';
import { RatingRepository } from '../repository/rating.repository';

const relationshipNames = [];
relationshipNames.push('reservation');
relationshipNames.push('vehicle');

@Injectable()
export class RatingService {
    logger = new Logger('RatingService');

    constructor(@InjectRepository(RatingRepository) private ratingRepository: RatingRepository) {}

    async findById(id: number): Promise<RatingDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.ratingRepository.findOne(id, options);
        return RatingMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RatingDTO>): Promise<RatingDTO | undefined> {
        const result = await this.ratingRepository.findOne(options);
        return RatingMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RatingDTO>): Promise<[RatingDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.ratingRepository.findAndCount(options);
        const ratingDTO: RatingDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(rating => ratingDTO.push(RatingMapper.fromEntityToDTO(rating)));
        }
        return [ratingDTO, resultList[1]];
    }

    async save(ratingDTO: RatingDTO, creator?: string): Promise<RatingDTO | undefined> {
        const entity = RatingMapper.fromDTOtoEntity(ratingDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.ratingRepository.save(entity);
        return RatingMapper.fromEntityToDTO(result);
    }

    async update(ratingDTO: RatingDTO, updater?: string): Promise<RatingDTO | undefined> {
        const entity = RatingMapper.fromDTOtoEntity(ratingDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.ratingRepository.save(entity);
        return RatingMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.ratingRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
