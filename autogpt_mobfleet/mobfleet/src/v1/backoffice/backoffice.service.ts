import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import { AccountV1DTO } from '../../service/dto/account-v1.dto';
import { AccountDTO } from '../../service/dto/account.dto';
import { PasswordChangeWithTokenDTO } from '../../service/dto/password-change-with-token.dto';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import FormData from 'form-data';

@Injectable()
export class BackofficeService {
  logger = new Logger('BackofficeService');

  async createV1Account(accountV1: AccountV1DTO, loginToken: string): Promise<number> {
    try {
      const response = await axios.post(this.getAccountUrl(), accountV1, {
        headers: {
          'x-api-key': loginToken,
          'Content-Type': 'application/json',
          'Accept-Language': accountV1?.displayLanguage ?? 'pt',
        },
      });
      const accountID = +response?.data?.id;
      return accountID;
    } catch (error) {
      const message = error?.response?.data?.error?.message ?? error?.response?.data?.message ?? error?.response?.message ?? error?.message;
      const obj = error?.response?.data?.error?? error?.response?.data ?? error?.response ?? error;
      this.logger.error(message ?? obj, 'falha ao criar usuário');
      throw new HttpException(message ?? obj, error.response?.status);
    }
  }

  async forgotPasswordV1(account: AccountDTO): Promise<void> {
    const doAxiosRequest = async (url, body): Promise<void> => {
      await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    try {
      await doAxiosRequest(this.getBackofficeAccountsPasswordForgotUrl(), { email: account.email });
    } catch (error) {

      this.logger.error(error?.response?.data ?? error);
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status);
    }
  }

  async changePasswordWithTokenV1(passwordChange: PasswordChangeWithTokenDTO): Promise<void> {
    const formData = new FormData();
    formData.append('password', passwordChange.password);
    formData.append('token', passwordChange.token);
    try {
      await axios.post(this.v1BackofficeAccountsPasswordPathUrl(), formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } catch (error) {
      this.logger.error(error?.response?.data ?? error);
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status);
    }
  }

  async changeProfilePasswordV1(passwordChange: PasswordChangeDTO, loginToken: string): Promise<void> {
    try {
      await axios.post(this.getProfilePasswordUrl(), passwordChange, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': loginToken,
        },
      });
    } catch (error) {
      this.logger.error(error?.response?.data ?? error);
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status === 403 ? 400 : error.response?.status);
    }
  }

  private getAccountUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const backofficeUrl = process.env.V1_BACKOFFICE_PATH;
    const accountsBaseUrl = process.env.V1_ACCOUNTS_PATH;
    const url = `${baseUrl}${backofficeUrl}${accountsBaseUrl}/`;
    return url;
  }

  // private getForgotPasswordUrl(): string {
  //   const baseUrl = process.env.V1_BASE_URL;
  //   const forgotPasswordUrl = process.env.V1_FORGOT_PASSWORD_PATH;
  //   const url = `${baseUrl}${forgotPasswordUrl}`;
  //   return url;
  // }

  private getBackofficeAccountsPasswordForgotUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const backofficeAccountsPasswordForgotUrl = process.env.V1_BACKOFFICE_ACCOUNTS_PASSWORD_FORGOT_PATH;
    const url = `${baseUrl}${backofficeAccountsPasswordForgotUrl}`;
    return url;
  }

  private v1BackofficeAccountsPasswordPathUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const accountsPasswordUrl = process.env.V1_BACKOFFICE_ACCOUNTS_PASSWORD_PATH;
    const url = `${baseUrl}${accountsPasswordUrl}`;
    return url;
  }

  private getProfilePasswordUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const profilePasswordUrl = process.env.V1_PROFILE_PASSWORD_PATH;
    const url = `${baseUrl}${profilePasswordUrl}`;
    return url;
  }
}
