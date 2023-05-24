import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { MailerService } from '../service/mailer.service';


@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
