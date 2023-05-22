import { Role } from '../../domain/role.entity';
import { RoleDTO } from '../dto/role.dto';
import { BaseMapper } from './base.mapper';

/**
 * A Role mapper object.
 */
export class RoleMapper {
    static fromDTOtoEntity(entityDTO: RoleDTO): Role {
        if (!entityDTO) {
            return;
        }
        const entity = new Role();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Role): RoleDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new RoleDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }

    static fromEntities(entities: Role[]): RoleDTO[] {
        return BaseMapper.fromEntities(entities, RoleMapper.fromEntityToDTO);
    }

    static fromDTOs(dtos: RoleDTO[]): Role[] {
        return BaseMapper.fromDTOs(dtos, RoleMapper.fromDTOtoEntity);
    }

    static fromEntitiesWithCount(entities: [Role[], number]): [RoleDTO[], number] {
        return BaseMapper.fromEntitiesWithCount(entities, RoleMapper.fromEntityToDTO);
    }
    
    static fromDTOsWithCount(dtos: [RoleDTO[], number]): [Role[], number] {
        return BaseMapper.fromDTOsWithCount(dtos, RoleMapper.fromDTOtoEntity);
    }
}
