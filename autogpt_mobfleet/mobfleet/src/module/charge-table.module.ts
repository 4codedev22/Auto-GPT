import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeTableController } from '../web/rest/charge-table.controller';
import { ChargeTableRepository } from '../repository/charge-table.repository';
import { ChargeTableService } from '../service/charge-table.service';


@Module({
  imports: [TypeOrmModule.forFeature([ChargeTableRepository])],
  controllers: [ChargeTableController],
  providers: [ChargeTableService],
  exports: [ChargeTableService],
})
export class ChargeTableModule {}
