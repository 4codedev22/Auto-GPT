import { EntityRepository, Repository } from 'typeorm';
import { VehicleManufacturer } from '../domain/vehicle-manufacturer.entity';

@EntityRepository(VehicleManufacturer)
export class VehicleManufacturerRepository extends Repository<VehicleManufacturer> {
    public static readonly reportCols = (alias = 'vehicleManufacturer') => [
        `${alias}.name as '${alias}.name'`
    ]
}
