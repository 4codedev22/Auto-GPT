import { Logger } from '@nestjs/common';
import { EntityRepository, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Location } from '../domain/location.entity';
import { ContractRepository } from './contract.repository';

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
    logger = new Logger('LocationRepository');

    public static readonly reportCols = (alias = 'location') => [
        `${alias}.description as '${alias}.description'`,
        `${alias}.address as '${alias}.address'`,
        `${alias}.latitude as '${alias}.latitude'`,
        `${alias}.longitude as '${alias}.longitude'`,
        `${alias}.radiusM as '${alias}.radiusM'`,
        `${alias}.type as '${alias}.type'`,
        `${alias}.icon as '${alias}.icon'`,
        `${alias}.timezone as '${alias}.timezone'`,
        `${alias}.openingHoursMonday as '${alias}.openingHoursMonday'`,
        `${alias}.openingHoursTuesday as '${alias}.openingHoursTuesday'`,
        `${alias}.openingHoursWednesday as '${alias}.openingHoursWednesday'`,
        `${alias}.openingHoursThursday as '${alias}.openingHoursThursday'`,
        `${alias}.openingHoursFriday as '${alias}.openingHoursFriday'`,
        `${alias}.openingHoursSaturday as '${alias}.openingHoursSaturday'`,
        `${alias}.openingHoursSunday as '${alias}.openingHoursSunday'`,
    ];

    public static readonly descriptiveCols = (alias = 'location') => [
        `${alias}.description as '${alias}.description'`
    ];

    async report(
        contractID: number,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Location>> {

        let qb = this.createQueryBuilder('location')
            .withDeleted();
        qb = qb.where('location.contract_id = :contractID', { contractID });
        return qb
            .leftJoin('location.contract', 'contract')
            .select(
                LocationRepository.reportCols('location')
                    .concat(ContractRepository.descriptiveCols('contract'))
            )
            .orderBy(order);
    }
}
