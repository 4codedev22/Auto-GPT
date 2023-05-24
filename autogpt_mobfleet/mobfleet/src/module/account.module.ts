import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from '../web/rest/account.controller';
import { AccountRepository } from '../repository/account.repository';
import { AccountService } from '../service/account.service';
import { MailerModule } from './mailer.module';
import { ManagementController } from '../web/rest/management.controller';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './role.module';
import { ContractModule } from './contract.module';
import { VehicleGroupModule } from './vehicle-group.module';
import { V1Module } from '../v1/v1.module';
import { ReportModule } from './report.module';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountRepository]),
        SharedModule,
        RoleModule,
        forwardRef(() => AuthModule),
        forwardRef(() => ContractModule),
        forwardRef(() => VehicleGroupModule),
        forwardRef(() => V1Module),
        forwardRef(() => ReportModule),
        forwardRef(() => MailerModule),
    ],
    controllers: [AccountController, ManagementController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule { }
