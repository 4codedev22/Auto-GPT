import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from '../web/rest/report.controller';
import { ReportRepository } from '../repository/report.repository';
import { ReportService } from '../service/report.service';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [TypeOrmModule.forFeature([ReportRepository]), SharedModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule { }
