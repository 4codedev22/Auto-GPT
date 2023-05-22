import { Charge } from '../../domain/charge.entity';
import { ChargeDTO } from '../dto/charge.dto';


/**
 * A Charge mapper object.
 */
export class ChargeMapper {

  static fromDTOtoEntity(entityDTO: ChargeDTO): Charge {
    if (!entityDTO) {
      return;
    }
    let entity = new Charge();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO(entity: Charge): ChargeDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChargeDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
