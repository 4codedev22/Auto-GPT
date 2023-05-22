import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationAccountController } from '../web/rest/reservation-account.controller';
import { ReservationAccountRepository } from '../repository/reservation-account.repository';
import { ReservationAccountService } from '../service/reservation-account.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReservationAccountRepository])],
    controllers: [ReservationAccountController],
    providers: [ReservationAccountService],
    exports: [ReservationAccountService],
})
export class ReservationAccountModule {}
