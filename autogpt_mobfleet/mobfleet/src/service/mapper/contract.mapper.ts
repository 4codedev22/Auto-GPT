import { plainToClass } from 'class-transformer';
import { Contract } from '../../domain/contract.entity';
import { ContractCreateWithCompanyAndVehicleGroupsDTO } from '../dto/contract-create-with-company-and-vehicle-groups.dto';
import { ContractCreateDTO } from '../dto/contract-create.dto';
import { ContractDTO } from '../dto/contract.dto';
import { BaseMapper } from './base.mapper';
import { MapperUtils } from './mapper.utils';

/**
 * A Contract mapper object.
 */
export class ContractMapper {
  static fromDTOtoEntity(entityDTO: ContractDTO): Contract {
    if (!entityDTO) {
      return;
    }
    const entity = new Contract();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromRawEntityToDTO(entity: any): ContractDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ContractDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => f.indexOf('contract_') === 0)
      .map(f => [f, MapperUtils.toCamel(f.replace('contract_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    return entityDTO;
  }


  static fromDTOWithCompanyAndVehicleGroupstoDTO(entityDTO: ContractCreateWithCompanyAndVehicleGroupsDTO): ContractCreateDTO {
    if (!entityDTO) {
      return;
    }
    return plainToClass(ContractCreateDTO, entityDTO, { enableCircularCheck: true });
  }

  static fromCreateDTOtoEntity(entityDTO: ContractCreateDTO): Contract {
    if (!entityDTO) {
      return;
    }
    const entity = new Contract();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Contract): ContractDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ContractDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }

  static fromEntities(entities: Contract[]): ContractDTO[] {
    return BaseMapper.fromEntities(entities, ContractMapper.fromEntityToDTO);
  }

  static fromDTOs(dtos: ContractDTO[]): Contract[] {
    return BaseMapper.fromDTOs(dtos, ContractMapper.fromDTOtoEntity);
  }

  static fromEntitiesWithCount(entities: [Contract[], number]): [ContractDTO[], number] {
    return BaseMapper.fromEntitiesWithCount(entities, ContractMapper.fromEntityToDTO);
  }

  static fromDTOsWithCount(dtos: [ContractDTO[], number]): [Contract[], number] {
    return BaseMapper.fromDTOsWithCount(dtos, ContractMapper.fromDTOtoEntity);
  }

}
