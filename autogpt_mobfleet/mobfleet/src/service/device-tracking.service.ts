import { Injectable, Logger, HttpException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ContractDTO } from './dto/contract.dto';
import { AvailableCommands } from '../domain/enumeration/available-commands';
import { CommandStatus } from '../domain/enumeration/command-status';
import { Contract } from '../domain/contract.entity';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleDTO } from './dto/vehicle.dto';
import { format, formatISO } from 'date-fns';
import { VehicleTrackingResultDTO } from './dto/vehicle-tracking-data.dto';

export type DateIntervalType = {
  from: string;
  to: string;
};

export type PaginationType = {
  hash: string;
  range: string;
  contractUUID: string;
};
const relationshipNames = [];
relationshipNames.push('contracts');

export interface SendCommandResponse {
  data: {
    message: string;
    jobs: string[];
  };
}

export interface GetJobResponse {
  identifier: string;
  device_identifier: string;
  status: CommandStatus;
  queued_at: string;
  in_progress_at: string;
  succeeded_at: string;
}

export const blockedMotorcycleCommands = [AvailableCommands.OPEN_DOOR, AvailableCommands.CLOSE_DOOR];
export const onlyMotorcycleCommands = [AvailableCommands.OPEN_TRUNK];


@Injectable()
export class DeviceTrackingService {
  logger = new Logger('DeviceTrackingService');

  constructor() { }

  private getAuthorization(contract: ContractDTO): string {
    const apiToken = contract.clientToken;
    const apiSecret = contract.secretToken;
    const b64 = Buffer.from(`${apiToken}:${apiSecret}`).toString('base64');
    return `Basic ${b64}`;
  }

  private encodePagination(pagination?: PaginationType): string {
    if (pagination?.hash && pagination?.range) {
      return `&paginationHash=${pagination.hash}&paginationRange=${pagination.range}&contract_uuid=${pagination.contractUUID}`;
    }
    return '';
  }


  private getTrackingUrl({ uuid }: Contract | ContractDTO, { chassis }: Vehicle | VehicleDTO, { from, to }: DateIntervalType, limit: string | number = 999, pagination?: PaginationType): string {
    const commandUrl = process.env.COMMAND_LIST_VEHICLE_TRACKING?.replace('%CHASSIS%', chassis)
      .replace('%FROM_DATETIME%', from)
      .replace('%TO_DATETIME%', to)
      .replace('%LIMIT%', `${limit}`)
      .replace('%PAGINATION_HASH_AND_RANGE_ENCODED%', this.encodePagination(pagination));
    const url = `${process.env.CORE_API_URL}${commandUrl}`;
    return url
  }

  private getDateInterval({ start: from, end: to }: Interval): DateIntervalType {

    const asString = (date: Date | number) => formatISO(date)
    return {
      from: asString(from),
      to: asString(to)
    }
  }

  private getAxiosInstance(contract, url): AxiosInstance {
    const authorization = this.getAuthorization(contract);
    this.logger.debug(
      JSON.stringify({
        url,
        authorization,
      }),
    );
    const axiosClient = axios.create({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
    axiosClient.interceptors.response.use(
      response => {
        this.logger.debug(response.data, 'device tracking');
        return response;
      },
      error => {

        this.logger.error(error?.response?.data ?? error);
        return Promise.reject(error);
      },
    );
    return axiosClient;
  }
  public async listTracking(contract: Contract, vehicle: Vehicle, from: Date, to: Date, limit?: string | number, pagination?: PaginationType): Promise<VehicleTrackingResultDTO> {
    const url = this.getTrackingUrl(contract, vehicle, this.getDateInterval({ start: from, end: to }), limit, pagination);
    try {
      const axiosClient = this.getAxiosInstance(contract, url);
      const result = await axiosClient.get<VehicleTrackingResultDTO>(url);
      // this.logger.debug(result.data, 'tracking response list');
      return result?.data;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status === 403 ? 400 : error.response?.status);
    }
  }

  public async listAllTracking(contract: Contract, vehicle: Vehicle, from: Date, to: Date): Promise<VehicleTrackingResultDTO[]> {
    let pagination: PaginationType = { hash: '', range: '', contractUUID: contract.uuid };
    let result: VehicleTrackingResultDTO[] = [];
    let hasMore = true;
    while (hasMore) {
      const response = await this.listTracking(contract, vehicle, from, to, 999, pagination);
      result.push(response);
      hasMore = !!response?.data?.last_evaluated_key;
      pagination.hash = response?.data?.last_evaluated_key?.identifier;
      pagination.range = response?.data?.last_evaluated_key?.timestamp as string;
      pagination.contractUUID = response?.data?.last_evaluated_key?.contract_uuid;
    }
    return result;
  };
}
