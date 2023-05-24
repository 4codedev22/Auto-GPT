import { Injectable, HttpException, HttpStatus, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition, SelectQueryBuilder } from 'typeorm';
import { VehicleDTO } from './dto/vehicle.dto';
import { VehicleMapper } from './mapper/vehicle.mapper';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleStatus } from '../domain/enumeration/vehicle-status';
import { LocationService } from './location.service';
import { VehicleCreateDTO } from './dto/vehicle-create.dto';
import { AccountDTO } from './dto/account.dto';
import { VehicleGroupService } from './vehicle-group.service';
import { VehicleModelService } from './vehicle-model.service';
import { ConfigService } from './config.service';
import { ContractService } from './contract.service';
import { add, format, parseJSON } from 'date-fns';
import { UploadService } from '../module/shared/upload.service';
import { VehicleCalendarFilterDTO } from './dto/vehicle-calendar.filter.dto';
import { VehicleStatusLogService } from './vehicle-status-log.service';
import { ReservationDTO } from './dto/reservation.dto';
import { DamageService } from './damage.service';
import { VehicleStatusChangeBodyDTO } from './dto/vehicle-status-change-body.dto';
import { Type } from 'class-transformer';
import { VehicleMinimalFilterDTO } from './dto/vehicle-minimal.filter.dto';
import { VehicleMinimalDTO } from './dto/vehicle.minimal.dto';
import { ReportService } from './report.service';
import { VehicleDashboardFilterDTO } from './dto/vehicle-dashboard.filter.dto';
import { ReservationStatus } from '../domain/enumeration/reservation-status';
import { LocationDTO } from './dto/location.dto';
import { VehicleTrackingService } from './vehicle-tracking.service';
import { IsDate, IsOptional, isString } from 'class-validator';
import { VehicleTrackingResultDTO } from './dto/vehicle-tracking-data.dto';
import { VehicleFilterDTO } from './dto/vehicle-filter.dto';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleLocationPathsDTO, VehicleTrackingDTO } from './dto/vehicle-tracking.dto';
import { Alert } from '../domain/alert.entity';
import { VehicleStatusLogDTO } from './dto/vehicle-status-log.dto';
import { addSelectFieldsFromFilters } from '../repository/utils';
import { parseOrSameValue } from '../json-util';

export class TrackingParamsType {

  @IsOptional()
  user?: AccountDTO;

  @IsOptional()
  contractID?: number;

  @IsOptional()
  vehicleID?: number;
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fromDateAndTime?: Date;
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  toDateAndTime?: Date;

  @IsOptional()
  paginationHash?: string;

  @IsOptional()
  paginationRange?: string;

  @IsOptional()
  limit?: number | string;
}

const relationshipNames = [];
relationshipNames.push('contract');
relationshipNames.push('vehicleGroup');
relationshipNames.push('inProgressReservation');
relationshipNames.push('vehicleModel');
relationshipNames.push('vehicleStatusLogs');
relationshipNames.push('defaultHotspot');
relationshipNames.push('currentHotspot');

const fullRelationshipNames = [];
fullRelationshipNames.push('vehicleGroup');
fullRelationshipNames.push('inProgressReservation');
fullRelationshipNames.push('vehicleModel');
fullRelationshipNames.push('vehicleStatusLogs');
fullRelationshipNames.push('vehicleStatusLogs.createdBy');
fullRelationshipNames.push('currentHotspot');
fullRelationshipNames.push('contract');
fullRelationshipNames.push('damages');
fullRelationshipNames.push('checklists');
fullRelationshipNames.push('commandLogs');
fullRelationshipNames.push('maintenances');
fullRelationshipNames.push('ratings');
fullRelationshipNames.push('defaultHotspot');

@Injectable()
export class VehicleService {

  logger = new Logger('VehicleService');

  basicSelectFields = ['id', 'licensePlate', 'status', 'chassis', 'dateResetAlertsQuantity'];

