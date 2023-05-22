import { Logger } from '@nestjs/common';
import { EntityRepository, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Checklist } from '../domain/checklist.entity';
import { CheckListReportFilterDTO } from '../service/dto/checklist-report.filter.dto';
import { filterLicensePlate, filterUserEmail, restrictContract, restrictFinalDate, restrictInitialDate } from './repository-util';

@EntityRepository(Checklist)
export class ChecklistRepository extends Repository<Checklist> {
    logger = new Logger('ChecklistRepository');



    async report(
        contractID: number,
        { licensePlate, userEmail, initialDate, finalDate }: CheckListReportFilterDTO,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Checklist>> {

        let qb = this.createQueryBuilder('checklist').withDeleted();
        qb = qb.leftJoin('checklist.vehicle', 'vehicle');
        qb = qb.leftJoin('checklist.account', 'account');
        qb = restrictContract(qb, contractID, `vehicle.contract_id = :contractID`);
        if (licensePlate) {
            qb = filterLicensePlate(qb, licensePlate);
        }

        if (userEmail) {
            qb = filterUserEmail(qb, userEmail);
        }
        if (initialDate) {
            qb = restrictInitialDate(qb, initialDate, 'checklist.created_at >= :initialDate OR checklist.updated_at >= :initialDate');
        }
        if (finalDate) {
            qb = restrictFinalDate(qb, finalDate, 'checklist.created_at <= :finalDate OR checklist.updated_at <= :finalDate');
        }
        return qb
            .orderBy(order);
    }
}
