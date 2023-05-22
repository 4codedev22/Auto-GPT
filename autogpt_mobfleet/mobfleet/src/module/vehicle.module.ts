import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleController } from '../web/rest/vehicle.controller';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleService } from '../service/vehicle.service';
import { LocationModule } from './location.module';
import { VehicleGroupModule } from './vehicle-group.module';
import { VehicleModelModule } from './vehicle-model.module';
import { ConfigModule } from './config.module';
import { ContractModule } from './contract.module';
import { SharedModule } from './shared/shared.module';
import { VehicleStatusLogModule } from './vehicle-status-log.module';
import { DamageModule } from './damage.module';
import { ReservationModule } from './reservation.module';
import { ReportModule } from './report.module';
import { VehicleTrackingService } from '../service/vehicle-tracking.service';
import { DeviceTrackingService } from '../service/device-tracking.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([VehicleRepository]),
        SharedModule,
        LocationModule,
        VehicleGroupModule,
        VehicleModelModule,
        ConfigModule,
        ContractModule,
        VehicleStatusLogModule,
        forwardRef(() => ReservationModule),
        forwardRef(() => DamageModule),
        forwardRef(() => ReportModule),
    ],
    controllers: [VehicleController],
    providers: [VehicleService, VehicleTrackingService, DeviceTrackingService],
    exports: [VehicleService, VehicleTrackingService, DeviceTrackingService],
})
export class VehicleModule { }
