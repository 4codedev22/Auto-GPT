import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { ReservationDTO } from '../service/dto/reservation.dto';

@Injectable()
export class TasksService {
    logger = new Logger('TasksService');

    private axiosClient = axios.create({ baseURL: process.env.BACKGROUND_TASKS_API_URL });

    constructor() {}

    safeExecute(promise: Promise<any>) {
        promise.catch(err => this.logger.error(err));
    }

    scheduleCheckAndNotifyNearDevolutionDate(reservation: ReservationDTO, contractID: number) {
        this.safeExecute(
            this.axiosClient.post('/reservation-tasks/notify-near-devolution', { reservation, contractID }),
        );
    }

    cancelCheckAndNotifyNearDevolutionDate(reservationID: number) {
        this.safeExecute(this.axiosClient.delete(`/reservation-tasks/notify-near-devolution/${reservationID}`));
    }

    scheduleCheckAndChangeVehicleOrCancelReservation(reservationID: number, contractID: number) {
        this.safeExecute(
            this.axiosClient.post('/reservation-tasks/change-vehicle-or-cancel-reservation', {
                reservationID,
                contractID,
            }),
        );
    }

    cancelCheckAndChangeVehicleOrCancelReservation(reservationID: number) {
        this.safeExecute(
            this.axiosClient.delete(`/reservation-tasks/change-vehicle-or-cancel-reservation/${reservationID}`),
        );
    }

    scheduleCheckAndNotifyWithdrawalAvailable(reservationID: number, contractID: number) {
        this.safeExecute(
            this.axiosClient.post('/reservation-tasks/notify-withdrawal-available', {
                reservationID,
                contractID,
            }),
        );
    }

    cancelCheckAndNotifyWithdrawalAvailable(reservationID: number) {
        this.safeExecute(this.axiosClient.delete(`/reservation-tasks/notify-withdrawal-available/${reservationID}`));
    }

    scheduleCheckAndCancelAfterWithdrawalDate(reservationID: number, contractID: number) {
        this.safeExecute(
            this.axiosClient.post('/reservation-tasks/cancel-after-withdrawal-date', {
                reservationID,
                contractID,
            }),
        );
    }

    cancelCheckAndCancelAfterWithdrawalDate(reservationID: number) {
        this.safeExecute(this.axiosClient.delete(`/reservation-tasks/cancel-after-withdrawal-date/${reservationID}`));
    }

    scheduleCheckAndNotifyDelayedDevolution(reservationID: number, contractID: number) {
        this.safeExecute(
            this.axiosClient.post('/reservation-tasks/delayed-devolution', {
                reservationID,
                contractID,
            }),
        );
    }

    cancelCheckAndNotifyDelayedDevolution(reservationID: number) {
        this.safeExecute(this.axiosClient.delete(`/reservation-tasks/delayed-devolution/${reservationID}`));
    }
}
