import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from '../web/rest/location.controller';
import { LocationRepository } from '../repository/location.repository';
import { LocationService } from '../service/location.service';
import { ContractModule } from './contract.module';
import { SharedModule } from './shared/shared.module';
import { ReportModule } from './report.module';

@Module({
    imports: [TypeOrmModule.forFeature([LocationRepository]), ContractModule, SharedModule, forwardRef(() => ReportModule)],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationModule { }
