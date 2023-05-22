import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleStatusLogController } from '../web/rest/vehicle-status-log.controller';
import { VehicleStatusLogRepository } from '../repository/vehicle-status-log.repository';
import { VehicleStatusLogService } from '../service/vehicle-status-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([VehicleStatusLogRepository])],
    controllers: [VehicleStatusLogController],
    providers: [VehicleStatusLogService],
    exports: [VehicleStatusLogService],
})
export class VehicleStatusLogModule {}
