import { Module } from '@nestjs/common';
import { BackofficeService } from './backoffice/backoffice.service';
import { BackofficeReservationsService } from './backoffice-reservations/backoffice-reservations.service';

@Module({
    providers: [BackofficeService, BackofficeReservationsService],
    exports: [BackofficeService, BackofficeReservationsService],
})
export class V1Module {}
