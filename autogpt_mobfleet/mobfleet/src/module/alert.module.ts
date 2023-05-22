import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from '../web/rest/alert.controller';
import { AlertRepository } from '../repository/alert.repository';
import { AlertService } from '../service/alert.service';
import { ReportModule } from './report.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AlertRepository]),
        forwardRef(() => ReportModule)
    ],
    controllers: [AlertController],
    providers: [AlertService],
    exports: [AlertService],
})
export class AlertModule { }
