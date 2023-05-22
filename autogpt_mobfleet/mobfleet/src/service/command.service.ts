import { Injectable, HttpException, HttpStatus, Logger, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CommandDTO } from '../service/dto/command.dto';
import { CommandMapper } from '../service/mapper/command.mapper';
import { CommandRepository } from '../repository/command.repository';
import { DeviceCommandService, GetJobResponse } from './device-command.service';
import { AvailableCommands } from '../domain/enumeration/available-commands';
import { ContractService } from './contract.service';
import { VehicleService } from './vehicle.service';
import { CommandLogResponse, CommandLogService } from './command-log.service';
import { CommandLogDTO } from './dto/command-log.dto';
import { AccountDTO } from './dto/account.dto';
import { CommandStatus } from '../domain/enumeration/command-status';
import { ContractDTO } from './dto/contract.dto';
import { VehicleDTO } from './dto/vehicle.dto';
import { CommandLogMapper } from './mapper/command-log.mapper';
import { CommandLogSimpleDTO } from './dto/command-log.simple.dto';
import { format } from 'date-fns';
import { DB_DATETIME_FORMAT } from '../repository/date-utils';

import * as bcrypt from 'bcryptjs';

const relationshipNames = [];
relationshipNames.push('contracts');

export type SendCommandsParams = {
    contractID: number,
    user: AccountDTO,
    vehicleID: number,
    isUrgent: boolean
}

@Injectable()
export class CommandService {
    logger = new Logger('CommandService');

    constructor(
        @InjectRepository(CommandRepository)
        private commandRepository: CommandRepository,
        private deviceCommandService: DeviceCommandService,
        @Inject(forwardRef(() => ContractService))
        private contractService: ContractService,
        @Inject(forwardRef(() => VehicleService))
        private vehicleService: VehicleService,
        @Inject(forwardRef(() => CommandLogService))
        private commandLogService: CommandLogService,
    ) { }

