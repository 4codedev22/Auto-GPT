import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { VehicleStatusLogDTO } from '../service/dto/vehicle-status-log.dto';
import { VehicleStatusLogMapper } from '../service/mapper/vehicle-status-log.mapper';
import { VehicleStatusLogRepository } from '../repository/vehicle-status-log.repository';
import { VehicleStatusLogCreateDTO } from './dto/vehicle-status-log-create.dto';

const relationshipNames = [];
relationshipNames.push('vehicle');
relationshipNames.push('account');

@Injectable()
export class VehicleStatusLogService {
  logger = new Logger('VehicleStatusLogService');

  constructor(
    @InjectRepository(VehicleStatusLogRepository) private vehicleStatusLogRepository: VehicleStatusLogRepository,
  ) { }

  async findById(id: number): Promise<VehicleStatusLogDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.vehicleStatusLogRepository.findOne(id, options);
    return VehicleStatusLogMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<VehicleStatusLogDTO>): Promise<VehicleStatusLogDTO | undefined> {
    const result = await this.vehicleStatusLogRepository.findOne(options);
    return VehicleStatusLogMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<VehicleStatusLogDTO>): Promise<[VehicleStatusLogDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.vehicleStatusLogRepository.findAndCount(options);
    const vehicleStatusLogDTO: VehicleStatusLogDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicleStatusLog =>
        vehicleStatusLogDTO.push(VehicleStatusLogMapper.fromEntityToDTO(vehicleStatusLog)),
      );
      resultList[0] = vehicleStatusLogDTO;
    }
    return [vehicleStatusLogDTO, resultList[1]];
  }



  async findLastIdOfStatusLogFromVehicle(vehicleId: number): Promise<number> {
    const result = await this.vehicleStatusLogRepository.findOne({
      where: {
        vehicle: {
          id: vehicleId
        }
      },
      order: {
        updatedAt: "DESC"
      }
    });
    return result?.id;
  }
  async save(vehicleStatusLogDTO: VehicleStatusLogDTO, creator?: string): Promise<VehicleStatusLogDTO | undefined> {
    const entity = VehicleStatusLogMapper.fromDTOtoEntity(vehicleStatusLogDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.vehicleStatusLogRepository.save(entity);
    return VehicleStatusLogMapper.fromEntityToDTO(result);
  }


  async create(vehicleStatusLogDTO: VehicleStatusLogCreateDTO, creator?: string): Promise<VehicleStatusLogDTO | undefined> {

    const result = await this.vehicleStatusLogRepository.save(vehicleStatusLogDTO);
    return this.findById(result.id);
  }

  async update(vehicleStatusLogDTO: VehicleStatusLogDTO, updater?: string): Promise<VehicleStatusLogDTO | undefined> {
    const entity = VehicleStatusLogMapper.fromDTOtoEntity(vehicleStatusLogDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.vehicleStatusLogRepository.save(entity);
    return VehicleStatusLogMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.vehicleStatusLogRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
