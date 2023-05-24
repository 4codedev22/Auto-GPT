import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { MaintenanceDTO } from './dto/maintenance.dto';
import { MaintenanceMapper } from './mapper/maintenance.mapper';
import { MaintenanceRepository } from '../repository/maintenance.repository';

const relationshipNames = [];
relationshipNames.push('vehicle');
relationshipNames.push('account');

@Injectable()
export class MaintenanceService {
    logger = new Logger('MaintenanceService');

    constructor(@InjectRepository(MaintenanceRepository) private maintenanceRepository: MaintenanceRepository) {}

    async findById(id: number): Promise<MaintenanceDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.maintenanceRepository.findOne(id, options);
        return MaintenanceMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<MaintenanceDTO>): Promise<MaintenanceDTO | undefined> {
        const result = await this.maintenanceRepository.findOne(options);
        return MaintenanceMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<MaintenanceDTO>): Promise<[MaintenanceDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.maintenanceRepository.findAndCount(options);
        const maintenanceDTO: MaintenanceDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(maintenance => maintenanceDTO.push(MaintenanceMapper.fromEntityToDTO(maintenance)));
            resultList[0] = maintenanceDTO;
        }
        return [maintenanceDTO, resultList[1]];
    }

    async save(maintenanceDTO: MaintenanceDTO, creator?: string): Promise<MaintenanceDTO | undefined> {
        const entity = MaintenanceMapper.fromDTOtoEntity(maintenanceDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.maintenanceRepository.save(entity);
        return MaintenanceMapper.fromEntityToDTO(result);
    }

    async update(maintenanceDTO: MaintenanceDTO, updater?: string): Promise<MaintenanceDTO | undefined> {
        const entity = MaintenanceMapper.fromDTOtoEntity(maintenanceDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.maintenanceRepository.save(entity);
        return MaintenanceMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.maintenanceRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
