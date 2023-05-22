import { VehicleGroup } from '../../domain/vehicle-group.entity';
import { VehicleGroupCreateDTO } from '../dto/vehicle-group-create.dto';
import { VehicleGroupDTO } from '../dto/vehicle-group.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A VehicleGroup mapper object.
 */
export class VehicleGroupMapper {

  static fromRawEntityToDTO(entity: any): VehicleGroupDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleGroupDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => f.indexOf('vehicleGroup_') === 0)
      .map(f => [f, MapperUtils.toCamel(f.replace('vehicleGroup_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    return entityDTO;
  }
  static fromCreateDTOtoEntity(vehicleGroupDTO: VehicleGroupCreateDTO): VehicleGroup {
    if (!vehicleGroupDTO) {
      return;
    }
    const entity = new VehicleGroup();
    const ignoreFields = ['vehicleManufacturer', 'vehicles'];
    const fields = Object.getOwnPropertyNames(vehicleGroupDTO);
    fields
      .filter(field => !ignoreFields.includes(field))
      .forEach(field => {
        entity[field] = vehicleGroupDTO[field];
      });
    return entity;
  }
  static fromDTOtoEntity(entityDTO: VehicleGroupDTO): VehicleGroup {
    if (!entityDTO) {
      return;
    }
    const entity = new VehicleGroup();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: VehicleGroup): VehicleGroupDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleGroupDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
