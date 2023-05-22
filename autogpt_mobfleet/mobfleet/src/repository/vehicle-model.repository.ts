import { EntityRepository, Repository } from 'typeorm';
import { VehicleModel } from '../domain/vehicle-model.entity';

@EntityRepository(VehicleModel)
export class VehicleModelRepository extends Repository<VehicleModel> {
    public static readonly reportCols = (alias = 'vehicleModel') => [
        `${alias}.name as '${alias}.name'`,
        `${alias}.type as '${alias}.type'`,
        `${alias}.classification as '${alias}.classification'`,
        `${alias}.maintenanceKm as '${alias}.maintenanceKm'`,
        `${alias}.maintenanceMonths as '${alias}.maintenanceMonths'`,
        `${alias}.photos as '${alias}.photos'`
    ]
}
