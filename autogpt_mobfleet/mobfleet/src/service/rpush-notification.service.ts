import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RpushNotificationDTO } from '../service/dto/rpush-notification.dto';
import { RpushNotificationMapper } from '../service/mapper/rpush-notification.mapper';
import { RpushNotificationRepository } from '../repository/rpush-notification.repository';

const relationshipNames = [];

@Injectable()
export class RpushNotificationService {
    logger = new Logger('RpushNotificationService');

    constructor(
        @InjectRepository(RpushNotificationRepository) private rpushNotificationRepository: RpushNotificationRepository,
    ) {}

    async findById(id: number): Promise<RpushNotificationDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.rpushNotificationRepository.findOne(id, options);
        return RpushNotificationMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RpushNotificationDTO>): Promise<RpushNotificationDTO | undefined> {
        const result = await this.rpushNotificationRepository.findOne(options);
        return RpushNotificationMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RpushNotificationDTO>): Promise<[RpushNotificationDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.rpushNotificationRepository.findAndCount(options);
        const rpushNotificationDTO: RpushNotificationDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(rpushNotification =>
                rpushNotificationDTO.push(RpushNotificationMapper.fromEntityToDTO(rpushNotification)),
            );
            resultList[0] = rpushNotificationDTO;
        }
        return resultList;
    }

    async save(
        rpushNotificationDTO: RpushNotificationDTO,
        creator?: string,
    ): Promise<RpushNotificationDTO | undefined> {
        const entity = RpushNotificationMapper.fromDTOtoEntity(rpushNotificationDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.rpushNotificationRepository.save(entity);
        return RpushNotificationMapper.fromEntityToDTO(result);
    }

    async update(
        rpushNotificationDTO: RpushNotificationDTO,
        updater?: string,
    ): Promise<RpushNotificationDTO | undefined> {
        const entity = RpushNotificationMapper.fromDTOtoEntity(rpushNotificationDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.rpushNotificationRepository.save(entity);
        return RpushNotificationMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.rpushNotificationRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
