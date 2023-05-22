import { EntityRepository, Repository } from 'typeorm';
import { Maintenance } from '../domain/maintenance.entity';

@EntityRepository(Maintenance)
export class MaintenanceRepository extends Repository<Maintenance> {}
