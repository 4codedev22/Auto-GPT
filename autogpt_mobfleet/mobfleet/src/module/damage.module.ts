import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamageController } from '../web/rest/damage.controller';
import { DamageRepository } from '../repository/damage.repository';
import { DamageService } from '../service/damage.service';
import { ContractModule } from './contract.module';
import { ReservationModule } from './reservation.module';
import { AccountModule } from './account.module';
import { SharedModule } from './shared/shared.module';
import { VehicleModule } from './vehicle.module';
import { ReportModule } from './report.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DamageRepository]),
        forwardRef(() => ContractModule),
        forwardRef(() => VehicleModule),
        forwardRef(() => ReservationModule),
        forwardRef(() => AccountModule),
        forwardRef(() => SharedModule),
        forwardRef(() => ReportModule),
    ],
    controllers: [DamageController],
    providers: [DamageService],
    exports: [DamageService],
})
export class DamageModule { }