    async findById(id: number): Promise<CommandDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.commandRepository.findOne(id, options);
        return CommandMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CommandDTO>): Promise<CommandDTO | undefined> {
        const result = await this.commandRepository.findOne(options);
        return CommandMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<CommandDTO>): Promise<[CommandDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.commandRepository.findAndCount(options);
        const commandDTO: CommandDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(command => commandDTO.push(CommandMapper.fromEntityToDTO(command)));
            resultList[0] = commandDTO;
        }
        return [commandDTO, resultList[1]];
    }

    async save(commandDTO: CommandDTO, creator?: string): Promise<CommandDTO | undefined> {
        const entity = CommandMapper.fromDTOtoEntity(commandDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.commandRepository.save(entity);
        return CommandMapper.fromEntityToDTO(result);
    }

    async update(commandDTO: CommandDTO, updater?: string): Promise<CommandDTO | undefined> {
        const entity = CommandMapper.fromDTOtoEntity(commandDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.commandRepository.save(entity);
        return CommandMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.commandRepository.softDelete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    private getDateFromJob(job: GetJobResponse): any {
        switch (job?.status) {
            case CommandStatus.QUEUED:
                return job.queued_at;
            case CommandStatus.FAILED:
            case CommandStatus.SUCCEEDED:
            case CommandStatus.TIMED_OUT:
                return job.succeeded_at;
            case CommandStatus.IN_PROGRESS:
                return job.in_progress_at;
            default:
                return format(new Date(), DB_DATETIME_FORMAT);
        }
    }

    async openDoor(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.OPEN_DOOR, isUrgent);
    }

    async closeDoor(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.CLOSE_DOOR, isUrgent);
    }
    async block(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.BLOCK, isUrgent);
    }
    async undoBlock(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.UNDO_BLOCK, isUrgent);
    }
    async reset(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.RESET, isUrgent);
    }
    async openTrunk(params: SendCommandsParams): Promise<CommandLogDTO> {
        const { contractID, user, vehicleID, isUrgent } = params;
        return await this.sendCommand(contractID, user, vehicleID, AvailableCommands.OPEN_TRUNK, isUrgent);
    }


    private generateFakeJob(vehicle: VehicleDTO): GetJobResponse {
        const now = new Date();
        const nowFormatted = format(now, DB_DATETIME_FORMAT);
        const fakeJob: GetJobResponse = {
            identifier: now.getTime().toString(16).substring(0, 254).toUpperCase(),
            device_identifier: vehicle.deviceBleUuid,
            status: CommandStatus.SUCCEEDED,
            queued_at: nowFormatted,
            in_progress_at: nowFormatted,
            succeeded_at: nowFormatted
        }
        return fakeJob;
    }

    async sendCommand(
        contractID: number,
        user: AccountDTO,
        vehicleID: number,
        command: AvailableCommands,
        isUrgent = true
    ): Promise<CommandLogDTO> {
        const contract = await this.contractService.findById(contractID, user);
        const vehicle = await this.vehicleService.findById(vehicleID);
        const sentCommand = await this.deviceCommandService.sendCommand(contract, user.id, vehicle, command, isUrgent);
        const jobIdentifier = sentCommand.data?.jobs?.[0];
        let job: GetJobResponse = null;
        if (jobIdentifier?.trim()?.length) {
            job = await this.deviceCommandService.GetJobCommand(contract, jobIdentifier);
        } else {
            job = this.generateFakeJob(vehicle);
        }
        const dbCommand = await this.findByFields({ where: { name: command } });
        const executedAt = this.getDateFromJob(job);
        const commandLog = {
            account: user,
            command: dbCommand,
            jobIdentifier,
            executedAt,
            status: job.status,
            vehicle,
            lastModifiedBy: `${user.id}`,
        } as CommandLogDTO;

        return await this.commandLogService.save(commandLog);
    }

    private async getJobStatusAndSave(
        contract: ContractDTO,
        jobIdentifier: string,
        dbCommand: CommandDTO,
        user: AccountDTO,
        vehicle: VehicleDTO,
    ): Promise<CommandLogDTO> {
        const job = await this.deviceCommandService.GetJobCommand(contract, jobIdentifier);
        const executedAt = this.getDateFromJob(job);
        const commandLog = {
            account: user,
            command: dbCommand,
            jobIdentifier,
            executedAt,
            status: job.status,
            vehicle,
            lastModifiedBy: user.email,
        } as CommandLogDTO;

        const lastStatus = await this.commandLogService.findEqual(commandLog);

        if (lastStatus && lastStatus?.id) {
            return lastStatus;
        }

        return await this.commandLogService.save(commandLog);
    }

    public async loadCommandStatus(
        contractID: number,
        user: AccountDTO,
        vehicleID: number,
        limit: number,
    ): Promise<CommandLogDTO[]> {
        const contract = await this.contractService.findById(contractID, user);
        const vehicle = await this.vehicleService.findById(vehicleID);

        const allAvailableLogs = await this.commandLogService.findRunningCommandsByVehicle(vehicle, limit);

        const response = await Promise.all(
            await allAvailableLogs?.map(async (job: CommandLogResponse) => {
                const command = await this.findById(job.commandID);
                return await this.getJobStatusAndSave(contract, job.jobIdentifier, command, user, vehicle);
            }),
        );
        if (response?.length < limit) {
            const executed = await this.commandLogService.findLastExecuted(vehicle, limit - response?.length ?? 0);
            return response.concat(executed);
        }
        return response;
    }

    public async loadSimpleCommandStatus(
        contractID: number,
        user: AccountDTO,
        vehicleID: number,
        limit: number,
    ): Promise<CommandLogSimpleDTO[]> {
        const resultList = await this.loadCommandStatus(contractID, user, vehicleID, +limit);
        return resultList?.map(r => CommandLogMapper.fromDTOtoSimpleDTO(r));
    }
}
