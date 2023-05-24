import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SmsTokenDTO } from './dto/sms-token.dto';
import { SmsTokenMapper } from './mapper/sms-token.mapper';
import { SmsTokenRepository } from '../repository/sms-token.repository';

const relationshipNames = [];
relationshipNames.push('account');

@Injectable()
export class SmsTokenService {
    logger = new Logger('SmsTokenService');

    constructor(@InjectRepository(SmsTokenRepository) private smsTokenRepository: SmsTokenRepository) {}

    async findById(id: number): Promise<SmsTokenDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.smsTokenRepository.findOne(id, options);
        return SmsTokenMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<SmsTokenDTO>): Promise<SmsTokenDTO | undefined> {
        const result = await this.smsTokenRepository.findOne(options);
        return SmsTokenMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<SmsTokenDTO>): Promise<[SmsTokenDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.smsTokenRepository.findAndCount(options);
        const smsTokenDTO: SmsTokenDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(smsToken => smsTokenDTO.push(SmsTokenMapper.fromEntityToDTO(smsToken)));
            resultList[0] = smsTokenDTO;
        }
        return [smsTokenDTO, resultList[1]];
    }

    async save(smsTokenDTO: SmsTokenDTO, creator?: string): Promise<SmsTokenDTO | undefined> {
        const entity = SmsTokenMapper.fromDTOtoEntity(smsTokenDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.smsTokenRepository.save(entity);
        return SmsTokenMapper.fromEntityToDTO(result);
    }

    async update(smsTokenDTO: SmsTokenDTO, updater?: string): Promise<SmsTokenDTO | undefined> {
        const entity = SmsTokenMapper.fromDTOtoEntity(smsTokenDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.smsTokenRepository.save(entity);
        return SmsTokenMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.smsTokenRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
