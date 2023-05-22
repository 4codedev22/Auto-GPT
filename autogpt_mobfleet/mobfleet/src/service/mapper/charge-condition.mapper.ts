import { ChargeCondition } from '../../domain/charge-condition.entity';
import { ChargeConditionDTO } from '../dto/charge-condition.dto';


/**
 * A ChargeCondition mapper object.
 */
export class ChargeConditionMapper {

  static fromDTOtoEntity (entityDTO: ChargeConditionDTO): ChargeCondition {
    if (!entityDTO) {
      return;
    }
    let entity = new ChargeCondition();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: ChargeCondition): ChargeConditionDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChargeConditionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
