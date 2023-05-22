import { Module } from '@nestjs/common';

import { PagarmeService } from '../service/pagarme.service';
import { AccountModule } from './account.module';
import { CompanyModule } from './company.module';

@Module({
  imports: [
    AccountModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [PagarmeService],
  exports: [PagarmeService],
})
export class PagarmeModule { }
