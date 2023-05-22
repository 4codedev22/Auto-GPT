import { forwardRef, Module } from '@nestjs/common';
import { ReservationPaymentService } from '../service/reservation-payment.service';
import { ChargeModule } from './charge.module';
import { ContractModule } from './contract.module';
import { PaymentModule } from './payment.module';
import { ReservationModule } from './reservation.module';
@Module({
  imports: [
    ChargeModule,
    ContractModule,
    PaymentModule,
    forwardRef(() => ReservationModule),
  ],
  controllers: [],
  providers: [ReservationPaymentService],
  exports: [ReservationPaymentService],
})
export class ReservationPaymentModule { }
