import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsTokenController } from '../web/rest/sms-token.controller';
import { SmsTokenRepository } from '../repository/sms-token.repository';
import { SmsTokenService } from '../service/sms-token.service';

@Module({
    imports: [TypeOrmModule.forFeature([SmsTokenRepository])],
    controllers: [SmsTokenController],
    providers: [SmsTokenService],
    exports: [SmsTokenService],
})
export class SmsTokenModule {}
