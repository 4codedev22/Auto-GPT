import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandLogController } from '../web/rest/command-log.controller';
import { CommandLogRepository } from '../repository/command-log.repository';
import { CommandLogService } from '../service/command-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([CommandLogRepository])],
    controllers: [CommandLogController],
    providers: [CommandLogService],
    exports: [CommandLogService],
})
export class CommandLogModule {}
