import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModelController } from '../web/rest/vehicle-model.controller';
import { VehicleModelRepository } from '../repository/vehicle-model.repository';
import { VehicleModelService } from '../service/vehicle-model.service';
import { VehicleManufacturerModule } from './vehicle-manufacturer.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [TypeOrmModule.forFeature([VehicleModelRepository]), VehicleManufacturerModule, SharedModule],
    controllers: [VehicleModelController],
    providers: [VehicleModelService],
    exports: [VehicleModelService],
})
export class VehicleModelModule {}
