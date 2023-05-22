import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleGroupController } from '../web/rest/vehicle-group.controller';
import { VehicleGroupRepository } from '../repository/vehicle-group.repository';
import { VehicleGroupService } from '../service/vehicle-group.service';
import { ContractModule } from './contract.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleGroupRepository]), forwardRef(() => ContractModule),],
  controllers: [VehicleGroupController],
  providers: [VehicleGroupService],
  exports: [VehicleGroupService],
})
export class VehicleGroupModule { }
