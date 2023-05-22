import { Injectable, HttpException, HttpStatus, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';
import { VehicleGroupDTO } from '../service/dto/vehicle-group.dto';
import { VehicleGroupMapper } from '../service/mapper/vehicle-group.mapper';
import { VehicleGroupRepository } from '../repository/vehicle-group.repository';
import { ContractService } from './contract.service';
import { VehicleGroupCreateDTO } from './dto/vehicle-group-create.dto';
import { AccountDTO } from './dto/account.dto';

const relationshipNames = [];

@Injectable()
export class VehicleGroupService {
  logger = new Logger('VehicleGroupService');

  constructor(
    @InjectRepository(VehicleGroupRepository) private vehicleGroupRepository: VehicleGroupRepository,
    @Inject(forwardRef(() => ContractService))
    private contractService: ContractService
  ) { }

  async findById(id: number): Promise<VehicleGroupDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.vehicleGroupRepository.findOne(id, options);
    return VehicleGroupMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<VehicleGroupDTO>): Promise<VehicleGroupDTO | undefined> {
    const result = await this.vehicleGroupRepository.findOne(options);
    return VehicleGroupMapper.fromEntityToDTO(result);
  }

  async create(
    vehicleGroupDTO: VehicleGroupCreateDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<VehicleGroupDTO | undefined> {
    const vehicle = VehicleGroupMapper.fromCreateDTOtoEntity(vehicleGroupDTO);
    const contract = await this.contractService.findById(contractID, creator);
    vehicle.contracts = [contract];

    if (creator) {
      vehicle.lastModifiedBy = creator.email;
    }
    const result = await this.vehicleGroupRepository.save(vehicle);
    return VehicleGroupMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    options: FindManyOptions<VehicleGroupDTO>,
    contractID: number,
    search?: string,
    filter?: any,
  ): Promise<[VehicleGroupDTO[], number]> {
    let qb = this.vehicleGroupRepository.createQueryBuilder('vehicleGroup');
    qb = qb
      .leftJoinAndSelect('vehicleGroup.contracts', 'contract')
      .where('contract.id = :contractID ', { contractID: +contractID });

    if (search) {
      qb = qb.andWhere('vehicleGroup.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    qb = qb
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    const vehicleGroupDTO: VehicleGroupDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicleGroup => vehicleGroupDTO.push(VehicleGroupMapper.fromEntityToDTO(vehicleGroup)),);
    }
    return [vehicleGroupDTO, resultList[1]];
  }

  async save(vehicleGroupDTO: VehicleGroupDTO, creator?: string): Promise<VehicleGroupDTO | undefined> {
    const entity = VehicleGroupMapper.fromDTOtoEntity(vehicleGroupDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.vehicleGroupRepository.save(entity);
    return VehicleGroupMapper.fromEntityToDTO(result);
  }

  async update(vehicleGroupDTO: VehicleGroupDTO, updater?: string): Promise<VehicleGroupDTO | undefined> {
    const entity = VehicleGroupMapper.fromDTOtoEntity(vehicleGroupDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.vehicleGroupRepository.save(entity);
    return VehicleGroupMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.vehicleGroupRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
