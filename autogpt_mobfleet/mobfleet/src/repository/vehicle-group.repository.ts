import { EntityRepository, Repository } from 'typeorm';
import { VehicleGroup } from '../domain/vehicle-group.entity';

@EntityRepository(VehicleGroup)
export class VehicleGroupRepository extends Repository<VehicleGroup> {
    
    public static readonly reportCols = (alias = 'vehicleGroup') => [
        `${alias}.name as '${alias}.name'`
    ]
}
