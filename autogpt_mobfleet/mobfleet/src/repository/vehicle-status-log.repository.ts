import { EntityRepository, Repository } from 'typeorm';
import { VehicleStatusLog } from '../domain/vehicle-status-log.entity';

@EntityRepository(VehicleStatusLog)
export class VehicleStatusLogRepository extends Repository<VehicleStatusLog> {}
