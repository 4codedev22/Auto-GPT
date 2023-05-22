import { Injectable, Logger, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { ContractService } from './contract.service';
import { TrackingParamsType, VehicleService } from './vehicle.service';
import { AccountDTO } from './dto/account.dto';

import { DeviceTrackingService } from './device-tracking.service';
import { VehicleTrackingResultDTO } from './dto/vehicle-tracking-data.dto';
import { differenceInHours } from 'date-fns';
import { VehicleLocationPathsDTO, VehicleTrackingDTO } from './dto/vehicle-tracking.dto';
import { ContractDTO } from './dto/contract.dto';
import { VehicleDTO } from './dto/vehicle.dto';

const relationshipNames = [];
relationshipNames.push('contracts');

export type SendCommandsParams = {
    contractID: number,
    user: AccountDTO,
    vehicleID: number,
    isUrgent: boolean
}

@Injectable()
export class VehicleTrackingService {
    logger = new Logger('VehicleTrackingService');

    constructor(
        @Inject(forwardRef(() => DeviceTrackingService))
        private deviceTrackingService: DeviceTrackingService,
        @Inject(forwardRef(() => ContractService))
        private contractService: ContractService,
        @Inject(forwardRef(() => VehicleService))
        private vehicleService: VehicleService,
    ) { }

    private validateTimeInterval(fromDateAndTime: Date,
        toDateAndTime: Date) {
        const hoursOfSearch = Math.abs(differenceInHours(fromDateAndTime, toDateAndTime));
        if (hoursOfSearch > 6) {
            throw new BadRequestException("Interval of search cannot be grather than 6 hours");
        }
    }
    async list(
        user: AccountDTO,
        contractID: number,
        vehicleID: number,
        fromDateAndTime: Date,
        toDateAndTime: Date,
        paginationHash?: string,
        paginationRange?: string,
        limit?: number | string
    ): Promise<VehicleTrackingResultDTO> {
        const contract = await this.contractService.findById(contractID, user);
        const vehicle = await this.vehicleService.findById(vehicleID);

        this.validateTimeInterval(fromDateAndTime, toDateAndTime);
        return await this.deviceTrackingService.listTracking(contract, vehicle, fromDateAndTime, toDateAndTime, limit, { hash: paginationHash, range: paginationRange, contractUUID: contract.uuid });
    }

    async listAll(
        contract: ContractDTO,
        vehicle: VehicleDTO,
        fromDateAndTime: Date,
        toDateAndTime: Date
    ): Promise<VehicleTrackingResultDTO[]> {
        return await this.deviceTrackingService.listAllTracking(contract, vehicle, fromDateAndTime, toDateAndTime);
    }

    async buildFullTrackingHistoryList(contract, vehicle, fromDateAndTime, toDateAndTime): Promise<VehicleLocationPathsDTO[]> {
        const trackings = await this.deviceTrackingService.listAllTracking(contract, vehicle, fromDateAndTime, toDateAndTime);
        const history = trackings.reduce((acc, { data: { history } }) => {
            const locations = history.map(({
                location: { updated_at, lat, lng },
                telemetry
            }) => ({ updated_at, lat, lng, telemetry }));
            return [...acc, ...locations];
        }, [] as VehicleLocationPathsDTO[]);
        return history;
    }

}
