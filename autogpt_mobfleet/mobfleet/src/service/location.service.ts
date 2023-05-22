import { Injectable, HttpException, HttpStatus, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition, SelectQueryBuilder } from 'typeorm';
import { LocationDTO } from '../service/dto/location.dto';
import { LocationMapper } from '../service/mapper/location.mapper';
import { LocationRepository } from '../repository/location.repository';
import { LocationType } from '../domain/enumeration/location-type';
import { ContractService } from './contract.service';
import { LocationOpeningHoursDTO } from './dto/location-opening-hours.dto';
import { GoogleMapsService } from './google-maps.service';
import { Location } from '../domain/location.entity';
import { AccountDTO } from './dto/account.dto';
import { ReportService } from './report.service';
import { Vehicle } from '../domain/vehicle.entity';

const relationshipNames = [];
relationshipNames.push('contract');




@Injectable()
export class LocationService {
  logger = new Logger('LocationService');

  constructor(
    @InjectRepository(LocationRepository) private locationRepository: LocationRepository,
    private contractService: ContractService,
    private googleMapsService: GoogleMapsService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
  ) { }

  addSelectVehiclesCount(qb: SelectQueryBuilder<Location>, vehicleAlias = 'vehicle', vehiclesCountAlias = 'location_vehiclesCount'): SelectQueryBuilder<Location> {
    const createVehicleSubQuery = subQuery => subQuery.from(Vehicle, vehicleAlias);
    const restrictByCurrentHotspot = subQuery => subQuery.where(`${vehicleAlias}.current_hotspot_id = ${qb.alias}.id`);
    const selectCount = subQuery => subQuery.select(`COUNT(${vehicleAlias}.id)`);
    const doSelect = sb => selectCount(restrictByCurrentHotspot(createVehicleSubQuery(sb)));
    
    return qb.addSelect(subQuery => doSelect(subQuery), vehiclesCountAlias)
  }

  async findById(id: number): Promise<LocationDTO | undefined> {
    const qb = this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :id', { id });

    const result = await this.addSelectVehiclesCount(qb).getRawOne();
    return LocationMapper.fromRawEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<LocationDTO>): Promise<LocationDTO | undefined> {
    const result = await this.locationRepository.findOne(options);
    return LocationMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    options: FindManyOptions<LocationDTO>,
    search?: string,
    filter?: any,
    contractID?: number,
  ): Promise<[LocationDTO[], number]> {
    options.relations = relationshipNames;
    let qb = this.locationRepository.createQueryBuilder('location');
    qb = qb.where('location.contract_id = :contractID', { contractID: +contractID });

    if (search) {
      qb = qb.andWhere('(location.description LIKE :search OR location.address LIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (filter) {
      const keys = Object.keys(filter).reduce(
        (array, current) => (filter[current] ? array.concat(LocationType[current]) : array),
        [],
      );
      qb = qb.andWhere('location.type in(:keys)', {
        keys,
      });
    }
    qb = qb
      .skip(options.skip)
      .take(options.take);

    qb = this.addSelectVehiclesCount(qb)
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getRawMany();
    const count = await qb.getCount();

    const locationDTO: LocationDTO[] = [];
    if (resultList) {
      resultList.forEach(location => locationDTO.push(LocationMapper.fromRawEntityToDTO(location)));
    }
    return [locationDTO, count];
  }

  async updateOpeningHours(
    id: number,
    locationOpeningHoursDTO: LocationOpeningHoursDTO,
    updater?: string,
  ): Promise<LocationDTO | undefined> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
    }

    LocationMapper.fromOpeninghoursDTOToEntity(locationOpeningHoursDTO, entity);

    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.locationRepository.save(entity);
    return LocationMapper.fromEntityToDTO(result);
  }

  private async updateTimezone(location: Location, lat: number, lon: number): Promise<void> {
    const fullTimezone = await this.googleMapsService.getTimezoneFromLatLon(lat, lon);
    this.logger.debug(fullTimezone, 'fullTimeZone');
    location.timezone = fullTimezone.timeZoneId;
  }
  async save(locationDTO: LocationDTO, contractID: number, creator: AccountDTO): Promise<LocationDTO | undefined> {
    const entity = LocationMapper.fromDTOtoEntity(locationDTO);
    await this.updateTimezone(entity, locationDTO.latitude, locationDTO.longitude);

    if (creator) {
      entity.lastModifiedBy = creator?.email;
    }
    entity.contract = await this.contractService.findById(+contractID, creator);
    const result = await this.locationRepository.save(entity);
    return LocationMapper.fromEntityToDTO(result);
  }

  async update(locationDTO: LocationDTO, updater?: string): Promise<LocationDTO | undefined> {
    const entity = LocationMapper.fromDTOtoEntity(locationDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.locationRepository.save(entity);
    return LocationMapper.fromEntityToDTO(result);
  }

  async updateById(id: number, locationDTO: LocationDTO, updater?: string): Promise<LocationDTO | undefined> {
    const entity = LocationMapper.fromDTOtoEntity(locationDTO);
    const location = await this.findById(id);

    if (updater) {
      entity.lastModifiedBy = updater;
    }

    if (location.latitude !== locationDTO.latitude || location.longitude !== locationDTO.longitude) {
      await this.updateTimezone(entity, locationDTO.latitude, locationDTO.longitude);
    }

    await this.locationRepository.update(+id, entity);
    return LocationMapper.fromEntityToDTO(await this.findById(id));
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.locationRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }


  async report(
    options: FindManyOptions<LocationDTO>,
    contractID: number,
    creator: AccountDTO
  ): Promise<void> {
    try {
      const queryBuilder = await this.locationRepository.report(contractID, options.order as OrderByCondition);
      await this.reportService.createXlsxStreamReport('locations', creator, await queryBuilder.stream());
    } catch (error) {
      this.logger.error(error, error, 'locations.report');
    }
  }

  async searchAddress(search: string, sessionToken: string): Promise<any | undefined> {
    return await this.googleMapsService.searchAddress(search, sessionToken);
  }

  async findLocationByLatLon(lat: number, lon: number, contractID: number): Promise<LocationDTO> {
    let qb = this.locationRepository.createQueryBuilder('location');

    qb = qb.where(
      `id = (SELECT id
      FROM (
      SELECT l.id,
          l.description,
          l.latitude, l.longitude,
          l.radius_m,
          :distanceUnit
                    * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(:lat))
                    * COS(RADIANS(l.latitude))
                    * COS(RADIANS(:lon - l.longitude))
                    + SIN(RADIANS(:lat))
                    * SIN(RADIANS(l.latitude))))) AS distance
      FROM locations AS l
      WHERE l.type = :locationType
      AND l.contract_id = :contractID
      AND l.latitude
        BETWEEN :lat  - (l.radius_m / :distanceUnit)
            AND :lat  + (l.radius_m / :distanceUnit)
      AND l.longitude
        BETWEEN :lon - (l.radius_m / (:distanceUnit * COS(RADIANS(:lat))))
            AND :lon + (l.radius_m / (:distanceUnit * COS(RADIANS(:lat))))
      ) AS d
      WHERE distance <= radius_m

      ORDER BY distance
      LIMIT 1)`,
      { lat: +lat, lon: +lon, distanceUnit: 111.045, locationType: LocationType.HOTSPOT, contractID },
    );
    return LocationMapper.fromEntityToDTO(await qb.getOne());
  }
}
