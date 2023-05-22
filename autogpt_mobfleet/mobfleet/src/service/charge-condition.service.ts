import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChargeConditionDTO }  from '../service/dto/charge-condition.dto';
import { ChargeConditionMapper }  from '../service/mapper/charge-condition.mapper';
import { ChargeConditionRepository } from '../repository/charge-condition.repository';

const relationshipNames = [];
    relationshipNames.push('chargeTable');


@Injectable()
export class ChargeConditionService {
    logger = new Logger('ChargeConditionService');

    constructor(@InjectRepository(ChargeConditionRepository) private chargeConditionRepository: ChargeConditionRepository) {}

      async findById(id: number): Promise<ChargeConditionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.chargeConditionRepository.findOne(id, options);
        return ChargeConditionMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ChargeConditionDTO>): Promise<ChargeConditionDTO | undefined> {
        const result = await this.chargeConditionRepository.findOne(options);
        return ChargeConditionMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ChargeConditionDTO>): Promise<[ChargeConditionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.chargeConditionRepository.findAndCount(options);
        const chargeConditionDTO: ChargeConditionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(chargeCondition => chargeConditionDTO.push(ChargeConditionMapper.fromEntityToDTO(chargeCondition)));
            resultList[0] = chargeConditionDTO;
        }
        return [chargeConditionDTO, resultList[1]];
      }

      async save(chargeConditionDTO: ChargeConditionDTO, creator?: string): Promise<ChargeConditionDTO | undefined> {
        const entity = ChargeConditionMapper.fromDTOtoEntity(chargeConditionDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.chargeConditionRepository.save(entity);
        return ChargeConditionMapper.fromEntityToDTO(result);
      }

      async update(chargeConditionDTO: ChargeConditionDTO, updater?: string): Promise<ChargeConditionDTO | undefined> {
        const entity = ChargeConditionMapper.fromDTOtoEntity(chargeConditionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.chargeConditionRepository.save(entity);
        return ChargeConditionMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.chargeConditionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
