import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeConditionRepository } from '../repository/charge-condition.repository';
import { ChargeConditionService } from '../service/charge-condition.service';


@Module({
  imports: [TypeOrmModule.forFeature([ChargeConditionRepository])],
  providers: [ChargeConditionService],
  exports: [ChargeConditionService],
})
export class ChargeConditionModule {}
