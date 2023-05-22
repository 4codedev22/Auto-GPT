import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeController } from '../web/rest/charge.controller';
import { ChargeRepository } from '../repository/charge.repository';
import { ChargeService } from '../service/charge.service';


@Module({
  imports: [TypeOrmModule.forFeature([ChargeRepository])],
  controllers: [ChargeController],
  providers: [ChargeService],
  exports: [ChargeService],
})
export class ChargeModule { }
