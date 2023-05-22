import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceController } from '../web/rest/maintenance.controller';
import { MaintenanceRepository } from '../repository/maintenance.repository';
import { MaintenanceService } from '../service/maintenance.service';

@Module({
    imports: [TypeOrmModule.forFeature([MaintenanceRepository])],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
    exports: [MaintenanceService],
})
export class MaintenanceModule {}
