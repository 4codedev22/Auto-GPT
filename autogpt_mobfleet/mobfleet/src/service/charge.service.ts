import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';

import { ChargeDTO } from '../service/dto/charge.dto';
import { ChargeMapper } from '../service/mapper/charge.mapper';
import { ChargeRepository } from '../repository/charge.repository';

const relationshipNames = [];
relationshipNames.push('reservation');
relationshipNames.push('contract');


@Injectable()
export class ChargeService {
  logger = new Logger('ChargeService');

  constructor(@InjectRepository(ChargeRepository) private chargeRepository: ChargeRepository) { }

  async findById(id: number): Promise<ChargeDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.chargeRepository.findOne(id, options);
    return ChargeMapper.fromEntityToDTO(result);
  }

  async findByReservationId(reservationId: number, contractId: number): Promise<ChargeDTO[]> {
    const options = { relations: relationshipNames };

    const qb = this.chargeRepository.createQueryBuilder('charge')
      .andWhere('charge.contract_id = :contract', { contract: contractId })
      .andWhere('charge.reservation_id = :reservation', { reservation: reservationId });
    
    const result = await qb.getMany();

    const chargeDTO: ChargeDTO[] = [];
    if (result) {
      result.forEach(charge => chargeDTO.push(ChargeMapper.fromEntityToDTO(charge)));
    }

    return chargeDTO;
  }

  async findByFields(options: FindOneOptions<ChargeDTO>): Promise<ChargeDTO | undefined> {
    const result = await this.chargeRepository.findOne(options);
    return ChargeMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChargeDTO>): Promise<[ChargeDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.chargeRepository.findAndCount(options);
    const chargeDTO: ChargeDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(charge => chargeDTO.push(ChargeMapper.fromEntityToDTO(charge)));
    }
    return [chargeDTO, resultList[1]];
  }

  async save(chargeDTO: ChargeDTO, creator?: string): Promise<ChargeDTO | undefined> {
    const entity = ChargeMapper.fromDTOtoEntity(chargeDTO);
    if (creator) {
      entity.createdBy = creator;
      entity.lastModifiedBy = creator;
    }

    const result = await this.chargeRepository.save(entity);
    return ChargeMapper.fromEntityToDTO(result);
  }

  async update(chargeDTO: ChargeDTO, updater?: string): Promise<ChargeDTO | undefined> {
    const entity = ChargeMapper.fromDTOtoEntity(chargeDTO);
    if (updater) { entity.lastModifiedBy = updater; }
    const result = await this.chargeRepository.save(entity);
    return ChargeMapper.fromEntityToDTO(result);
  }

}
