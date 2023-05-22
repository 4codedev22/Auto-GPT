import { Alert } from '../../domain/alert.entity';
import { AlertDTO } from '../dto/alert.dto';

/**
 * A Alert mapper object.
 */
export class CardMapper {
    static fromDTOtoEntity(entityDTO: AlertDTO): Alert {
        if (!entityDTO) {
            return;
        }
        const entity = new Alert();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Alert): AlertDTO {
        if (!entity) {
            return null;
        }
        const entityDTO = new AlertDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
