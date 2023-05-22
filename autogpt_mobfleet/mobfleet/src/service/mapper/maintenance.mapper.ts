import { Maintenance } from '../../domain/maintenance.entity';
import { MaintenanceDTO } from '../dto/maintenance.dto';

/**
 * A Maintenance mapper object.
 */
export class MaintenanceMapper {
    static fromDTOtoEntity(entityDTO: MaintenanceDTO): Maintenance {
        if (!entityDTO) {
            return;
        }
        const entity = new Maintenance();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Maintenance): MaintenanceDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new MaintenanceDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
