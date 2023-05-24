import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ArInternalMetadataDTO } from './dto/ar-internal-metadata.dto';
import { ArInternalMetadataMapper } from './mapper/ar-internal-metadata.mapper';
import { ArInternalMetadataRepository } from '../repository/ar-internal-metadata.repository';

const relationshipNames = [];

@Injectable()
export class ArInternalMetadataService {
    logger = new Logger('ArInternalMetadataService');

    constructor(
        @InjectRepository(ArInternalMetadataRepository)
        private arInternalMetadataRepository: ArInternalMetadataRepository,
    ) {}

    async findById(id: number): Promise<ArInternalMetadataDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.arInternalMetadataRepository.findOne(id, options);
        return ArInternalMetadataMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ArInternalMetadataDTO>): Promise<ArInternalMetadataDTO | undefined> {
        const result = await this.arInternalMetadataRepository.findOne(options);
        return ArInternalMetadataMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ArInternalMetadataDTO>): Promise<[ArInternalMetadataDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.arInternalMetadataRepository.findAndCount(options);
        const arInternalMetadataDTO: ArInternalMetadataDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(arInternalMetadata =>
                arInternalMetadataDTO.push(ArInternalMetadataMapper.fromEntityToDTO(arInternalMetadata)),
            );
            resultList[0] = arInternalMetadataDTO;
        }
        return resultList;
    }

    async save(
        arInternalMetadataDTO: ArInternalMetadataDTO,
        creator?: string,
    ): Promise<ArInternalMetadataDTO | undefined> {
        const entity = ArInternalMetadataMapper.fromDTOtoEntity(arInternalMetadataDTO);
        const result = await this.arInternalMetadataRepository.save(entity);
        return ArInternalMetadataMapper.fromEntityToDTO(result);
    }

    async update(
        arInternalMetadataDTO: ArInternalMetadataDTO,
        updater?: string,
    ): Promise<ArInternalMetadataDTO | undefined> {
        const entity = ArInternalMetadataMapper.fromDTOtoEntity(arInternalMetadataDTO);
        const result = await this.arInternalMetadataRepository.save(entity);
        return ArInternalMetadataMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.arInternalMetadataRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
