import { EntityRepository, Repository } from 'typeorm';
import { Report } from '../domain/report.entity';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
    public static readonly baseEntityReportCols = (alias: string) => [
        `${alias}.createdAt as '${alias}.createdAt'`,
        `${alias}.deletedAt as '${alias}.deletedAt'`,
        `${alias}.updatedAt as '${alias}.updatedAt'`,
        `${alias}.lastModifiedBy as '${alias}.lastModifiedBy'`
    ];
}
