/* eslint-disable @typescript-eslint/no-unused-vars */

export class TelemetryUpdatable {
    updated_at?: Date | string;
};
export class VehicleTrackingTelemetryDTO extends TelemetryUpdatable {
    odometer: Partial<TelemetryUpdatable & { km: number | string }>;

    engine: Partial<TelemetryUpdatable & { rpm: number | string }>;

    fuel: Partial<TelemetryUpdatable & { level: number | string }>;
    battery: Partial<TelemetryUpdatable & { volts: number | string }>;
    hardware_extraction_date: Date | string;
    speed: Partial<TelemetryUpdatable & { kmph: number | string }>;
}
export class VehicleTrackingLocationDTO {
    satellites?: number | string;
    altitude?: number | string;
    lng?: number | string;
    course_over_ground?: number | string;
    network_node?: number | string;
    accuracy?: number | string;
    engine_status?: string;
    hardware_extraction_date?: Date;
    network_technology?: number | string;
    quality?: string;
    network_code?: number | string;
    updated_at?: Date;
    antenna_signal?: number | string;
    current_driver?: any;
    lat?: number | string;
}

export type VehicleLocationPathsDTO = Pick<VehicleTrackingLocationDTO, 'lng' | 'lat' | 'updated_at'> & {
    telemetry?: VehicleTrackingTelemetryDTO;
};

export class VehicleTrackingDTO {
    location?: VehicleTrackingLocationDTO;
    contract_uuid: string;
    telemetry?: VehicleTrackingTelemetryDTO;
    identifier: string;
    timestamp: Date;
    device_identifier: string;
}
