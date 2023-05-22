import { Injectable, Logger, Inject, forwardRef, InternalServerErrorException, HttpException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ContractDTO } from './dto/contract.dto';
import { AvailableCommands } from '../domain/enumeration/available-commands';
import { CommandStatus } from '../domain/enumeration/command-status';
import { Contract } from '../domain/contract.entity';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleDeviceHWTypes } from '../domain/enumeration/vehicle-device-hw-type';
import { VehicleModelClassification } from '../domain/enumeration/vehicle-model-classification';
import { ContractMapper } from './mapper/contract.mapper';

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

const getCommand = (code: number, userID: string) => ({
  code,
  user: `${userID}`,
  ttl: 36000,
});
export const CommandList = {
  OPEN_DOOR: userID => getCommand(1001, userID),
  CLOSE_DOOR: userID => getCommand(1002, userID),
  BLOCK: userID => getCommand(1005, userID),
  UNDO_BLOCK: userID => getCommand(1006, userID),
  RESET: userID => getCommand(1007, userID),
  OPEN_TRUNK: userID => getCommand(1027, userID),
};

export const blockedMotorcycleCommands = [AvailableCommands.OPEN_DOOR, AvailableCommands.CLOSE_DOOR];
export const onlyMotorcycleCommands = [AvailableCommands.OPEN_TRUNK];


@Injectable()
export class DeviceCommandService {
  logger = new Logger('DeviceCommandService');

  constructor() { }

  private getAuthorization(contract: ContractDTO): string {
    const apiToken = contract.clientToken;
    const apiSecret = contract.secretToken;
    const b64 = Buffer.from(`${apiToken}:${apiSecret}`).toString('base64');
    return `Basic ${b64}`;
  }

  public checkMotorcycleCommands(command: AvailableCommands) {
    if (blockedMotorcycleCommands.includes(command)) {
      throw new BadRequestException('cannot run this command on this vehicleModel');
    }
  }


  public checkCommands(command: AvailableCommands, vehicle: Vehicle) {
    if (vehicle?.vehicleModel?.classification === +VehicleModelClassification.MOTORCYCLE) {
      return this.checkMotorcycleCommands(command);
    }
    if (onlyMotorcycleCommands.includes(command)) {
      throw new BadRequestException('this command is for motocycle only');
    }
  }
  public async sendCommand(
    contract: Contract,
    userID: number,
    vehicle: Vehicle,
    command: AvailableCommands,
    isUrgent = true
  ): Promise<SendCommandResponse> {
    this.checkCommands(command, vehicle);
    const commandUrl = process.env.COMMAND_SEND_URL?.replace('%CONTRACT_ID%', `${contract?.uuid}`).replace(
      '%CHASSIS%',
      vehicle.chassis,
    );
    const url = `${process.env.CORE_API_URL}${commandUrl}`;
    const body = {
      command: CommandList[command](userID),
      urgent: isUrgent && vehicle.deviceHwType === +(VehicleDeviceHWTypes.ERM_STARLINK)
    };
    const authorization = this.getAuthorization(ContractMapper.fromEntityToDTO(contract));
    try {
      this.logger.debug(
        JSON.stringify({
          url,
          body,
          authorization,
        }),
      );
      const axiosClient = axios.create({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      axiosClient.interceptors.response.use(
        response => {
          this.logger.debug(response.data, 'response command');
          return response;
        },
        error => {
          this.logger.error(error?.response?.data ?? error);
          return Promise.reject(error);
        },
      );
      const result = await axiosClient.post(url, body, {
        headers: {
          Authorization: authorization,
        },
      });
      return result?.data;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status === 403 ? 422 : error.response?.status);
    }
  }

  public async listCommands(contract: Contract, vehicle: Vehicle): Promise<any> {
    const commandUrl = process.env.COMMAND_LIST_URL?.replace('%CONTRACT_ID%', `${contract?.uuid}`).replace(
      '%CHASSIS%',
      vehicle.chassis,
    );
    const url = `${process.env.CORE_API_URL}${commandUrl}`;
    try {
      const authorization = this.getAuthorization(ContractMapper.fromEntityToDTO(contract));
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
        },
      });
      axiosClient.interceptors.response.use(
        response => {
          this.logger.debug(response.data, 'list jobs response');
          return response;
        },
        error => {

          this.logger.error(error?.response?.data ?? error);
          return Promise.reject(error);
        },
      );

      const result = await axiosClient.get(url, {
        headers: {
          Authorization: authorization,
        },
      });
      this.logger.debug(result.data, 'command list');
      return result?.data;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status === 403 ? 400 : error.response?.status);
    }
  }

  public async GetJobCommand(contract: Contract, jobIdentifier: string): Promise<GetJobResponse> {
    const commandUrl = process.env.COMMAND_GET_JOB_URL?.replace('%JOB_IDENTIFIER%', jobIdentifier);
    const url = `${process.env.CORE_API_URL}${commandUrl}`;

    try {
      const axiosClient = axios.create({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      axiosClient.interceptors.response.use(
        response => {
          this.logger.debug(response.data, 'get job response');
          return response;
        },
        error => {
          this.logger.error(error?.response?.data ?? error);
          return Promise.reject(error);
        },
      );
      const result = await axiosClient.get<GetJobResponse>(url, {
        headers: {
          Authorization: this.getAuthorization(ContractMapper.fromEntityToDTO(contract)),
        },
      });
      return result?.data;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message ?? error?.response?.data ?? error.response ?? error, error.response?.status === 403 ? 400 : error.response?.status);
    }
  }
}
