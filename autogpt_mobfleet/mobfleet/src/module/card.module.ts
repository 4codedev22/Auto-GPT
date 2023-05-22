import { Module } from '@nestjs/common';

import { CardController } from '../web/rest/card.controller';
import { CardService } from '../service/card.service';
import { AccountModule } from './account.module';
import { CompanyModule } from './company.module';
import { PagarmeModule } from './pagarme.module';

@Module({
    imports: [
        AccountModule,
        CompanyModule,
        PagarmeModule,
        //TypeOrmModule.forFeature([CardRepository])
    ],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule { }
