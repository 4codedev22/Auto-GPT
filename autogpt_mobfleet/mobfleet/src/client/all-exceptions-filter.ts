import { I18nService } from 'nestjs-i18n';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

interface CustomError {
    msg: string;
    title: string;
    args: Record<string, any>;
}

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) {}

    async processCustomError(response: Response, error: CustomError, lang: string, statusCode: number) {
        let mMessage: string;
        let mTitle: string;
        const { args, msg, title } = error;

        if (msg) mMessage = await this.i18n.t(msg, { lang, args });

        if (title) mTitle = await this.i18n.t(title, { lang });
        else mTitle = await this.i18n.t('global.warning_title', { lang });

        response.status(statusCode).json({ statusCode, message: mMessage, title: mTitle });
    }

    processGenericError(response: Response, error: any, statusCode: number) {
        response.status(statusCode).json({ statusCode, ...error });
    }

    processStringError(response: Response, message: string, statusCode: number) {
        response.status(statusCode).json({ statusCode, message });
    }

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();
        const exceptionData = exception.getResponse() as CustomError | string;
        const lang = ctx.getRequest().i18nLang;

        if (typeof exceptionData === 'string') this.processStringError(response, exceptionData, statusCode);
        else if (exceptionData.msg) this.processCustomError(response, exceptionData, lang, statusCode);
        else this.processGenericError(response, exceptionData, statusCode);
    }
}