  constructor(
    @InjectRepository(VehicleRepository)
    private vehicleRepository: VehicleRepository,
    private locationService: LocationService,
    private vehicleGroupService: VehicleGroupService,
    private vehicleModelService: VehicleModelService,
    private configService: ConfigService,
    private contractService: ContractService,
    private uploadService: UploadService,
    private vehicleStatusLogService: VehicleStatusLogService,
    @Inject(forwardRef(() => DamageService))
    private damageService: DamageService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
    @Inject(forwardRef(() => VehicleTrackingService))
    private vehicleTrackingService: VehicleTrackingService,
  ) { }

  private getBasicSelectFields (filter: VehicleFilterDTO) {
    let fields = [];
    let projectFields = filter?.fields?.split?.(',') || [];

    if (projectFields?.includes('isOnline')) {
      fields = [
        ...fields,
        'positionUpdatedAt',
        'telemetryUpdatedAt',
        'deviceTelemetryUpdatedAt',
        'sensorsUpdatedAt'
      ];
    } 
    
    if (projectFields?.includes('currentVehicleState')) {
      fields.push('inProgressReservation');
    }

    const treatedFields = [
      ...new Set([...fields, ...this.basicSelectFields])
    ];

    return treatedFields;
  }

  private filterByFields(
    queryBuilder: SelectQueryBuilder<Vehicle>,
    { status, hotspot, ...filters }: VehicleFilterDTO,
  ) {
    Object.keys(filters).forEach((queryKey) => {
      const queryValue = filters[queryKey];
      if (queryValue !== undefined && queryValue !== null) {
        queryBuilder = queryBuilder.andWhere(
          `vehicle.${queryKey} = :${queryKey}`,
          { [queryKey]: queryValue }
        )
      }
    });

    if (status) {
      queryBuilder = queryBuilder.andWhere('vehicle.status in (:keys)', {
        keys: Array.isArray(status) ? status : [status],
      });
    }

    if (hotspot) {
      queryBuilder = queryBuilder.andWhere(
        '(currentHotspot.description LIKE :search OR defaultHotspot.description LIKE :search)',
        { search: hotspot }
      );
    }

    return queryBuilder;
  }

  private addSelectAlertsCount(
    qb: SelectQueryBuilder<Vehicle>,
    alertAlias = 'alert',
    alertCountAlias = 'activeAlertsQty'
  ): SelectQueryBuilder<Vehicle> {
    const createVehicleSubQuery = subQuery => subQuery.from(Alert, alertAlias);
    const restrictByChassisAndResetAlertDate =
      (subQuery: SelectQueryBuilder<any>) => 
        subQuery.where(`${alertAlias}.vehicleIdentifier = ${qb.alias}.chassis`)
        .andWhere(`${alertAlias}.status = '1'`)
        .andWhere(`(${qb.alias}.dateResetAlertsQuantity is NULL OR ${alertAlias}.createdAt > ${qb.alias}.dateResetAlertsQuantity)`);
    const selectCount = subQuery => subQuery.select(`COUNT(*)`);
    const doSelect = sb => restrictByChassisAndResetAlertDate(createVehicleSubQuery(selectCount(sb)));

    return qb.addSelect(subQuery => doSelect(subQuery), alertCountAlias);
  }

  private addSelectHasAlerts(
    qb: SelectQueryBuilder<Vehicle>,
    alertAlias = 'alert',
    alertCountAlias = 'vehicle_hasActiveAlerts'
  ): SelectQueryBuilder<Vehicle> {
    const createVehicleSubQuery = subQuery => subQuery.from(Alert, alertAlias);
    const restrictByChassisAndResetAlertDate =
      (subQuery: SelectQueryBuilder<any>) => 
        subQuery
          .where(`${alertAlias}.vehicleIdentifier = ${qb.alias}.chassis`)
          .andWhere(`${alertAlias}.status = '1'`)
          .andWhere(`(${qb.alias}.dateResetAlertsQuantity is NULL OR ${alertAlias}.createdAt > ${qb.alias}.dateResetAlertsQuantity)`)
          .limit(1);
    const selectCount = subQuery => subQuery.select(`1`);
    const doSelect = sb => restrictByChassisAndResetAlertDate(createVehicleSubQuery(selectCount(sb)));
 
    return qb.addSelect(`IFNULL(${doSelect(qb.subQuery()).getQuery()}, 0)`, alertCountAlias);
  }

