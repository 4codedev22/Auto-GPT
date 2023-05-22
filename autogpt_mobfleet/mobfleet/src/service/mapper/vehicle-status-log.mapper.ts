import { VehicleStatusLog } from '../../domain/vehicle-status-log.entity';
import { VehicleStatusLogDTO } from '../dto/vehicle-status-log.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A VehicleStatusLog mapper object.
 */
export class VehicleStatusLogMapper {

  static fromRawEntityToDTO(entity: any): VehicleStatusLogDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleStatusLogDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^vehicleStatusLogs_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('vehicleStatusLogs_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    return entityDTO;
  }
    static fromDTOtoEntity(entityDTO: VehicleStatusLogDTO): VehicleStatusLog {
        if (!entityDTO) {
            return;
        }
        const entity = new VehicleStatusLog();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: VehicleStatusLog): VehicleStatusLogDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new VehicleStatusLogDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
