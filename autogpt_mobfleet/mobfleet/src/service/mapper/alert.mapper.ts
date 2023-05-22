import { Alert } from '../../domain';
import { AlertDTO } from '../dto';

/**
 * A Alert mapper object.
 */
export class AlertMapper {
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
            return;
        }
        const entityDTO = new AlertDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }

}
