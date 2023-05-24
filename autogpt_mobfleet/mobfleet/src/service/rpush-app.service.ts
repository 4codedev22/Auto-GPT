import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RpushAppDTO } from './dto/rpush-app.dto';
import { RpushAppMapper } from './mapper/rpush-app.mapper';
import { RpushAppRepository } from '../repository/rpush-app.repository';

const relationshipNames = [];

@Injectable()
export class RpushAppService {
    logger = new Logger('RpushAppService');

    constructor(@InjectRepository(RpushAppRepository) private rpushAppRepository: RpushAppRepository) {}

    async findById(id: number): Promise<RpushAppDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.rpushAppRepository.findOne(id, options);
        return RpushAppMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RpushAppDTO>): Promise<RpushAppDTO | undefined> {
        const result = await this.rpushAppRepository.findOne(options);
        return RpushAppMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RpushAppDTO>): Promise<[RpushAppDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.rpushAppRepository.findAndCount(options);
        const rpushAppDTO: RpushAppDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(rpushApp => rpushAppDTO.push(RpushAppMapper.fromEntityToDTO(rpushApp)));
            resultList[0] = rpushAppDTO;
        }
        return resultList;
    }
    async listCertificatesDistinct(): Promise<string[]> {
        return await this.rpushAppRepository.listCertificatesDistinct();
    }
    async save(rpushAppDTO: RpushAppDTO, creator?: string): Promise<RpushAppDTO | undefined> {
        const entity = RpushAppMapper.fromDTOtoEntity(rpushAppDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.rpushAppRepository.save(entity);
        return RpushAppMapper.fromEntityToDTO(result);
    }

    async update(rpushAppDTO: RpushAppDTO, updater?: string): Promise<RpushAppDTO | undefined> {
        const entity = RpushAppMapper.fromDTOtoEntity(rpushAppDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.rpushAppRepository.save(entity);
        return RpushAppMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.rpushAppRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
