import { EntityRepository, Repository } from 'typeorm';
import { RpushApp } from '../domain/rpush-app.entity';
import { pluck } from 'rxjs/operators';

@EntityRepository(RpushApp)
export class RpushAppRepository extends Repository<RpushApp> {

    async listCertificatesDistinct(): Promise<string[]> {
        const queryBuilder = this.createQueryBuilder('rpush_app');
        const results = await queryBuilder
            .select('rpush_app.certificate', 'certificate')
            .distinct(true)
            .getRawMany();
        return results.map(r => r.certificate);
    }
}