  async updateAfterCancelReservation(reservation: ReservationDTO): Promise<void> {
    const vehicle = VehicleMapper.fromDTOtoEntity(reservation?.vehicle, true);
    vehicle.unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(vehicle?.id);
    await this.vehicleRepository.update(vehicle?.id, vehicle);
  }


  async listTracking({ user, contractID, vehicleID, fromDateAndTime, toDateAndTime, paginationHash, paginationRange, limit }: TrackingParamsType): Promise<VehicleTrackingResultDTO> {
    const getDate = (value?: string | Date) => isString(value) ? parseJSON(value) : value
    return await this.vehicleTrackingService.list(user, contractID, vehicleID, getDate(fromDateAndTime), getDate(toDateAndTime), paginationHash, paginationRange, limit);
  }

  async listAllTrackingHistory({ user, contractID, vehicleID, fromDateAndTime, toDateAndTime }: TrackingParamsType): Promise<VehicleLocationPathsDTO[]> {
    const getDate = (value?: string | Date) => isString(value) ? parseJSON(value) : value;
    const contract = await this.contractService.findById(contractID, user);
    const vehicle = await this.findByIdContract(vehicleID, contractID);
    return this.vehicleTrackingService.buildFullTrackingHistoryList(contract, vehicle, getDate(fromDateAndTime), getDate(toDateAndTime));
    // return await this.vehicleTrackingService.listAll(user, contractID, vehicleID, getDate(fromDateAndTime), getDate(toDateAndTime));
  }



  async updateCountUnsolvedDamages(vehicleId: number): Promise<void> {
    const unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(vehicleId);
    await this.vehicleRepository.update(+vehicleId, { unsolvedDamagesQty });
  }

  async updateAfterFinishReservation(vehicleDTO: VehicleDTO, reservationId?: number): Promise<void> {
    const config = await this.configService.findByContract(vehicleDTO.contract?.id);
    const changeStatusToMantainance = parseOrSameValue(config?.['vehicle_damages.change_status_to_mantainance']);
    const vehicle = VehicleMapper.fromDTOtoEntity(vehicleDTO, true);
    vehicle.inProgressReservation = null;
    vehicle.reservationStatus = ReservationStatus.OPEN;

    if (changeStatusToMantainance) {
      const hasDamageInReservation = await this.damageService.findByFields({
        where: { reservation: reservationId },
        select: ['id']
      });
      vehicle.status = hasDamageInReservation ? VehicleStatus.MAINTENANCE : vehicle.status;
    }

    vehicle.unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(vehicle?.id);
    await this.vehicleRepository.update(vehicle?.id, vehicle);
  }

  async updateAfterStartReservation(reservation: ReservationDTO): Promise<void> {
    const vehicle = VehicleMapper.fromDTOtoEntity(reservation?.vehicle, true);
    vehicle.inProgressReservation = reservation;
    vehicle.reservationStatus = reservation.status;
    vehicle.unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(vehicle?.id);
    await this.vehicleRepository.update(vehicle?.id, vehicle);
  }
  async findById(id: number): Promise<VehicleDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.vehicleRepository.findOne(id, options);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async updateVehicleStatusById(id: number, newStatus: VehicleStatus, updater: AccountDTO, reason: VehicleStatusChangeBodyDTO): Promise<VehicleDTO | undefined> {

    if (!newStatus) {
      throw new BadRequestException('invalid status', `The status ${newStatus} not found`);
    }
    const entity = await this.vehicleRepository.findOne(id);
    if (!entity?.id) {
      throw new NotFoundException('Vehicle Not Found', `Vehicle ID ${id} not found`);
    }
    if (entity.status === newStatus) {
      throw new BadRequestException('invalid status', `The vehicle is already in this status: ${newStatus}`);
    }

    if (updater) {
      entity.lastModifiedBy = updater.email;
    }

    entity.status = newStatus;

    VehicleMapper.debug(entity);
    await this.vehicleRepository.update(id, entity);
    const vehicleLogStatus = {
      vehicle: entity,
      createdBy: updater,
      status: newStatus,
      reason: reason?.reason
    };
    try {
      await this.vehicleStatusLogService.save(vehicleLogStatus as VehicleStatusLogDTO, updater?.email);
    } catch (error) {
      this.logger.error(vehicleLogStatus, null, 'cannot create status log');
      this.logger.error(error, null, 'cannot create status log');
    }
    return await this.findById(id);
  }

