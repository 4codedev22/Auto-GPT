import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Client as ZenviaClient, IMessage, TextContent } from '@zenvia/sdk';
import { generator } from 'rand-token';
import { Company } from '../domain/company.entity';
import { TokenMode } from '../domain/enumeration/token-mode';
import {SmsTokenService} from './sms-token.service'

@Injectable()
export class SmsService {
    logger = new Logger('SmsService');

    private readonly zenviaToken = process.env.ZENVIA_AUTH_TOKEN;
    private readonly smsSender = 'IturanMob';

    zenviaClient = new ZenviaClient(this.zenviaToken);

    constructor(private smsTokenService: SmsTokenService) {}

    sendSms(to: string, message: string) {
        const smsChannel = this.zenviaClient.getChannel('sms');
        const smsContent = new TextContent(message);
        console.log(`SENDING SMS TO '${to}' MESSAGE '${message}'`);

        return smsChannel.sendMessage(this.smsSender, to, smsContent).catch(error => {
            this.logger.error(`ERROR SENDING SMS ${JSON.stringify(error)}`);
            return { error };
        }) as Promise<any>;
    }

    async sendPhoneValidationSms(phoneNumber: string, company: Company) {
        const validationToken = generator({ chars: 'numeric' }).generate(8);
        const message = `${company.name}\nCódigo para validação do telefone: ${validationToken}`;
        const result = await this.sendSms(phoneNumber, message);

        if (result.error) throw new InternalServerErrorException(result.error);

        const sentToken = { 
            mode: TokenMode.PHONE_VALIDATION, 
            receiver: phoneNumber, 
            token: validationToken,
            expiration: new Date(), 
            account: null
        };
        await this.smsTokenService.save(sentToken);

        return { token: validationToken };
    }
}
