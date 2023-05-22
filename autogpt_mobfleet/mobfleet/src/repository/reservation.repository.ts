import { Logger } from '@nestjs/common';
import { endOfDay, format, startOfDay } from 'date-fns';
import { ReservationFilterDTO } from '../service/dto/reservation-filter.dto';
import { Brackets, FindManyOptions, OrderByCondition, SelectQueryBuilder } from 'typeorm';
import { WhereExpression } from 'typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { Reservation } from '../domain/reservation.entity';
import { ReservationReportFilterDTO } from '../service/dto/reservation-report.filter.dto';
import { AccountRepository } from './account.repository';
import { ContractRepository } from './contract.repository';
import { firstHour, lastHour, DB_DATETIME_FORMAT } from './date-utils';
import { LocationRepository } from './location.repository';
import { VehicleRepository } from './vehicle.repository';
import { addSelectFieldsFromFilters } from './utils';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
    logger = new Logger('ReservationRepository');
    basicSelectFields = ['id','vehicle.id', 'vehicle.licensePlate']

    private filterByFields (queryBuilder: SelectQueryBuilder<Reservation>, filters: unknown) {
        Object.keys(filters).forEach((queryKey) => {
            const queryValue = filters[queryKey];
            if (queryValue !== undefined && queryValue !== null) {
                queryBuilder = queryBuilder.andWhere(
                    `${queryKey.includes('.') ? queryKey : `reservation.${queryKey}`} LIKE :${queryKey}`,
                    { [queryKey]:  `%${queryValue}%`}
                );
            }
        })

        return queryBuilder
    }

    private filterByStartedDate (
        queryBuilder: SelectQueryBuilder<Reservation>,
        startReservationFrom: Date,
        startReservationTo: Date
    ) {
        if (startReservationFrom) {
          queryBuilder = queryBuilder.andWhere(
            "reservation.dateStart >= :startReservationFrom",
            { startReservationFrom: startOfDay(new Date(startReservationFrom)) }
          )
        }
    
        if (startReservationTo) {
          queryBuilder = queryBuilder.andWhere(
            "reservation.dateStart <= :startReservationTo",
            { startReservationTo: endOfDay(new Date(startReservationTo)) }
          )
        }
    
        return queryBuilder;
    }

    private filterByEndedDate (
        queryBuilder: SelectQueryBuilder<Reservation>,
        endReservationFrom: Date,
        endReservationTo: Date
    ) {
        if (endReservationFrom) {
          queryBuilder = queryBuilder.andWhere(
            "reservation.finishAt >= :endReservationFrom",
            { endReservationFrom: startOfDay(new Date(endReservationFrom)) }
          )
        }
    
        if (endReservationTo) {
          queryBuilder = queryBuilder.andWhere(
            "reservation.finishAt <= :endReservationTo",
            { endReservationTo: endOfDay(new Date(endReservationTo)) }
          )
        }
    
        return queryBuilder;
    }

    public static readonly reportCols = (alias = 'reservation') => [
        `${alias}.pin as '${alias}.pin'`,
        `${alias}.destiny as '${alias}.destiny'`,
        `${alias}.destinyNickname as '${alias}.destinyNickname'`,
        `${alias}.destinyLatitude as '${alias}.destinyLatitude'`,
        `${alias}.destinyLongitude as '${alias}.destinyLongitude'`,
        `${alias}.dateWithdrawal as '${alias}.dateWithdrawal'`,
        `${alias}.dateDevolution as '${alias}.dateDevolution'`,
        `${alias}.qtyPeople as '${alias}.qtyPeople'`,
        `${alias}.dateStart as '${alias}.dateStart'`,
        `${alias}.dateFinish as '${alias}.dateFinish'`,
        `${alias}.status as '${alias}.status'`,
        `${alias}.uf as '${alias}.uf'`,
        `${alias}.timeTraveled as '${alias}.timeTraveled'`,
        `${alias}.travelledDistance as '${alias}.travelledDistance'`,
        `${alias}.cancellationReason as '${alias}.cancellationReason'`,
        `${alias}.cancellationResponsible as '${alias}.cancellationResponsible'`,
        `${alias}.finishResponsible as '${alias}.finishResponsible'`,
        `${alias}.finishAt as '${alias}.finishAt'`,
        `${alias}.cancellationAt as '${alias}.cancellationAt'`,
        `${alias}.vehicleUpdateAt as '${alias}.vehicleUpdateAt'`,
        `${alias}.type as '${alias}.type'`,
        `${alias}.originLocation as '${alias}.originLocation'`,
        `${alias}.devolutionLocation as '${alias}.devolutionLocation'`,
        `${alias}.destinyLocation as '${alias}.destinyLocation'`,
        `${alias}.csvLink as '${alias}.csvLink'`,
        `${alias}.initialOdometerKm as '${alias}.initialOdometerKm'`,
        `${alias}.finalOdometerKm as '${alias}.finalOdometerKm'`,
        `${alias}.initialFuelLevel as '${alias}.initialFuelLevel'`,
        `${alias}.finalFuelLevel as '${alias}.finalFuelLevel'`,
        `${alias}.detailedPaymentInfo as '${alias}.detailedPaymentInfo'`,
        `${alias}.selectedCardId as '${alias}.selectedCardId'`
    ];

    public static readonly descriptiveCols = (alias = 'reservation') => [
        `${alias}.pin as '${alias}.pin'`,
        `${alias}.destiny as '${alias}.destiny'`,
        `${alias}.destinyNickname as '${alias}.destinyNickname'`,
        `${alias}.dateWithdrawal as '${alias}.dateWithdrawal'`,
        `${alias}.dateDevolution as '${alias}.dateDevolution'`,
        `${alias}.dateStart as '${alias}.dateStart'`,
        `${alias}.dateFinish as '${alias}.dateFinish'`,
        `${alias}.status as '${alias}.status'`,
        `${alias}.type as '${alias}.type'`,
        `${alias}.originLocation as '${alias}.originLocation'`,
        `${alias}.devolutionLocation as '${alias}.devolutionLocation'`,
        `${alias}.destinyLocation as '${alias}.destinyLocation'`,
    ];

    
    public static readonly minimalDescriptiveCols = (alias = 'reservation') => [
        `${alias}.pin as '${alias}.pin'`,
    ];


    private dateFormattedForDb = value => format(value, DB_DATETIME_FORMAT);

    private getQueryDateIntervalFormatted = value => ({
        queryDateStart: this.dateFormattedForDb(firstHour(value)),
        queryDateEnd: this.dateFormattedForDb(lastHour(value))
    });

    private getQueryBuilder = () => this.createQueryBuilder('reservation');

    private restrictVehicle = (qb: SelectQueryBuilder<Reservation>) => qb.where('reservation.vehicle_id = `vehicle`.`id`');

    private checkStatusInProgressOrOverdue = (qb: WhereExpression) => qb.where('reservation.status in ("IN_PROGRESS", "OVERDUE")');
    private checkDateFinishIsNull = (qb: WhereExpression) => qb.where('reservation.date_finish IS NULL');


    private checkStatusOpen = (qb: WhereExpression) => qb.where('reservation.status in ("OPEN")');
    private checkWithdrawalInIntervalForOpenStatus = (qb: WhereExpression) => qb.where('reservation.date_withdrawal <= :queryDateStart').orWhere('reservation.date_withdrawal <= :queryDateEnd');
    private checkDevolutionInIntervalForOpenStatus = (qb: WhereExpression) => qb.where('reservation.date_devolution >= :queryDateStart').orWhere('reservation.date_devolution >= :queryDateEnd');

    private checkStatusFinished = (qb: WhereExpression) => qb.where('reservation.status in ("FINISHED")');
    private checkDateStartInIntervalForFinishedStatus = (qb: WhereExpression) => qb.where('reservation.date_start <= :queryDateStart').orWhere('reservation.date_start <= :queryDateEnd');
    private checkDateFinishInIntervalForFinishedStatus = (qb: WhereExpression) => qb.where('reservation.date_finish >= :queryDateStart').orWhere('reservation.date_finish >= :queryDateEnd');
    private statusIsInProgressOrOverdueAndDateFinishIsNull = () => new Brackets(statusInProgressOrOverdueQb =>
        this.checkStatusInProgressOrOverdue(statusInProgressOrOverdueQb)
            .andWhere(new Brackets(this.checkDateFinishIsNull)));
    private statusIsOpenAndDateWithdrawalAndDateDevolutionAreInInterval = () => new Brackets(statusOpenQb =>
        this.checkStatusOpen(statusOpenQb)
            .andWhere(new Brackets(intervalForOpenQb =>
                intervalForOpenQb
                    .where(new Brackets(this.checkWithdrawalInIntervalForOpenStatus))
                    .andWhere(new Brackets(this.checkDevolutionInIntervalForOpenStatus))
            ))
    );
    private statusIsFinishedAndDateStartAndDateFinishAreInInterval = () => new Brackets(statusFinishedQb =>
        this.checkStatusFinished(statusFinishedQb)
            .andWhere(new Brackets(intervalForFinishedQb =>
                intervalForFinishedQb
                    .where(new Brackets(this.checkDateStartInIntervalForFinishedStatus))
                    .andWhere(new Brackets(this.checkDateFinishInIntervalForFinishedStatus))
            ))
    );
    getQueryStringAndParamsFilteredByDate(
        date: Date
    ): { query: string, params: any } {
        let qb = this.getQueryBuilder();
        qb = this.restrictVehicle(qb)
            .andWhere(new Brackets(statusAndIntervalQb =>
                statusAndIntervalQb
                    .where(this.statusIsInProgressOrOverdueAndDateFinishIsNull())
                    .orWhere(this.statusIsOpenAndDateWithdrawalAndDateDevolutionAreInInterval())
                    .orWhere(this.statusIsFinishedAndDateStartAndDateFinishAreInInterval())
            ));

        const params = this.getQueryDateIntervalFormatted(date);
        const query = qb
            .select('reservation.id')
            .getQuery();
        return { query, params };
    }

    private getLike = value => `%${value}%`;
    private withBrackets = (qb: SelectQueryBuilder<Reservation>, expression: string) => new Brackets(b => b.where(expression));
    private restrictContract = (qb: SelectQueryBuilder<Reservation>, contractID: number) => qb.where('vehicle.contract_id = :contractID', { contractID });
    private filterLicensePlate = (qb: SelectQueryBuilder<Reservation>, licensePlate: string) => qb.andWhere(this.withBrackets(qb, 'vehicle.licensePlate LIKE :licensePlate'), { licensePlate: this.getLike(licensePlate) });
    private filterUserEmail = (qb: SelectQueryBuilder<Reservation>, userEmail: string) => qb.andWhere(this.withBrackets(qb, 'driver.email LIKE :userEmail'), { userEmail: this.getLike(userEmail) });
    private restrictInitialDate = (qb: SelectQueryBuilder<Reservation>, initialDate: Date) => qb.andWhere(this.withBrackets(qb, 'reservation.date_withdrawal >= :initialDate OR reservation.date_start >= :initialDate '), { initialDate: this.dateFormattedForDb(firstHour(initialDate)) });
    private restrictFinalDate = (qb: SelectQueryBuilder<Reservation>, finalDate: Date) => qb.andWhere(this.withBrackets(qb, 'reservation.date_devolution <= :finalDate OR reservation.date_finish <= :finalDate '), { finalDate: this.dateFormattedForDb(lastHour(finalDate)) });

    async report(
        contractID: number,
        { licensePlate, userEmail, initialDate, finalDate }: ReservationReportFilterDTO,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Reservation>> {

        let qb = this.getQueryBuilder()
            .withDeleted()
            .leftJoin('reservation.vehicle', 'vehicle')
            .leftJoin('reservation.account', 'driver')
            .leftJoin('vehicle.contract', 'contract')
            .leftJoin('reservation.originLocation', 'originLocation')
            .leftJoin('reservation.destinyLocation', 'destinyLocation')
            .leftJoin('reservation.devolutionLocation', 'devolutionLocation');

        qb = this.restrictContract(qb, contractID);
        if (licensePlate) {
            qb = this.filterLicensePlate(qb, licensePlate);
        }

        if (userEmail) {
            qb = this.filterUserEmail(qb, userEmail);
        }
        if (initialDate) {
            qb = this.restrictInitialDate(qb, initialDate);
        }
        if (finalDate) {
            qb = this.restrictFinalDate(qb, finalDate);
        }
        return qb
            .select(ReservationRepository.reportCols('reservation')
                .concat(VehicleRepository.descriptiveCols('vehicle'))
                .concat(AccountRepository.descriptiveCols('driver'))
                .concat(ContractRepository.descriptiveCols('contract'))
                .concat(LocationRepository.descriptiveCols('originLocation'))
                .concat(LocationRepository.descriptiveCols('devolutionLocation'))
                .concat(LocationRepository.descriptiveCols('destinyLocation'))
            )
            .orderBy(order);
        // onStream('reservas', this.logger, (await qb.stream()), workbook, onFinish);
    }

    async findAndCountWithFilters (
        options: FindManyOptions<Reservation>,
        filter: Partial<ReservationFilterDTO>
    ) {
        let qb = this.createQueryBuilder('reservation');

        if (options.where) { qb = qb.where(options.where); }

        qb = qb.andWhere('vehicle.contract_id = :contract', { contract: filter.contractID });

        qb = this.filterByFields(qb, {
            pin: filter.pin,
            'vehicle.licensePlate': filter.licensePlate,
            account: filter.account,
            status: filter.status,
        });

        qb = this.filterByStartedDate(qb, filter.startReservationFrom, filter.startReservationTo);
        qb = this.filterByEndedDate(qb, filter.endReservationFrom, filter.endReservationTo);

        if (filter.search) {
            qb = qb.andWhere(
                `(vehicle.chassis LIKE :search
                OR vehicle.licensePlate LIKE :search
                OR vehicle.renavam LIKE :search
                OR account.name LIKE :search
                OR account.email LIKE :search
                OR originLocation.description LIKE :search
                OR reservation.pin LIKE :search)`,
                { search: `%${filter.search}%` },
            );
        }

        qb = qb
            .leftJoinAndSelect('reservation.charges', 'charges')
            .leftJoinAndSelect('reservation.account', 'account')
            .leftJoinAndSelect('reservation.originLocation', 'originLocation')
            .leftJoinAndSelect('reservation.destinyLocation', 'destinyLocation')
            .leftJoinAndSelect('reservation.devolutionLocation', 'devolutionLocation')
            .leftJoinAndSelect('reservation.ratings', 'ratings')
            .leftJoinAndSelect('reservation.vehicle', 'vehicle')
            .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
            .orderBy(options.order as OrderByCondition)
            .skip(options.skip)
            .take(options.take);

        qb = addSelectFieldsFromFilters(qb, this.basicSelectFields, filter);

        return qb.getManyAndCount();
    }
}
