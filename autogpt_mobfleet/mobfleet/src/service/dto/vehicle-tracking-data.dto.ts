/* eslint-disable @typescript-eslint/no-unused-vars */

import { VehicleTrackingDTO } from "./vehicle-tracking.dto";


export class VechileTrackingLastEvaluatedKeyDTO {
    identifier: string;
    timestamp: Date | string;
    contract_uuid: string;
}
export class VehicleTrackingDataDTO {
    history?: VehicleTrackingDTO[];
    last_evaluated_key?: VechileTrackingLastEvaluatedKeyDTO;
}

export class VehicleTrackingResultDTO {
    data?: VehicleTrackingDataDTO;
}
