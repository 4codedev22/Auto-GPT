import { Damage } from '../../domain/damage.entity';
import { DamageCreateDTO } from '../dto/damage-create.dto';
import { DamageDTO } from '../dto/damage.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A Damage mapper object.
 */
export class DamageMapper {
    
  static fromRawEntityToDTO(entity: any): DamageDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new DamageDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^damage_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('damage_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const normalizedField = fields[1];
        entityDTO[normalizedField] = entity[field];
      });

    return entityDTO;
  }
    static fromCreateDTOtoEntity(entityDTO: DamageCreateDTO): Damage {
        if (!entityDTO) {
            return;
        }
        const entity = new Damage();
        const ignoreFields = [];
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields
            .filter(field => !ignoreFields.includes(field))
            .forEach(field => {
                entity[field] = entityDTO[field];
            });
        return entity;
    }
    static fromDTOtoEntity(entityDTO: DamageDTO): Damage {
        if (!entityDTO) {
            return;
        }
        const entity = new Damage();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Damage): DamageDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new DamageDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
