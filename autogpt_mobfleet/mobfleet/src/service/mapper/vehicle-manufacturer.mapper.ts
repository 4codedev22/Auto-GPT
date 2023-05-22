import { VehicleManufacturer } from '../../domain/vehicle-manufacturer.entity';
import { VehicleManufacturerDTO } from '../dto/vehicle-manufacturer.dto';

/**
 * A VehicleManufacturer mapper object.
 */
export class VehicleManufacturerMapper {
    static fromDTOtoEntity(entityDTO: VehicleManufacturerDTO): VehicleManufacturer {
        if (!entityDTO) {
            return;
        }
        const entity = new VehicleManufacturer();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: VehicleManufacturer): VehicleManufacturerDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new VehicleManufacturerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
