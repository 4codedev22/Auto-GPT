import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ActiveStorageAttachmentDTO } from './dto/active-storage-attachment.dto';
import { ActiveStorageAttachmentMapper } from './mapper/active-storage-attachment.mapper';
import { ActiveStorageAttachmentRepository } from '../repository/active-storage-attachment.repository';

const relationshipNames = [];
relationshipNames.push('blobs');

@Injectable()
export class ActiveStorageAttachmentService {
    logger = new Logger('ActiveStorageAttachmentService');

    constructor(
        @InjectRepository(ActiveStorageAttachmentRepository)
        private activeStorageAttachmentRepository: ActiveStorageAttachmentRepository,
    ) {}

    async findById(id: number): Promise<ActiveStorageAttachmentDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.activeStorageAttachmentRepository.findOne(id, options);
        return ActiveStorageAttachmentMapper.fromEntityToDTO(result);
    }

    async findByFields(
        options: FindOneOptions<ActiveStorageAttachmentDTO>,
    ): Promise<ActiveStorageAttachmentDTO | undefined> {
        const result = await this.activeStorageAttachmentRepository.findOne(options);
        return ActiveStorageAttachmentMapper.fromEntityToDTO(result);
    }

    async findAndCount(
        options: FindManyOptions<ActiveStorageAttachmentDTO>,
    ): Promise<[ActiveStorageAttachmentDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.activeStorageAttachmentRepository.findAndCount(options);
        const activeStorageAttachmentDTO: ActiveStorageAttachmentDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(activeStorageAttachment =>
                activeStorageAttachmentDTO.push(ActiveStorageAttachmentMapper.fromEntityToDTO(activeStorageAttachment)),
            );
            resultList[0] = activeStorageAttachmentDTO;
        }
        return resultList;
    }

    async save(
        activeStorageAttachmentDTO: ActiveStorageAttachmentDTO,
        creator?: string,
    ): Promise<ActiveStorageAttachmentDTO | undefined> {
        const entity = ActiveStorageAttachmentMapper.fromDTOtoEntity(activeStorageAttachmentDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.activeStorageAttachmentRepository.save(entity);
        return ActiveStorageAttachmentMapper.fromEntityToDTO(result);
    }

    async update(
        activeStorageAttachmentDTO: ActiveStorageAttachmentDTO,
        updater?: string,
    ): Promise<ActiveStorageAttachmentDTO | undefined> {
        const entity = ActiveStorageAttachmentMapper.fromDTOtoEntity(activeStorageAttachmentDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.activeStorageAttachmentRepository.save(entity);
        return ActiveStorageAttachmentMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.activeStorageAttachmentRepository.softDelete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
