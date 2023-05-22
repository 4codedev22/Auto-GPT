import { Module } from '@nestjs/common';

import { SmsService } from '../service/sms.service';

import { SmsTokenModule } from './sms-token.module';

@Module({
    imports: [SmsTokenModule],
    controllers: [],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {}
