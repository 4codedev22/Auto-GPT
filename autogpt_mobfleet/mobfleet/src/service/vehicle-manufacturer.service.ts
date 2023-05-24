import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { VehicleManufacturerDTO } from './dto/vehicle-manufacturer.dto';
import { VehicleManufacturerMapper } from './mapper/vehicle-manufacturer.mapper';
import { VehicleManufacturerRepository } from '../repository/vehicle-manufacturer.repository';

const relationshipNames = [];

@Injectable()
export class VehicleManufacturerService {
    logger = new Logger('VehicleManufacturerService');

    constructor(
        @InjectRepository(VehicleManufacturerRepository)
        private vehicleManufacturerRepository: VehicleManufacturerRepository,
    ) {}

    async findById(id: number): Promise<VehicleManufacturerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.vehicleManufacturerRepository.findOne(id, options);
        return VehicleManufacturerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<VehicleManufacturerDTO>): Promise<VehicleManufacturerDTO | undefined> {
        const result = await this.vehicleManufacturerRepository.findOne(options);
        return VehicleManufacturerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<VehicleManufacturerDTO>): Promise<[VehicleManufacturerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.vehicleManufacturerRepository.findAndCount(options);
        const vehicleManufacturerDTO: VehicleManufacturerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(vehicleManufacturer =>
                vehicleManufacturerDTO.push(VehicleManufacturerMapper.fromEntityToDTO(vehicleManufacturer)),
            );
            resultList[0] = vehicleManufacturerDTO;
        }
        return [vehicleManufacturerDTO, resultList[1]];
    }

    async save(
        vehicleManufacturerDTO: VehicleManufacturerDTO,
        creator?: string,
    ): Promise<VehicleManufacturerDTO | undefined> {
        const entity = VehicleManufacturerMapper.fromDTOtoEntity(vehicleManufacturerDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.vehicleManufacturerRepository.save(entity);
        return VehicleManufacturerMapper.fromEntityToDTO(result);
    }

    async update(
        vehicleManufacturerDTO: VehicleManufacturerDTO,
        updater?: string,
    ): Promise<VehicleManufacturerDTO | undefined> {
        const entity = VehicleManufacturerMapper.fromDTOtoEntity(vehicleManufacturerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.vehicleManufacturerRepository.save(entity);
        return VehicleManufacturerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.vehicleManufacturerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
