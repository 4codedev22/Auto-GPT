import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Reservation } from '../../domain/reservation.entity';
import { ReservationCreateV1DTO } from '../dto/reservation-create-v1.dto';
import { ReservationCreateDTO } from '../dto/reservation-create.dto';
import { ReservationDTO } from '../dto/reservation.dto';
import { VehicleDTO } from '../dto/vehicle.dto';
import { MapperUtils } from './mapper.utils';

export type ReservationLog = Partial<Pick<ReservationDTO, 'pin' | 'dateWithdrawal' | 'dateDevolution' | 'dateStart' | 'dateFinish' | 'status' | 'type'>>
  & { vehicle?: Partial<Pick<VehicleDTO, 'id' | 'licensePlate'>> };
/**
 * A Reservation mapper object.
 */
export class ReservationMapper {

  static fromRawInProgressEntityToDTO(entity: any): ReservationDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ReservationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => f.indexOf('inProgressReservation_') === 0)
      .map(f => [f, MapperUtils.toCamel(f.replace('inProgressReservation_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    return entityDTO;
  }


  static fromRawEntityToDTO(entity: any, debug = false): ReservationDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ReservationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^reservation_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('reservation_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const locationField = fields[1];
        entityDTO[locationField] = entity[field];
      });

    if (debug) {
      ReservationMapper.debug(entityDTO);
    }
    return entityDTO;
  }

  static fromDTOtoEntity(entityDTO: ReservationDTO): Reservation {
    if (!entityDTO) {
      return;
    }
    const entity = new Reservation();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromCreateDTOtoEntity(entityDTO: ReservationCreateDTO, debug = false): Reservation {
    if (!entityDTO) {
      return;
    }
    const entity = new Reservation();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    if (debug) {
      ReservationMapper.debug(entityDTO);
    }
    return entity;
  }

  static fromCreateDTOtoV1DTO(entityDTO: ReservationCreateDTO): ReservationCreateV1DTO {
    if (!entityDTO) {
      return;
    }
    const entity = {
      destiny: entityDTO.destiny,
      destiny_latitude: entityDTO.destinyLatitude,
      destiny_longitude: entityDTO.destinyLongitude,
      date_withdrawal: entityDTO.dateWithdrawal,
      date_devolution: entityDTO.dateDevolution,
      origin_location_id: entityDTO.originLocation,
      devolution_location_id: entityDTO.devolutionLocation,
      account_id: entityDTO.accountId,
      vehicle_id: entityDTO.vehicleId,
      destiny_nickname: entityDTO.destinyNickname,
    } as ReservationCreateV1DTO;

    return entity;
  }


  static debug({ pin, dateWithdrawal, dateDevolution, dateStart, dateFinish, status, type, vehicle }: ReservationLog) {
    try {
      new Logger('reservation-mapper').debug(`pin:${pin}, vehicleId:${vehicle?.id}, licensePlate:${vehicle?.licensePlate}, dateWithdrawal:${dateWithdrawal}, dateDevolution:${dateDevolution}, dateStart:${dateStart}, dateFinish:${dateFinish}, status:${status}, type:${type}}`, 'ReservationChanged');
    } finally { }
  }

  static fromEntityToDTO(entity: Reservation, debug = false): ReservationDTO {
    if (!entity) {
      return;
    }
    const dto = plainToClass(ReservationDTO, entity, { enableCircularCheck: true });
    if (debug) {
      ReservationMapper.debug(dto);
    }
    return dto;
  }
}
