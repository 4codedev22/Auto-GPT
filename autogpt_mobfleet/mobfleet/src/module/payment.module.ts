import { Module } from '@nestjs/common';
import { PaymentService } from '../service/pagarme-payment.service';
import { CompanyModule } from './company.module';

@Module({
  imports: [
    CompanyModule,
  ],
  controllers: [],
  providers: [ {
    provide: "PaymentService",
    useClass: PaymentService,
  }],
  exports: ["PaymentService"],
})
export class PaymentModule { }
