import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandController } from '../web/rest/command.controller';
import { CommandRepository } from '../repository/command.repository';
import { CommandService } from '../service/command.service';
import { DeviceCommandService } from '../service/device-command.service';
import { ContractModule } from './contract.module';
import { VehicleModule } from './vehicle.module';
import { CommandLogModule } from './command-log.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommandRepository]),
        forwardRef(() => ContractModule),
        forwardRef(() => VehicleModule),
        forwardRef(() => CommandLogModule),
    ],
    controllers: [CommandController],
    providers: [CommandService, DeviceCommandService],
    exports: [CommandService, DeviceCommandService],
})
export class CommandModule {}
