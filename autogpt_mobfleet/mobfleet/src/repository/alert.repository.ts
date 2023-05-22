import { Logger } from '@nestjs/common';
import { EntityRepository, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Alert } from '../domain/alert.entity';
import { AlertReportFilterDTO } from '../service/dto/alert-report.filter.dto';
import { filterLicensePlate, getLike, restrictContract, restrictFinalDate, restrictInitialDate, withBrackets } from './repository-util';

@EntityRepository(Alert)
export class AlertRepository extends Repository<Alert> {
    logger = new Logger('AlertRepository');



    private filterAlert = (qb: SelectQueryBuilder<Alert>, alert: string) => qb.andWhere(withBrackets('alert.alert_id = :alert'), { alert });
    private filterStatus = (qb: SelectQueryBuilder<Alert>, status: number) => qb.andWhere(withBrackets('alert.status = :status'), { status });
    private filterModel = (qb: SelectQueryBuilder<Alert>, model: string) => qb.andWhere(withBrackets('vehicleModel.name = :model OR vehicleModel.id = :modelID'), { model: getLike(model), modelID: model });

    async report(
        contractID: number,
        { licensePlate, alert, model, status, initialDate, finalDate }: AlertReportFilterDTO,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Alert>>  {

        let qb = this.createQueryBuilder('alert').withDeleted();
        qb = qb.leftJoin('alert.vehicle', 'vehicle');
        qb = qb.leftJoin('vehicle.vehicleModel', 'vehicleModel');
        qb = qb.leftJoin('alert.reservation', 'reservation');
        qb = restrictContract(qb, contractID, `vehicle.contract_id = :contractID`);
        if (licensePlate) {
            qb = filterLicensePlate(qb, licensePlate);
        }

        if (alert) {
            qb = this.filterAlert(qb, alert);
        }
        if (status) {
            qb = this.filterStatus(qb, status);
        }
        if (model) {
            qb = this.filterModel(qb, model);
        }
        if (initialDate) {
            qb = restrictInitialDate(qb, initialDate, 'reservation.date_withdrawal >= :initialDate OR reservation.date_start >= :initialDate');
        }
        if (finalDate) {
            qb = restrictFinalDate(qb, finalDate, 'reservation.date_devolution <= :finalDate OR reservation.date_finish <= :finalDate');
        }
        return qb
            .orderBy(order);
    }
}


