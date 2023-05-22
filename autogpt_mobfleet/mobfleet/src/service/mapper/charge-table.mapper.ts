import { ChargeTable } from '../../domain/charge-table.entity';
import { ChargeTableDTO } from '../dto/charge-table.dto';


/**
 * A ChargeTable mapper object.
 */
export class ChargeTableMapper {

  static fromDTOtoEntity (entityDTO: ChargeTableDTO): ChargeTable {
    if (!entityDTO) {
      return;
    }
    let entity = new ChargeTable();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: ChargeTable): ChargeTableDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChargeTableDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
