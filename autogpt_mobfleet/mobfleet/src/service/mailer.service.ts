import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { readFile } from 'fs/promises'
import AwsSES from 'node-ses';
import * as path from 'path';

import { ConfigService } from './config.service';
import { AccountDTO } from './dto/account.dto';
import { compileTemplate } from '../module/shared/report-utils';

@Injectable()
export class MailerService {
    logger = new Logger('MailerService');

    private readonly awsSESEndpoint = process.env.AWS_EMAIL_ENDPOINT;
    private readonly awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    private readonly awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    private readonly mailerSender = process.env.AWS_EMAIL_SENDER;
    private readonly accountSupportEmail = process.env.SUPPORT_EMAIL;
    private readonly accountDeletionEmailTemplate = `<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> #outlook a{padding:0;}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table, td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}img{border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}p{display:block;margin:13px 0;}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix{width:100% !important;}</style><![endif]--> <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700); </style> <style type="text/css"> @media only screen and (max-width:480px){.mj-column-per-100{width:100% !important; max-width: 100%;}}</style> <style type="text/css"> @media only screen and (max-width:480px){table.full-width-mobile{width: 100% !important;}td.full-width-mobile{width: auto !important;}}</style> <style type="text/css">.hide_on_mobile{display: none !important;}@media only screen and (min-width: 480px){.hide_on_mobile{display: block !important;}}.hide_section_on_mobile{display: none !important;}@media only screen and (min-width: 480px){.hide_section_on_mobile{display: table !important;}div.hide_section_on_mobile{display: block !important;}}.hide_on_desktop{display: block !important;}@media only screen and (min-width: 480px){.hide_on_desktop{display: none !important;}}.hide_section_on_desktop{display: table !important; width: 100%;}@media only screen and (min-width: 480px){.hide_section_on_desktop{display: none !important;}}p, h1, h2, h3{margin: 0px;}ul, li, ol{font-size: 11px; font-family: Ubuntu, Helvetica, Arial;}a{text-decoration: none; color: inherit;}@media only screen and (max-width:480px){.mj-column-per-100{width:100%!important; max-width:100%!important;}.mj-column-per-100 > .mj-column-per-75{width:75%!important; max-width:75%!important;}.mj-column-per-100 > .mj-column-per-60{width:60%!important; max-width:60%!important;}.mj-column-per-100 > .mj-column-per-50{width:50%!important; max-width:50%!important;}.mj-column-per-100 > .mj-column-per-40{width:40%!important; max-width:40%!important;}.mj-column-per-100 > .mj-column-per-33{width:33.333333%!important; max-width:33.333333%!important;}.mj-column-per-100 > .mj-column-per-25{width:25%!important; max-width:25%!important;}.mj-column-per-100{width:100%!important; max-width:100%!important;}.mj-column-per-75{width:100%!important; max-width:100%!important;}.mj-column-per-60{width:100%!important; max-width:100%!important;}.mj-column-per-50{width:100%!important; max-width:100%!important;}.mj-column-per-40{width:100%!important; max-width:100%!important;}.mj-column-per-33{width:100%!important; max-width:100%!important;}.mj-column-per-25{width:100%!important; max-width:100%!important;}}</style> </head> <body style="background-color:#FFFFFF;"> <div style="background-color:#FFFFFF;"><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="background:#0c1c33;background-color:#0c1c33;margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0c1c33;background-color:#0c1c33;width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;"><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"> <tr> <td align="center" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;" class="full-width-mobile"> <tbody> <tr> <td style="width:240px;" class="full-width-mobile"> <img height="auto" src="https://s3.us-east-2.amazonaws.com/images.pool.moblab.digital/iIturanmob_negative.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="240"> </td></tr></tbody> </table> </td></tr><tr> <td style="font-size:0px;padding:20px 10px;padding-top:20px;padding-right:10px;padding-bottom:20px;word-break:break-word;"> <p style="font-family: Ubuntu, Helvetica, Arial; border-top: solid 1px #FFFFFF; font-size: 1; margin: 0px auto; width: 100%;"> </p><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #FFFFFF;font-size:1;margin:0px auto;width:580px;" role="presentation" width="580px" > <tr> <td style="height:0;line-height:0;"> &nbsp; </td></tr></table><![endif]--> </td></tr><tr> <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"> <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><h1 style="font-family: 'Cabin', sans-serif; font-size: 22px;"><span style="color: #ffffff;">Solicita&ccedil;&atilde;o de exclus&atilde;o de conta</span></h1></div></td></tr><tr> <td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"> <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.5;text-align:left;color:#000000;"><p style="font-size: 11px; font-family: Ubuntu, Helvetica, Arial;"><span style="color: #ffffff;">%MESSAGE%</span></p></div></td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </div></body> </html>`;

