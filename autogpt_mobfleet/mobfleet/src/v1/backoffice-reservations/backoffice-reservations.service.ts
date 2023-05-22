import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ReservationCreateV1DTO } from '../../service/dto/reservation-create-v1.dto';
import FormData from 'form-data';

@Injectable()
export class BackofficeReservationsService {
  logger = new Logger('BackofficeReservationsService');

  async createV1Reservation(reservationV1: ReservationCreateV1DTO, loginToken: string, isApp: boolean): Promise<number> {
    let url = this.getCreateReservationUrl();
    if (isApp) {
      url = this.getCreateAPPReservationUrl();
    }

    const formData = this.getFormData(reservationV1);
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'x-api-key': loginToken,
          ...formData.getHeaders(),
        },
      });

      return +response?.data?.id;
    } catch (error) {

      this.logger.error(error?.response?.data ?? error);
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status);
    }
  }

  async updateResevationStatus(reservationID: number | string, status: number, loginToken: string): Promise<number> {
    const formData = new FormData();
    formData.append('reservation[status]', status);
    try {
      const response = await axios.put(`${this.getCreateReservationUrl()}/${reservationID}`, formData, {
        headers: {
          'x-api-key': loginToken,
          ...formData.getHeaders(),
        },
      });
      return +response?.data?.id;
    } catch (error) {

      this.logger.error(error?.response?.data ?? error);
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status);
    }
  }

  private getFormData(reservationV1: ReservationCreateV1DTO): FormData {
    if (!reservationV1) {
      return;
    }
    const formData = new FormData();
    const keys = Object.getOwnPropertyNames(reservationV1);
    const objectToShow: any = {};
    keys?.forEach(key => {
      const formKey = `reservation[${key}]`;
      const formValue = reservationV1[key];
      objectToShow[formKey] = formValue;
      if (formValue !== null) formData.append(formKey, formValue);
    });
    this.logger.debug(objectToShow);
    return formData;
  }

  private getCreateReservationUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const backofficeReservationPath = process.env.V1_BACKOFFICE_RESERVATIONS_PATH;
    return `${baseUrl}${backofficeReservationPath}`;
  }

  private getCreateAPPReservationUrl(): string {
    const baseUrl = process.env.V1_BASE_URL;
    const appReservationPath = process.env.V1_APP_RESERVATIONS_PATH;
    return `${baseUrl}${appReservationPath}`;
  }
}
