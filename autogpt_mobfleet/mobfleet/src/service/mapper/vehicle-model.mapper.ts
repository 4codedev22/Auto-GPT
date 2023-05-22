import { VehicleModel } from '../../domain/vehicle-model.entity';
import { VehicleModelCreateDTO } from '../dto/vehicle-model-create.dto';
import { VehicleModelDTO } from '../dto/vehicle-model.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A VehicleModel mapper object.
 */
export class VehicleModelMapper {

  static fromRawEntityToDTO(entity: any): VehicleModelDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleModelDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => f.indexOf('vehicleModel_') === 0)
      .map(f => [f, MapperUtils.toCamel(f.replace('vehicleModel_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    return entityDTO;
  }
  static fromCreateDTOtoEntity(vehicleModelDTO: VehicleModelCreateDTO) {
    if (!vehicleModelDTO) {
      return;
    }
    const entity = new VehicleModel();
    const ignoreFields = ['vehicleManufacturer', 'vehicles'];
    const fields = Object.getOwnPropertyNames(vehicleModelDTO);
    fields
      .filter(field => !ignoreFields.includes(field))
      .forEach(field => {
        entity[field] = vehicleModelDTO[field];
      });
    return entity;
  }
  static fromDTOtoEntity(entityDTO: VehicleModelDTO): VehicleModel {
    if (!entityDTO) {
      return;
    }
    const entity = new VehicleModel();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: VehicleModel): VehicleModelDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleModelDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
