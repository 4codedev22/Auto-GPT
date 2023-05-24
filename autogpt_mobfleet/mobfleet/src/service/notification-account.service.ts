import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { NotificationAccountDTO } from './dto/notification-account.dto';
import { NotificationAccountMapper } from './mapper/notification-account.mapper';
import { NotificationAccountRepository } from '../repository/notification-account.repository';

const relationshipNames = [];
relationshipNames.push('account');
relationshipNames.push('notification');

@Injectable()
export class NotificationAccountService {
    logger = new Logger('NotificationAccountService');

    constructor(
        @InjectRepository(NotificationAccountRepository)
        private notificationAccountRepository: NotificationAccountRepository,
    ) {}

    async findById(id: number): Promise<NotificationAccountDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.notificationAccountRepository.findOne(id, options);
        return NotificationAccountMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<NotificationAccountDTO>): Promise<NotificationAccountDTO | undefined> {
        const result = await this.notificationAccountRepository.findOne(options);
        return NotificationAccountMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<NotificationAccountDTO>): Promise<[NotificationAccountDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.notificationAccountRepository.findAndCount(options);
        const notificationAccountDTO: NotificationAccountDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(notificationAccount =>
                notificationAccountDTO.push(NotificationAccountMapper.fromEntityToDTO(notificationAccount)),
            );
            resultList[0] = notificationAccountDTO;
        }
        return [notificationAccountDTO, resultList[1]];
    }

    async save(
        notificationAccountDTO: NotificationAccountDTO,
        creator?: string,
    ): Promise<NotificationAccountDTO | undefined> {
        const entity = NotificationAccountMapper.fromDTOtoEntity(notificationAccountDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.notificationAccountRepository.save(entity);
        return NotificationAccountMapper.fromEntityToDTO(result);
    }

    async update(
        notificationAccountDTO: NotificationAccountDTO,
        updater?: string,
    ): Promise<NotificationAccountDTO | undefined> {
        const entity = NotificationAccountMapper.fromDTOtoEntity(notificationAccountDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.notificationAccountRepository.save(entity);
        return NotificationAccountMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.notificationAccountRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
