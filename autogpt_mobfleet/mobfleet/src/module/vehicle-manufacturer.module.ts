import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleManufacturerController } from '../web/rest/vehicle-manufacturer.controller';
import { VehicleManufacturerRepository } from '../repository/vehicle-manufacturer.repository';
import { VehicleManufacturerService } from '../service/vehicle-manufacturer.service';

@Module({
    imports: [TypeOrmModule.forFeature([VehicleManufacturerRepository])],
    controllers: [VehicleManufacturerController],
    providers: [VehicleManufacturerService],
    exports: [VehicleManufacturerService],
})
export class VehicleManufacturerModule {}
