import { EntityRepository, Repository } from 'typeorm';
import { Company } from '../domain/company.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
    public static readonly reportCols = (alias = 'company') => [
        `${alias}.uuid as ${alias}.uuid`,
        `${alias}.name as ${alias}.name`,
        `${alias}.paymentEnabled as ${alias}.paymentEnabled`
    ];
    
}
