import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, EntityRepository, EntityTarget, FindConditions, ObjectID, ObjectLiteral, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { ReservationRepository } from './reservation.repository';
import ExcelJS from 'exceljs';
import { Logger } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { VehicleDashboardFilterDTO } from '../service/dto/vehicle-dashboard.filter.dto';
import { VehicleModelRepository } from './vehicle-model.repository';
import { VehicleManufacturerRepository } from './vehicle-manufacturer.repository';
import { LocationRepository } from './location.repository';
import { VehicleGroupRepository } from './vehicle-group.repository';
import { ContractRepository } from './contract.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type UpdateVehicleWithoutValidationsParams = {
    partialEntity: Partial<Vehicle>
};
export type CalendarFilterVehicleStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
export type CalendarFilter = {
    licensePlate: string;
    vehicleModelId: number;
    hostpotId: number;
    status: CalendarFilterVehicleStatus;
    date: Date;
}

export type MinimalFilter = Omit<CalendarFilter, 'date'>;
@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
    private readonly reservationRepository: ReservationRepository;

    public static readonly vehicleCols = (alias = 'vehicle') => [
        `${alias}.id as '${alias}.id'`,
        `${alias}.chassis as '${alias}.chassis'`,
        `${alias}.licensePlate as '${alias}.licensePlate'`,
        `${alias}.renavam as '${alias}.renavam'`,
        `${alias}.yearManufacture as '${alias}.yearManufacture'`,
        `${alias}.yearModel as '${alias}.yearModel'`,
        `${alias}.tankFuel as '${alias}.tankFuel'`,
        `${alias}.createdAt as '${alias}.createdAt'`,
        `${alias}.updatedAt as '${alias}.updatedAt'`,
        `${alias}.fuelLevel as '${alias}.fuelLevel'`,
        `${alias}.qtyPlace as '${alias}.qtyPlace'`,
        `${alias}.motorization as '${alias}.motorization'`,
        `${alias}.licenseLink as '${alias}.licenseLink'`,
        `${alias}.pictureLink as '${alias}.pictureLink'`,
        `${alias}.reservationStatus as '${alias}.reservationStatus'`,
        `${alias}.latitude as '${alias}.latitude'`,
        `${alias}.longitude as '${alias}.longitude'`,
        `${alias}.positionUpdatedAt as '${alias}.positionUpdatedAt'`,
        `${alias}.speedKmh as '${alias}.speedKmh'`,
        `${alias}.odometerKm as '${alias}.odometerKm'`,
        `${alias}.engineRpm as '${alias}.engineRpm'`,
        `${alias}.batteryVolts as '${alias}.batteryVolts'`,
        `${alias}.evBatteryLevel as '${alias}.evBatteryLevel'`,
        `${alias}.evBatteryLevel2 as '${alias}.evBatteryLevel2'`,
        `${alias}.evRangeKm as '${alias}.evRangeKm'`,
        `${alias}.telemetryUpdatedAt as '${alias}.telemetryUpdatedAt'`,
        `${alias}.ignitionStatus as '${alias}.ignitionStatus'`,
        `${alias}.blockStatus as '${alias}.blockStatus'`,
        `${alias}.doorStatus as '${alias}.doorStatus'`,
        `${alias}.sensorsUpdatedAt as '${alias}.sensorsUpdatedAt'`,
        `${alias}.deviceStatus as '${alias}.deviceStatus'`,
        `${alias}.deviceTempC as '${alias}.deviceTempC'`,
        `${alias}.deviceBatteryVolts as '${alias}.deviceBatteryVolts'`,
        `${alias}.deviceTelemetryUpdatedAt as '${alias}.deviceTelemetryUpdatedAt'`,
        `${alias}.unsolvedDamagesQty as '${alias}.unsolvedDamagesQty'`,
        `${alias}.lastModifiedBy as '${alias}.lastModifiedBy'`,
        `${alias}.gearshift as '${alias}.gearshift'`,
        `${alias}.typeFuel as '${alias}.typeFuel'`,
        `${alias}.color as '${alias}.color'`,
        `${alias}.status as '${alias}.status'`,
        `${alias}.deviceHwType as '${alias}.deviceHwType'`,
        `${alias}.hasKeyholder as '${alias}.hasKeyholder'`,
        `${alias}.hasDoorStatus as '${alias}.hasDoorStatus'`,
        `${alias}.deletedAt as '${alias}.deletedAt'`];

    public static readonly reportCols = (alias = 'vehicle') => VehicleRepository.vehicleCols(alias)
        .concat(ReservationRepository.descriptiveCols('inProgressReservation'))
        .concat(VehicleModelRepository.reportCols('vehicleModel'))
        .concat(VehicleGroupRepository.reportCols('vehicleGroup'))
        .concat(VehicleManufacturerRepository.reportCols('vehicleManufacturer'))
        .concat(LocationRepository.descriptiveCols('defaultHotspot'))
        .concat(LocationRepository.descriptiveCols('currentHotspot'))
        .concat(ContractRepository.descriptiveCols('contract'))
        ;


    public static readonly descriptiveCols = (alias = 'vehicle') => [
        `${alias}.chassis as '${alias}.chassis'`,
        `${alias}.licensePlate as '${alias}.license_plate'`,
        `${alias}.renavam as '${alias}.renavam'`,
        `${alias}.pictureLink as '${alias}.picture_link'`,
        `${alias}.reservationStatus as '${alias}.reservationStatus'`,
        `${alias}.status as '${alias}.status'`];

    public static readonly minimalDescriptiveCols = (alias = 'vehicle') => [
        `${alias}.licensePlate as '${alias}.license_plate'`]


    logger = new Logger('VehicleRepository');

    constructor(
        manager: EntityManager
    ) {
        super();
        this.reservationRepository = manager.getCustomRepository(ReservationRepository);
        // this.reportRepository = manager.getCustomRepository(ReportRepository);
    }


    private getLike = value => `%${value}%`;
    private getQueryBuilder = () => this.createQueryBuilder('vehicle');
    private restrictContract = (qb: SelectQueryBuilder<Vehicle>, contractID: number) => qb.where('vehicle.contract_id = :contractID', { contractID });
    private filterLicensePlate = (qb: SelectQueryBuilder<Vehicle>, licensePlate: string) => qb.andWhere('vehicle.licensePlate LIKE :licensePlate', { licensePlate: this.getLike(licensePlate) });
    private filterHostpotId = (qb: SelectQueryBuilder<Vehicle>, hotspotId: number) => qb.andWhere('vehicle.current_hotspot_id = :hotspotId OR vehicle.default_hotspot_id = :hotspotId', { hotspotId });
    private filterVehicleModelId = (qb: SelectQueryBuilder<Vehicle>, vehicleModelId: number) => qb.andWhere('vehicle.vehicle_model_id = :vehicleModelId', { vehicleModelId });
    private filterStatus = (qb: SelectQueryBuilder<Vehicle>, status: CalendarFilterVehicleStatus) => qb.andWhere('vehicle.status = :status', { status });
    private restrictReservations = (qb: SelectQueryBuilder<Vehicle>, queryDate: Date) => {
        const { query, params } = this.reservationRepository.getQueryStringAndParamsFilteredByDate(queryDate);
        return qb
            .leftJoinAndSelect('vehicle.reservations', 'reservation', `reservation.id in (${query})`, { ...params })
            .leftJoinAndSelect('reservation.account', 'account');

    };

    private restrictSelectToMinimal = (qb: SelectQueryBuilder<Vehicle>) => qb.select([
        'vehicle.id',
        'vehicle.licensePlate',
        'vehicle.latitude',
        'vehicle.longitude',
        'vehicle.fuelLevel',
        'vehicle.evBatteryLevel',
        'vehicle.batteryVolts',
        'vehicle.ignitionStatus',
        'vehicle.status',
        'vehicle.typeFuel'
    ]);


    async updateWithoutValidations({ partialEntity: { id, ...other } }: UpdateVehicleWithoutValidationsParams) {
        return await this.update(id, other);
    }
    async findAndCountByVehicleCalendarFilter(
        contractID: number,
        { licensePlate, vehicleModelId, hostpotId, status, date }: CalendarFilter,
        skip = 0,
        take = 20,
        order: OrderByCondition
    ): Promise<[Vehicle[], number]> {

        let qb = this.getQueryBuilder();
        qb = this.restrictContract(qb, contractID);
        if (licensePlate) {
            qb = this.filterLicensePlate(qb, licensePlate);
        }

        if (hostpotId) {
            qb = this.filterHostpotId(qb, hostpotId);
        }
        if (vehicleModelId) {
            qb = this.filterVehicleModelId(qb, vehicleModelId);
        }
        if (date) {
            qb = this.restrictReservations(qb, date);
        }
        qb = qb
            .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
            .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
            .skip(skip)
            .take(take)
            .orderBy(order);

        return await qb.getManyAndCount();
    }


    async findAndCountByVehicleDashboardFilter(
        contractID: number,
        { vehicleModelId, hostpotId, date }: VehicleDashboardFilterDTO,
        skip = 0,
        take = 20,
        order: OrderByCondition
    ): Promise<[Vehicle[], number]> {

        let qb = this.getQueryBuilder();
        qb = this.restrictContract(qb, contractID);


        if (hostpotId) {
            qb = this.filterHostpotId(qb, hostpotId);
        }
        if (vehicleModelId) {
            qb = this.filterVehicleModelId(qb, vehicleModelId);
        }
        if (date) {
            qb = this.restrictReservations(qb, date);
        }
        qb = qb
            .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
            .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
            .skip(skip)
            .take(take)
            .orderBy(order);

        return await qb.getManyAndCount();
    }

    async findAndCountByVehicleMinimalFilter(
        contractID: number,
        { licensePlate, vehicleModelId, hostpotId, status }: MinimalFilter,
        skip = 0,
        take = 0,
        order: OrderByCondition
    ): Promise<[Vehicle[], number]> {

        let qb = this.getQueryBuilder();
        qb = this.restrictContract(qb, contractID);
        if (licensePlate) {
            qb = this.filterLicensePlate(qb, licensePlate);
        }

        if (hostpotId) {
            qb = this.filterHostpotId(qb, hostpotId);
        }
        if (vehicleModelId) {
            qb = this.filterVehicleModelId(qb, vehicleModelId);
        }

        if (status) {
            qb = this.filterStatus(qb, status);
        }
        if (skip !== 0) {
            qb = qb
                .skip(skip);
        }
        if (take !== 0) {
            qb = qb.take(take)
        }
        qb = qb.orderBy(order);
        qb = this.restrictSelectToMinimal(qb);
        return await qb.getManyAndCount();
    }



    async report(
        contractID: number,
        { licensePlate, vehicleModelId, hostpotId }: Omit<CalendarFilter, 'date'>,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Vehicle>> {

        let qb = this.getQueryBuilder().withDeleted();
        qb = this.restrictContract(qb, contractID);
        if (licensePlate) {
            qb = this.filterLicensePlate(qb, licensePlate);
        }

        if (hostpotId) {
            qb = this.filterHostpotId(qb, hostpotId);
        }
        if (vehicleModelId) {
            qb = this.filterVehicleModelId(qb, vehicleModelId);
        }


        return qb
            .leftJoinAndSelect('vehicle.inProgressReservation', 'inProgressReservation')
            .leftJoinAndSelect('vehicle.currentHotspot', 'currentHotspot')
            .leftJoinAndSelect('vehicle.defaultHotspot', 'defaultHotspot')
            .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
            .leftJoinAndSelect('vehicle.contract', 'contract')
            .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
            .leftJoinAndSelect('vehicleModel.vehicleManufacturer', 'vehicleManufacturer')
            .select(VehicleRepository.reportCols())
            .orderBy(order);
    }
}
