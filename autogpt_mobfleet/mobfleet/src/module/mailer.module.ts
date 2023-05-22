import { Module } from '@nestjs/common';

import { ConfigModule } from '../module/config.module';
import { MailerService } from '../service/mailer.service';


@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
