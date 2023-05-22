import { plainToClass } from 'class-transformer';
import { Location } from '../../domain/location.entity';
import { OpenningHours } from '../../domain/openning-hours.entity';
import { LocationOpeningHoursDTO } from '../dto/location-opening-hours.dto';
import { LocationDTO } from '../dto/location.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A Location mapper object.
 */
export class LocationMapper {
  static fromDTOtoEntity(entityDTO: LocationDTO): Location {
    if (!entityDTO) {
      return;
    }
    return plainToClass(Location, entityDTO, { enableCircularCheck: true });
  }

  static fromEntityToDTO(entity: Location): LocationDTO {
    if (!entity) {
      return;
    }
    return plainToClass(LocationDTO, entity, { enableCircularCheck: true });
  }

  static fromRawEntityToDTO(entity: any, alias = 'location'): LocationDTO {
    const startAlias = `${alias}_`
    if (!entity) {
      return;
    }
    const entityDTO = new LocationDTO();

    const fields = Object.getOwnPropertyNames(entity).filter(f => f.indexOf(startAlias) === 0);

    fields
      .map(f => [f, MapperUtils.toCamel(f.replace(startAlias, ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];

        if (locationField === 'vehiclesCount') {
          entityDTO[locationField] = +entity[field];
        } else {
          entityDTO[locationField] = entity[field];
        }
      });

    return entityDTO;
  }

  static fromOpeninghoursDTOToEntity(openingHoursDTO: LocationOpeningHoursDTO, entity: Location): Location {
    const transfer = (fieldName: string) => {
      entity[fieldName] = plainToClass(OpenningHours, openingHoursDTO[fieldName]);
    };
    transfer('openingHoursMonday');
    transfer('openingHoursTuesday');
    transfer('openingHoursWednesday');
    transfer('openingHoursThursday');
    transfer('openingHoursFriday');
    transfer('openingHoursSaturday');
    transfer('openingHoursSunday');

    return entity;
  }
}
