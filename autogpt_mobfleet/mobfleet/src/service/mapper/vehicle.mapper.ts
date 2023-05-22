import { classToPlain, instanceToPlain, plainToClass, plainToClassFromExist, plainToInstance } from 'class-transformer';
import differenceInHours from 'date-fns/differenceInHours';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import max from 'date-fns/max';
import { CurrentVehicleState } from '../../domain/enumeration/current-vehicle-state';
import { ReservationStatus } from '../../domain/enumeration/reservation-status';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleMinimalDTO } from '../dto/vehicle.minimal.dto';
import { VehicleCreateDTO } from '../dto/vehicle-create.dto';
import { VehicleDTO } from '../dto/vehicle.dto';
import { LocationMapper } from './location.mapper';
import { MapperUtils } from './mapper.utils';
import { ReservationMapper } from './reservation.mapper';
import { VehicleGroupMapper } from './vehicle-group.mapper';
import { VehicleModelMapper } from './vehicle-model.mapper';
import { VehicleStatusLogMapper } from './vehicle-status-log.mapper';
import { ReservationDTO } from '../dto/reservation.dto';
import { Logger } from '@nestjs/common';
export type VehicleLog = Partial<Pick<VehicleDTO, 'chassis' | 'licensePlate' | 'renavam' | 'reservationStatus' | 'status' | 'positionUpdatedAt' | 'telemetryUpdatedAt' | 'deviceTelemetryUpdatedAt' | 'sensorsUpdatedAt'>>
  & { inProgressReservation?: Partial<Pick<ReservationDTO, 'pin' | 'status'>> };
/**
 * A Vehicle mapper object.
 */
export class VehicleMapper {

  static debug(vehicle: VehicleLog) {
    const { inProgressReservation, chassis, licensePlate, renavam, reservationStatus, status, positionUpdatedAt, telemetryUpdatedAt, deviceTelemetryUpdatedAt, sensorsUpdatedAt } = vehicle;

    try {
      new Logger('vehicle-mapper').debug(`[inProgressReservation:${inProgressReservation?.pin}-${inProgressReservation?.status}, chassis:${chassis}, licensePlate:${licensePlate}, renavam:${renavam}, reservationStatus:${reservationStatus}, status:${status}, positionUpdatedAt:${positionUpdatedAt?.toISOString()}, telemetryUpdatedAt:${telemetryUpdatedAt?.toISOString()}, deviceTelemetryUpdatedAt:${deviceTelemetryUpdatedAt?.toISOString()}, sensorsUpdatedAt:${sensorsUpdatedAt?.toISOString()}]`, 'VehicleChanged');
    } finally { }
  }

  static fromDTOtoEntity(entityDTO: VehicleDTO, debug = false): Vehicle {
    if (!entityDTO) {
      return;
    }
    const entity = new Vehicle();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    if (debug) {
      VehicleMapper.debug(entityDTO);
    }
    return entity;
  }


  static removeNull(entityDTO: VehicleCreateDTO): Vehicle {
    if (!entityDTO) {
      return;
    }

    const entity = new Vehicle();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields
      .filter(field => !!entityDTO[field])
      .forEach(field => {
        entity[field] = entityDTO[field];
      });
    return entity;
  }

  static fromCreateDTOtoEntity(entityDTO: VehicleCreateDTO, debug = false): Vehicle {
    if (!entityDTO) {
      return;
    }
    const entity = new Vehicle();
    const ignoreFields = ['vehicleGroup', 'vehicleModel', 'defaultHotspot', 'reservations', 'currentHotspot'];
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields
      .filter(field => !ignoreFields.includes(field))
      .forEach(field => {
        entity[field] = entityDTO[field];
      });
    if (debug) {
      VehicleMapper.debug(entityDTO);
    }
    return entity;
  }

