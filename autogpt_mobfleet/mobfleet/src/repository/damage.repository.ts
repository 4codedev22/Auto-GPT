import { Logger } from '@nestjs/common';
import { ReservationType } from 'src/domain/enumeration/reservation-type';
import { EntityRepository, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Damage } from '../domain/damage.entity';
import { DamageReportFilterDTO } from '../service/dto/damage-report.filter.dto';
import { AccountRepository } from './account.repository';
import { ContractRepository } from './contract.repository';
import { filterLicensePlate, filterUserEmail, restrictContract, restrictFinalDate, restrictInitialDate } from './repository-util';
import { ReservationRepository } from './reservation.repository';
import { VehicleRepository } from './vehicle.repository';

@EntityRepository(Damage)
export class DamageRepository extends Repository<Damage> {
    logger = new Logger('DamageRepository');



    restrictReservationType = (qb: SelectQueryBuilder<Damage>, reservationType: ReservationType) => qb.andWhere('reservation.type = :reservationType', { reservationType });

    public static readonly reportCols = (alias = 'damage') => [
        `${alias}.id as '${alias}.id'`,
        `${alias}.solved as '${alias}.solved'`,
        `${alias}.solver_id as '${alias}.solver_id'`,
        `${alias}.solvedAt as '${alias}.solvedAt'`,
        `${alias}.title as '${alias}.title'`,
        `${alias}.description as '${alias}.description'`,
        `${alias}.impeditive as '${alias}.impeditive'`,
        `${alias}.type as '${alias}.type'`,
        `${alias}.contract_id as '${alias}.contract_id'`,
        `${alias}.vehicle_id as '${alias}.vehicle_id'`,
        `${alias}.account_id as '${alias}.account_id'`,
        `${alias}.reservation_id as '${alias}.reservation_id'`,
        `${alias}.createdAt as '${alias}.createdAt'`,
        `${alias}.updatedAt as '${alias}.updatedAt'`,
        `${alias}.deletedAt as '${alias}.deletedAt'`
    ];

    async reportByStream(
        contractID: number,
        { licensePlate, userEmail, initialDate, finalDate, id, reservationType }: DamageReportFilterDTO,
        order: OrderByCondition
    ): Promise<SelectQueryBuilder<Damage>> {
        const cols = DamageRepository.reportCols('damage')
            .concat(AccountRepository.minimalDescriptiveCols('account'))
            .concat(ContractRepository.minimalDescriptiveCols('contract'))
            .concat(AccountRepository.minimalDescriptiveCols('solver'))
            .concat(ReservationRepository.minimalDescriptiveCols('reservation'))
            .concat(VehicleRepository.minimalDescriptiveCols('vehicle'));

        let qb = this.createQueryBuilder('damage')
            .withDeleted()
            .select(cols);



        qb = qb.leftJoin('damage.contract', 'contract');
        qb = qb.leftJoin('damage.account', 'account');
        qb = qb.leftJoin('damage.solver', 'solver');
        qb = qb.leftJoin('damage.vehicle', 'vehicle');
        qb = qb.leftJoin('damage.reservation', 'reservation');

        qb = restrictContract(qb, contractID, 'damage.contract_id = :contractID');
        qb = this.restrictReservationType(qb, reservationType);
        if (id) {
            return qb.andWhere('damage.id = :id', { id })
                .orderBy(order);
        }
        if (licensePlate) {
            qb = filterLicensePlate(qb, licensePlate);
        }
        if (userEmail) {
            qb = filterUserEmail(qb, userEmail);
        }

        if (initialDate) {
            qb = restrictInitialDate(qb, initialDate, 'damage.solved_at >= :initialDate OR reservation.date_withdrawal >= :initialDate OR reservation.date_start >= :initialDate');
        }
        if (finalDate) {
            qb = restrictFinalDate(qb, finalDate, 'damage.solved_at <= :finalDate OR reservation.date_devolution <= :finalDate OR reservation.date_finish <= :finalDate ');
        }

        return qb
            .orderBy(order);
        // onStream('avarias', this.logger, (await qb.stream()), workbook, onFinish);
    }



    async reportById(
        contractID: number,
        { id }: Pick<DamageReportFilterDTO, 'id'>,
        order: OrderByCondition
    ): Promise<Damage> {
        try {
            let qb = this.createQueryBuilder('damage')
            qb = restrictContract(qb, contractID, 'damage.contract_id = :contractID');
            qb = qb.leftJoinAndSelect('damage.solver', 'solver');
            qb = qb.leftJoinAndSelect('damage.account', 'account');
            qb = qb.leftJoinAndSelect('damage.vehicle', 'vehicle');
            qb = qb.leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel');
            qb = qb.leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup');
            return await qb.andWhere('damage.id = :id', { id })
                .orderBy(order)
                .getOneOrFail();
        } catch (error) {
            this.logger.error(error, error, 'damage report by id');
            return null;
        }
    }
}
