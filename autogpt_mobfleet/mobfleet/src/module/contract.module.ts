import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from '../web/rest/contract.controller';
import { ContractRepository } from '../repository/contract.repository';
import { ContractService } from '../service/contract.service';
import { CompanyModule } from './company.module';
import { AccountModule } from './account.module';
import { VehicleGroupModule } from './vehicle-group.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ContractRepository]),
        CompanyModule,
        forwardRef(() => AccountModule),
        forwardRef(() => VehicleGroupModule)
    ],
    controllers: [ContractController],
    providers: [ContractService],
    exports: [ContractService],
})
export class ContractModule { }