  static fillVehicleState(entity: VehicleDTO): VehicleDTO {
    if (!entity) {
      return;
    }
    const now = Date.now();
    let vehicleState: CurrentVehicleState = CurrentVehicleState.AVAILABLE;

    const race = entity.inProgressReservation;
    if (race?.id && race.status == ReservationStatus.IN_PROGRESS) {
      if (isBefore(race.dateDevolution, now)) {
        vehicleState = CurrentVehicleState.OVERDUE;
      } else {
        vehicleState = CurrentVehicleState.IN_RACE;
      }
    } else {
      switch (entity.status) {
        case VehicleStatus.INACTIVE:
          vehicleState = CurrentVehicleState.OUT_OF_SERVICE;
          break;
        case VehicleStatus.MAINTENANCE:
          vehicleState = CurrentVehicleState.MAINTENANCE;
          break;
      }
    }
    entity.currentVehicleState = vehicleState;
    return entity;
  }

  static fillIsOnline(entity: VehicleDTO): VehicleDTO {
    if (!entity) {
      return;
    }
    const { positionUpdatedAt, telemetryUpdatedAt, deviceTelemetryUpdatedAt, sensorsUpdatedAt } = entity;
    entity.isOnline = differenceInHours(max([positionUpdatedAt, telemetryUpdatedAt, deviceTelemetryUpdatedAt, sensorsUpdatedAt]), new Date()) < 1;
    return entity;
  }

  static fromRawEntityToDTO(entity: any, debug = false): VehicleDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^vehicle_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('vehicle_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });
    entityDTO.vehicleModel = VehicleModelMapper.fromRawEntityToDTO(entity);
    entityDTO.vehicleGroup = VehicleGroupMapper.fromRawEntityToDTO(entity);
    entityDTO.inProgressReservation = ReservationMapper.fromRawInProgressEntityToDTO(entity);
    entityDTO.defaultHotspot = LocationMapper.fromRawEntityToDTO(entity);
    entityDTO.currentHotspot = LocationMapper.fromRawEntityToDTO(entity);
    if (debug) {
      VehicleMapper.debug(entityDTO);
    }
    return entityDTO;
  }
  static fromRawEntityToMinimalDTO(entity: any, debug = false): VehicleMinimalDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleMinimalDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^vehicle_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('vehicle_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });
    if (debug) {
      VehicleMapper.debug(entityDTO);
    }
    return plainToClass(VehicleMinimalDTO, entityDTO, { enableCircularCheck: true });
  }

  static fromEntityToDTO(entity: Vehicle, excludeSecrets = true): VehicleDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleDTO();

    let fields = Object.getOwnPropertyNames(entity);
    const remove = ['deviceBleUuid'];
    if (excludeSecrets) {
      fields = fields.filter(item => !remove.includes(item));
    }

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return this.fillIsOnline(this.fillVehicleState(entityDTO));
  }

  static fromEntityToMinimalDTO(entity: Vehicle): Record<string, any> {
    if (!entity) {
      return;
    }
    return instanceToPlain(entity, { enableCircularCheck: true, exposeUnsetFields: false });
  }

  static fromRawEntitysToDTO(entities: any[]): VehicleDTO[] {
    if (!entities) {
      return [];
    }

    const vehicleFields = MapperUtils.fieldsFromRaw(entities[0], 'vehicle');
    const vehicleModelMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'vehicleModel'));
    const vehicleGroupMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'vehicleGroup'));
    const inProgressReservationMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'inProgressReservation'));
    const defaultHotspotMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'defaultHotspot'));
    const currentHotspotMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'currentHotspot'));
    const contractMapper = MapperUtils.rawToDTOByFields(MapperUtils.fieldsFromRaw(entities[0], 'contract'));

    const entitiesDTO = entities.map(entity => {
      const entityDTO = new VehicleDTO();
      vehicleFields.forEach(([field, locationField]) => entityDTO[locationField] = entity[field]);
      entityDTO.vehicleModel = vehicleModelMapper(entity);
      entityDTO.vehicleGroup = vehicleGroupMapper(entity);
      entityDTO.inProgressReservation = inProgressReservationMapper(entity);
      entityDTO.defaultHotspot = defaultHotspotMapper(entity);
      entityDTO.currentHotspot = currentHotspotMapper(entity);
      entityDTO.contract = contractMapper(entity);

      return this.fillIsOnline(this.fillVehicleState(entityDTO));
    });

    return entitiesDTO;
  }

}
