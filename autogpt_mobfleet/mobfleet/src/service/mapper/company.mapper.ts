import { Company } from '../../domain/company.entity';
import { CompanyDTO } from '../dto/company.dto';
import { BaseMapper } from './base.mapper';

/**
 * A Company mapper object.
 */
export class CompanyMapper {
    static fromDTOtoEntity(entityDTO: CompanyDTO): Company {
        if (!entityDTO) {
            return;
        }
        const entity = new Company();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Company): CompanyDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new CompanyDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }

    static fromEntities(entities: Company[]): CompanyDTO[] {
        return BaseMapper.fromEntities(entities, CompanyMapper.fromEntityToDTO);
    }

    static fromDTOs(dtos: CompanyDTO[]): Company[] {
        return BaseMapper.fromDTOs(dtos, CompanyMapper.fromDTOtoEntity);
    }

    static fromEntitiesWithCount(entities: [Company[], number]): [CompanyDTO[], number] {
        return BaseMapper.fromEntitiesWithCount(entities, CompanyMapper.fromEntityToDTO);
    }

    static fromDTOsWithCount(dtos: [CompanyDTO[], number]): [Company[], number] {
        return BaseMapper.fromDTOsWithCount(dtos, CompanyMapper.fromDTOtoEntity);
    }

}