    awsSESClient = AwsSES.createClient({
        key: this.awsAccessKeyId,
        secret: this.awsSecretAccessKey,
        amazon: this.awsSESEndpoint,
    });

    constructor(private configService: ConfigService, private i18nService: I18nService) {}

    sendEmail(to: string, subject: string, message: string) {
        return new Promise((res) => {
            this.awsSESClient.sendEmail(
                {
                    from: this.mailerSender,
                    to,
                    subject,
                    message,
                },
                (error) => {
                    if (error) {
                        this.logger.error(`ERROR SENDING EMAIL ${JSON.stringify(error)}`);
                        res(false);
                    } else res(true);
                },
            );
        });
    }

    sendAccountDeletionRequest(accountToDelete: AccountDTO) {
        const subject = 'Pedido de exclusão da conta';
        const message = `O usuário ${accountToDelete.name} (${accountToDelete.email}) fez uma solicitação para que sua conta seja excluída.`;

        const template = this.accountDeletionEmailTemplate.replace('%MESSAGE%', message);

        return this.sendEmail(this.accountSupportEmail, subject, template);
    }

    sendAccountDeletionRequestConfirmation(to: string) {
        const subject = 'Seu pedido de exclusão de conta foi recebido';
        const message =
            'Nós recebemos seu pedido de exclusão de conta e ele já foi direcionado para nosso setor de análise. Seu pedido será processado nos próximos dias e você receberá uma atualização através desse endereço de email.';

        const template = this.accountDeletionEmailTemplate.replace('%MESSAGE%', message);

        return this.sendEmail(to, subject, template);
    }

    async getLayoutConfig(companyId: number) {
        const logo = await this.configService.findByNameAndContract('layout.logo', companyId, false);
        const primaryColor = await this.configService.findByNameAndContract('layout.primary_color', companyId, false);

        return { logo: logo || '', primaryColor: primaryColor || '#777777' };
    }

    async resolveAndCompileTemplate(emailId: string, data: any) {
        const basePath = path.join(path.resolve(), 'html-template', 'emails');
        const htmlPath = path.join(basePath, emailId, 'template.html');

        const templateHtml = await readFile(htmlPath, { encoding: 'utf-8' });
        return compileTemplate({ content: templateHtml, data });
    }

    async translateKeys(object: Record<string, string>, lang: string) {
        const newObject = {};
        const translationPromises = Object.keys(object).map(async (key) => {
            newObject[key] = await this.i18nService.t(object[key], { lang });
        })

        await Promise.all(translationPromises);

        return newObject;
    }

    async sendAccountApproval(account: AccountDTO) {
        const accountFirstCompany = account.contracts[0]?.company;
        const companyId = accountFirstCompany.id;

        const config = await this.configService.findByNameAndCompany('email_notification.welcome', companyId);

        if (config !== 'true') return true;

        const { displayLanguage } = account;
        const subject = await this.i18nService.t('email.account_approval.subject', { lang: displayLanguage });

        const layoutConfig = await this.getLayoutConfig(companyId);

        const content = await this.translateKeys(
            {
                greeting: 'email.account_approval.greeting',
                p1: 'email.account_approval.p1',
                p2: 'email.account_approval.p2',
                p3: 'email.account_approval.p3',
                footer: 'email.account_approval.footer',
            },
            displayLanguage,
        );

        const emailData = { account, company: accountFirstCompany, config: layoutConfig, content };

        const processedTemplate = await this.resolveAndCompileTemplate('account-approval', emailData);

        return this.sendEmail(account.email, subject, processedTemplate);
    }
}
