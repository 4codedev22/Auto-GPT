import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ActiveStorageBlobDTO } from '../service/dto/active-storage-blob.dto';
import { ActiveStorageBlobMapper } from '../service/mapper/active-storage-blob.mapper';
import { ActiveStorageBlobRepository } from '../repository/active-storage-blob.repository';

const relationshipNames = [];

@Injectable()
export class ActiveStorageBlobService {
    logger = new Logger('ActiveStorageBlobService');

    constructor(
        @InjectRepository(ActiveStorageBlobRepository) private activeStorageBlobRepository: ActiveStorageBlobRepository,
    ) {}

    async findById(id: number): Promise<ActiveStorageBlobDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.activeStorageBlobRepository.findOne(id, options);
        return ActiveStorageBlobMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ActiveStorageBlobDTO>): Promise<ActiveStorageBlobDTO | undefined> {
        const result = await this.activeStorageBlobRepository.findOne(options);
        return ActiveStorageBlobMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ActiveStorageBlobDTO>): Promise<[ActiveStorageBlobDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.activeStorageBlobRepository.findAndCount(options);
        const activeStorageBlobDTO: ActiveStorageBlobDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(activeStorageBlob =>
                activeStorageBlobDTO.push(ActiveStorageBlobMapper.fromEntityToDTO(activeStorageBlob)),
            );
            resultList[0] = activeStorageBlobDTO;
        }
        return resultList;
    }

    async save(
        activeStorageBlobDTO: ActiveStorageBlobDTO,
        creator?: string,
    ): Promise<ActiveStorageBlobDTO | undefined> {
        const entity = ActiveStorageBlobMapper.fromDTOtoEntity(activeStorageBlobDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.activeStorageBlobRepository.save(entity);
        return ActiveStorageBlobMapper.fromEntityToDTO(result);
    }

    async update(
        activeStorageBlobDTO: ActiveStorageBlobDTO,
        updater?: string,
    ): Promise<ActiveStorageBlobDTO | undefined> {
        const entity = ActiveStorageBlobMapper.fromDTOtoEntity(activeStorageBlobDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.activeStorageBlobRepository.save(entity);
        return ActiveStorageBlobMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.activeStorageBlobRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
