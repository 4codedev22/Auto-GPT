import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from '../web/rest/checklist.controller';
import { ChecklistRepository } from '../repository/checklist.repository';
import { ChecklistService } from '../service/checklist.service';
import { ReportModule } from './report.module';

@Module({
    imports: [TypeOrmModule.forFeature([ChecklistRepository]),
    forwardRef(() => ReportModule)],
    controllers: [ChecklistController],
    providers: [ChecklistService],
    exports: [ChecklistService],
})
export class ChecklistModule { }