  async findByIdContractAndUser(id: number, contractID: number, userID: number): Promise<VehicleDTO | undefined> {
    let qb = this.vehicleRepository.createQueryBuilder('vehicle');
    qb = qb
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.vehicleStatusLogs', 'vehicleStatusLogs')
      .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
      .where('vehicle.id = :id and vehicle.contract_id = :contractID', { id, contractID, userID });
    qb = this.addSelectAlertsCount(qb);
    const rawResult = await qb.getRawOne();
    const result = VehicleMapper.fromRawEntityToDTO(rawResult);
    if (!result) {
      throw new NotFoundException('no vehicle found');
    }

    const hideBleUUID =
      !!!rawResult?.inProgressReservation_id || +rawResult?.inProgressReservation_account_id !== userID;
    return VehicleMapper.fromEntityToDTO(result, hideBleUUID);
  }

  async findByIdContractAndUserWithAllData(id: number, contractID: number, userID: number): Promise<VehicleDTO | undefined> {
    const lastVl = await this.vehicleStatusLogService.findLastIdOfStatusLogFromVehicle(id);
    let qb = this.vehicleRepository.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
      .leftJoinAndSelect('inProgressReservation.account', 'account')
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.currentHotspot', 'currentHotspot')
      .leftJoinAndSelect('vehicle.contract', 'contract')
      .leftJoinAndSelect('vehicle.defaultHotspot', 'defaultHotspot')
      .leftJoinAndSelect('vehicle.vehicleStatusLogs', 'vehicleStatusLogs', 'vehicleStatusLogs.id = :lastVehicleLog', { lastVehicleLog: lastVl })
      .where('vehicle.id = :id and vehicle.contract_id = :contractID', { id, contractID });
    qb = this.addSelectAlertsCount(qb);

    const vehicleAndRaw = await qb.getRawAndEntities();
    const result = vehicleAndRaw?.entities[0];
    if (!result) {
      throw new NotFoundException('no vehicle found');
    }

    const hideBleUUID =
      !!!result?.inProgressReservation?.id || +result?.inProgressReservation?.account?.id !== userID;

    if (hideBleUUID) {
      result.deviceBleUuid = null;
    }
  
    const vehicleDTO = VehicleMapper.fromEntityToDTO(result, hideBleUUID);
    vehicleDTO.activeAlertsQty = vehicleAndRaw?.raw[0].activeAlertsQty;

    return vehicleDTO;
  }

  async findByIdContract(id: number, contractID: number): Promise<VehicleDTO | undefined> {
    let qb = this.vehicleRepository.createQueryBuilder('vehicle');
    qb = qb
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
      .where('vehicle.id = :id and vehicle.contract_id = :contractID', { id, contractID });
    qb = this.addSelectAlertsCount(qb);
    const rawResult = await qb.getRawOne();
    const result = VehicleMapper.fromRawEntityToDTO(rawResult);
    if (!result) {
      throw new NotFoundException('no vehicle found');
    }

    const hideBleUUID = !!!rawResult?.inProgressReservation_id;
    return VehicleMapper.fromEntityToDTO(result, !hideBleUUID);
  }

  async findByFields(options: FindOneOptions<VehicleDTO>): Promise<VehicleDTO | undefined> {
    const result = await this.vehicleRepository.findOne(options as FindOneOptions);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async createWithFiles(
    files: { pictureImage?: Express.Multer.File; document?: Express.Multer.File },
    vehicleDTO: VehicleCreateDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<VehicleDTO | undefined> {
    const vehicle = VehicleMapper.fromCreateDTOtoEntity(vehicleDTO);
    if (files?.pictureImage) {
      try {
        const pictureFile = files.pictureImage;
        const cnhData = await this.uploadService.uploadFile(pictureFile.buffer, pictureFile.originalname);
        vehicle.pictureLink = cnhData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-pictureFile');
      }
    }

    if (files?.document) {
      try {
        const documentFile = files.document;
        const documentData = await this.uploadService.uploadFile(
          documentFile.buffer,
          documentFile.originalname,
        );
        vehicle.licenseLink = documentData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-documentFile');
      }
    }
    vehicle.vehicleModel = await this.vehicleModelService.findById(+vehicleDTO.vehicleModelId);
    vehicle.vehicleGroup = await this.vehicleGroupService.findById(+vehicleDTO.vehicleGroupId);
    vehicle.contract = await this.contractService.findById(+contractID, creator);
    vehicle.defaultHotspot = await this.locationService.findById(+vehicleDTO.defaultHotspotId);
    if (creator) {
      vehicle.lastModifiedBy = creator.email;
    }
    const result = await this.vehicleRepository.save(vehicle);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async create(
    vehicleDTO: VehicleCreateDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<VehicleDTO | undefined> {
    const vehicle = VehicleMapper.fromCreateDTOtoEntity(vehicleDTO);
    vehicle.vehicleModel = await this.vehicleModelService.findById(+vehicleDTO.vehicleModelId);
    vehicle.vehicleGroup = await this.vehicleGroupService.findById(+vehicleDTO.vehicleGroupId);
    vehicle.contract = await this.contractService.findById(+contractID, creator);
    vehicle.defaultHotspot = await this.locationService.findById(+vehicleDTO.defaultHotspotId);
    if (creator) {
      vehicle.lastModifiedBy = creator.email;
    }
    const result = await this.vehicleRepository.save(vehicle);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async countByLocation(locationID: number): Promise<number> {
    let qb = this.vehicleRepository.createQueryBuilder('vehicle');
    qb = qb.where('vehicle.default_hotspot_id = :locationID', { locationID: +locationID });
    return await qb.getCount();
  }

  async findAllAndCountByLocation(locationID: number): Promise<[VehicleDTO[], number]> {
    let qb = this.vehicleRepository.createQueryBuilder('vehicle');
    qb = qb.where('vehicle.default_hotspot_id = :locationID', { locationID: +locationID });
    const resultList = await qb.getManyAndCount();

    const vehicleDTO: VehicleDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicle => vehicleDTO.push(VehicleMapper.fromEntityToDTO(vehicle)));
      resultList[0] = vehicleDTO;
    }
    return [vehicleDTO, resultList[1]];
  }

  async findAndCount(
    options: FindManyOptions<VehicleDTO>,
    filter?: VehicleFilterDTO,
    contractID?: any,
  ): Promise<[VehicleDTO[], number]> {

    let qb = this.vehicleRepository.createQueryBuilder('vehicle')
      .where('contract.id = :contractID', { contractID: +contractID });

    if (filter.search) {
      qb = qb.andWhere(
        `(vehicle.chassis LIKE :search
        OR vehicle.licensePlate LIKE :search
        OR vehicle.renavam LIKE :search
        OR vehicleModel.name LIKE :search
        OR vehicleGroup.name LIKE :search
        OR defaultHotspot.description LIKE :search
        OR currentHotspot.description LIKE :search)`,
        { search: `%${filter.search}%` },
      );
    }

    qb = this.filterByFields(
      qb,
      {
        id: filter.id,
        licensePlate: filter.licensePlate,
        status: filter.status,
        hotspot: filter.hotspot,
        vehicleGroup: filter.vehicleGroup,
      }
    );

    qb = qb
      .offset(options.skip)
      .limit(options.take)
      .orderBy(options.order as OrderByCondition)
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.defaultHotspot', 'defaultHotspot')
      .leftJoinAndSelect('vehicle.currentHotspot', 'currentHotspot')
      .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
      .leftJoinAndSelect('vehicle.contract', 'contract');
    
    qb = addSelectFieldsFromFilters(
      qb,
      this.getBasicSelectFields(filter),
      filter,
      ['hasActiveAlerts', 'currentVehicleState', 'isOnline']
    );

    if (!filter?.fields || filter?.fields?.includes('hasActiveAlerts')) {
      qb = this.addSelectHasAlerts(qb);
    }
  
    const raw = await qb.getRawMany();
    const count = await qb.getCount();

    return [VehicleMapper.fromRawEntitysToDTO(raw), count];
  }

  async findAndCountByVehicleCalendarFilter(
    options: FindManyOptions<VehicleDTO>,
    contractID: number,
    filter: VehicleCalendarFilterDTO,
  ): Promise<[VehicleDTO[], number]> {
    this.logger.debug({ options, contractID, filter });
    const result = await this.vehicleRepository.findAndCountByVehicleCalendarFilter(contractID, { ...filter }, options.skip, options.take, options.order as OrderByCondition);
    const [vehicleList, count] = result;
    return [vehicleList.map(vehicle => VehicleMapper.fromEntityToDTO(vehicle)), count];

  }


  async findAndCountByVehicleDashboardFilter(
    options: FindManyOptions<VehicleDTO>,
    contractID: number,
    filter: VehicleDashboardFilterDTO,
  ): Promise<[VehicleDTO[], number]> {
    this.logger.debug({ options, contractID, filter });
    const result = await this.vehicleRepository.findAndCountByVehicleDashboardFilter(contractID, { ...filter }, options.skip, options.take, options.order as OrderByCondition);
    const [vehicleList, count] = result;
    return [vehicleList.map(vehicle => VehicleMapper.fromEntityToDTO(vehicle)), count];

  }



  async findAndCountByVehicleMinimalFilter(
    { skip, take, order }: FindManyOptions<VehicleDTO>,
    contractID: number,
    filter: VehicleMinimalFilterDTO,
  ): Promise<[VehicleMinimalDTO[], number]> {

    const result = await this.vehicleRepository.findAndCountByVehicleMinimalFilter(contractID, { ...filter }, skip, take, order as OrderByCondition);
    const [vehicleList, count] = result;
    return [vehicleList.map(vehicle => VehicleMapper.fromEntityToMinimalDTO(vehicle)), count];

  }
  async report(
    options: FindManyOptions<VehicleDTO>,
    contractID: number,
    filter: Omit<VehicleCalendarFilterDTO, 'date'>,
    creator: AccountDTO
  ): Promise<void> {
    try {
      const queryBuilder = await this.vehicleRepository.report(contractID, filter, options.order as OrderByCondition);
      await this.reportService.createXlsxStreamReport('vehicles', creator, await queryBuilder.stream());
    } catch (error) {
      this.logger.error(error, error, 'vehicles.report');
    }
  }


  private isNow(d: Date): boolean {
    const limit = Math.abs(+process.env.RESERVATIONS_CONFLICT_MINUTES);
    const date = this.addMinutes(new Date(), limit);
    return date.getTime() > d.getTime();
  }
  private formaDatetime(date: Date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  async listByAvailability(
    options: FindManyOptions<VehicleDTO>,
    datetimeWithdrawal?: Date,
    datetimeDevolution?: Date,
    locationID?: number,
    contractID?: number,
    user?: AccountDTO,
  ): Promise<[VehicleDTO[], number]> {
    const conflictMinutes = +process.env.RESERVATIONS_CONFLICT_MINUTES;
    const preparedDatetimeWithdrawal = this.addMinutes(datetimeWithdrawal, -conflictMinutes);
    const preparedDatetimeDevolution = this.addMinutes(datetimeDevolution, conflictMinutes);
    const isRightNow = this.isNow(datetimeWithdrawal);
    const hotspotColumn = isRightNow ? 'current_hotspot_id' : 'default_hotspot_id';

    let qb = this.vehicleRepository.createQueryBuilder('vehicle')
      .where(`vehicle.contract_id = :contractID AND vehicle.${hotspotColumn} = :locationID
            AND vehicle.status = 'ACTIVE'
            AND reservations.status IN('OPEN','IN_PROGRESS')
            AND (
              (:preparedDatetimeWithdrawal BETWEEN reservations.date_withdrawal AND reservations.date_devolution)
              OR (:preparedDatetimeDevolution BETWEEN reservations.date_withdrawal AND reservations.date_devolution)
              OR ( reservations.date_withdrawal BETWEEN :preparedDatetimeWithdrawal AND :preparedDatetimeDevolution)
              OR (reservations.date_devolution BETWEEN :preparedDatetimeWithdrawal AND :preparedDatetimeDevolution)
            )`);

    qb = qb
      .select('vehicle.id')
      .leftJoin('vehicle.contract', 'contract')
      .leftJoin('vehicle.reservations', 'reservations');

    const groups = (user?.vehicleGroups || []).map(vg => vg.id);
    const vehicles = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where(
        `vehicle.contract_id = :contractID AND vehicle.${hotspotColumn} = :locationID 
        AND vehicle.id NOT IN (${qb.getQuery()})
        AND vehicle.vehicle_group_id IN (:vehicleGroupIDs)
        AND vehicle.status = 'ACTIVE'`,
        {
          preparedDatetimeWithdrawal: this.formaDatetime(preparedDatetimeWithdrawal),
          preparedDatetimeDevolution: this.formaDatetime(preparedDatetimeDevolution),
          locationID: +locationID,
          contractID: +contractID,
          vehicleGroupIDs: groups,
        },
      )
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.order as OrderByCondition);

    const resultList = await vehicles.getManyAndCount();

    const vehicleDTO: VehicleDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicle => vehicleDTO.push(VehicleMapper.fromEntityToDTO(vehicle)));
      resultList[0] = vehicleDTO;
    }
    return [vehicleDTO, resultList[1]];
  }



  async listByAvailabilityByUserId(
    options: FindManyOptions<VehicleDTO>,
    datetimeWithdrawal?: Date,
    datetimeDevolution?: Date,
    userID?: number,
    locationID?: number,
    contractID?: number,
    search?: string,
  ): Promise<[VehicleDTO[], number]> {
    const conflictMinutes = +process.env.RESERVATIONS_CONFLICT_MINUTES;
    const preparedDatetimeWithdrawal = this.addMinutes(datetimeWithdrawal, -conflictMinutes);
    const preparedDatetimeDevolution = this.addMinutes(datetimeDevolution, conflictMinutes);
    const isRightNow = this.isNow(datetimeWithdrawal);
    const hotspotColumn = isRightNow ? 'current_hotspot_id' : 'default_hotspot_id';

    let qb = this.vehicleRepository.createQueryBuilder('vehicle')
      .where(`vehicle.contract_id = :contractID AND vehicle.${hotspotColumn} = :locationID
            AND vehicle.status = 'ACTIVE'
            AND reservations.status IN('OPEN','IN_PROGRESS')
            AND (
              (:preparedDatetimeWithdrawal BETWEEN reservations.date_withdrawal AND reservations.date_devolution)
              OR (:preparedDatetimeDevolution BETWEEN reservations.date_withdrawal AND reservations.date_devolution)
              OR ( reservations.date_withdrawal BETWEEN :preparedDatetimeWithdrawal AND :preparedDatetimeDevolution)
              OR (reservations.date_devolution BETWEEN :preparedDatetimeWithdrawal AND :preparedDatetimeDevolution)
            )`);

    qb = qb
      .select('vehicle.id')
      .leftJoin('vehicle.contract', 'contract')
      .leftJoin('vehicle.reservations', 'reservations');

    let vehicles = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where(
        `vehicle.contract_id = :contractID AND vehicle.${hotspotColumn} = :locationID 
        AND vehicle.id NOT IN (${qb.getQuery()})
        AND vehicle.status = 'ACTIVE'`,
        {
          preparedDatetimeWithdrawal: this.formaDatetime(preparedDatetimeWithdrawal),
          preparedDatetimeDevolution: this.formaDatetime(preparedDatetimeDevolution),
          locationID: +locationID,
          contractID: +contractID,
        },
      )
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .innerJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .innerJoinAndSelect('vehicleGroup.accounts', 'vehicleGroupAccounts', 'vehicleGroupAccounts.id = :userID', { userID: +userID })
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.order as OrderByCondition);

    if (search) {
      vehicles = vehicles.andWhere('(vehicle.license_plate LIKE :search OR vehicle.chassis LIKE :search)', { search: `%${search}%` });
    }

    const resultList = await vehicles.getManyAndCount();

    const vehicleDTO: VehicleDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicle => vehicleDTO.push(VehicleMapper.fromEntityToDTO(vehicle)));
      resultList[0] = vehicleDTO;
    }
    return [vehicleDTO, resultList[1]];
  }
  addMinutes(date: Date, minutes: number) {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() + minutes);
    return newDate;
  }

  async save(vehicleDTO: VehicleDTO, creator?: string): Promise<VehicleDTO | undefined> {
    const entity = VehicleMapper.fromDTOtoEntity(vehicleDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.vehicleRepository.save(entity);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async update(vehicleDTO: VehicleDTO, updater?: string): Promise<VehicleDTO | undefined> {
    const entity = VehicleMapper.fromDTOtoEntity(vehicleDTO);

    entity.unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(entity?.id);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.vehicleRepository.save(entity);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async updateByIdWithFiles(
    files: { pictureImage?: Express.Multer.File; document?: Express.Multer.File },
    id: number,
    vehicleDTO: VehicleCreateDTO,
    updater?: string,
  ): Promise<VehicleDTO | undefined> {
    const entity = VehicleMapper.fromCreateDTOtoEntity(vehicleDTO);
    const vehicle = await this.findById(id);
    if (files?.pictureImage) {
      try {
        const pictureFile = files.pictureImage;
        const cnhData = await this.uploadService.uploadFile(pictureFile.buffer, pictureFile.originalname);
        vehicle.pictureLink = cnhData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-pictureFile');
      }
    }

    if (files?.document) {
      try {
        const documentFile = files.document;
        const documentData = await this.uploadService.uploadFile(
          documentFile.buffer,
          documentFile.originalname,
        );
        vehicle.licenseLink = documentData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-documentFile');
      }
    }
    if (!vehicle) {
      throw new NotFoundException('');
    }
    if (updater) {
      vehicle.lastModifiedBy = updater;
    }

    const vehicleGroupId = +vehicleDTO.vehicleGroupId;
    if (vehicleGroupId && +vehicle.vehicleGroup?.id !== vehicleGroupId) {
      vehicle.vehicleGroup = await this.vehicleGroupService.findById(vehicleGroupId);
    }

    const vehicleModelId = +vehicleDTO.vehicleModelId;
    if (vehicleModelId && +vehicle.vehicleModel?.id !== vehicleModelId) {
      vehicle.vehicleModel = await this.vehicleModelService.findById(vehicleModelId);
    }

    const defaultHotspotId = +vehicleDTO.defaultHotspotId;
    if (defaultHotspotId && +vehicle.defaultHotspot?.id !== defaultHotspotId) {
      vehicle.defaultHotspot = await this.locationService.findById(defaultHotspotId);
    }

    const dynamicHotspotAssociationConfig = await this.configService.findByNameAndContract(
        'vehicles.dynamic_hotspot_association_enabled',
        vehicle.contract.id,
    );

    if (dynamicHotspotAssociationConfig === 'false') vehicle.currentHotspot = vehicle.defaultHotspot;

    entity.unsolvedDamagesQty = await this.damageService.countUnsolvedDamagesForVehicle(vehicle?.id);
    const received = VehicleMapper.removeNull(vehicleDTO);
    const result = await this.vehicleRepository.merge(vehicle, received);
    const savedEntity = await this.vehicleRepository.save({ ...result, id: vehicle?.id });
    return VehicleMapper.fromEntityToDTO(savedEntity);
  }

  private async getLocationIfLatLonAndContractIDAreValid({ lat,
    lng,
    contractID }): Promise<LocationDTO | null> {
    return await this.locationService.findLocationByLatLon(
      lat,
      lng,
      contractID
    );
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.vehicleRepository.softDelete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
