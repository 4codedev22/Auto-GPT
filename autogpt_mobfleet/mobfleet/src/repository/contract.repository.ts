import { EntityRepository, Repository } from 'typeorm';
import { Contract } from '../domain/contract.entity';

@EntityRepository(Contract)
export class ContractRepository extends Repository<Contract> {

    public static readonly reportCols = (alias = 'contract') => [
        `${alias}.uuid as '${alias}.uuid'`,
        `${alias}.name as '${alias}.name'`,
        `${alias}.supportPhone as '${alias}.supportPhone'`,
        `${alias}.supportEmail as '${alias}.supportEmail'`,
        `${alias}.status as '${alias}.status'`
    ];

    public static readonly descriptiveCols = (alias = 'contract') => [
        `${alias}.uuid as '${alias}.uuid'`,
        `${alias}.name as '${alias}.name'`,
        `${alias}.status as '${alias}.status'`
    ];
    public static readonly minimalDescriptiveCols = (alias = 'contract') => [
        `${alias}.name as '${alias}.name'`
    ];
}
