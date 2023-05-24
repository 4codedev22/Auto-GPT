import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CommandLogDTO } from './dto/command-log.dto';
import { CommandLogMapper } from './mapper/command-log.mapper';
import { CommandLogRepository } from '../repository/command-log.repository';
import { VehicleDTO } from './dto/vehicle.dto';

const relationshipNames = [];
relationshipNames.push('command');
relationshipNames.push('vehicle');
relationshipNames.push('account');

export interface CommandLogResponse {
  jobIdentifier: string;
  commandID: number;
  executedAt: any;
}

@Injectable()
export class CommandLogService {
  logger = new Logger('CommandLogService');

  constructor(@InjectRepository(CommandLogRepository) private commandLogRepository: CommandLogRepository) { }

  async findById(id: number): Promise<CommandLogDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.commandLogRepository.findOne(id, options);
    return CommandLogMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<CommandLogDTO>): Promise<CommandLogDTO | undefined> {
    const result = await this.commandLogRepository.findOne(options);
    return CommandLogMapper.fromEntityToDTO(result);
  }

  async findEqual({ status, jobIdentifier, vehicle }: CommandLogDTO): Promise<CommandLogDTO | undefined> {
    const commandLog = this.commandLogRepository
      .createQueryBuilder('commandLog')
      .leftJoinAndSelect('commandLog.command', 'command')
      .leftJoinAndSelect('commandLog.vehicle', 'vehicle')
      .leftJoinAndSelect('commandLog.account', 'account')
      .where(`commandLog.job_identifier=:jobIdentifier AND commandLog.status=:status AND commandLog.vehicle_id=:vehicleId`, { vehicleId: vehicle.id, status, jobIdentifier })
    return CommandLogMapper.fromEntityToDTO(await commandLog.getOne());
  }
  async findAndCount(options: FindManyOptions<CommandLogDTO>): Promise<[CommandLogDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.commandLogRepository.findAndCount(options);
    const commandLogDTO: CommandLogDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(commandLog => commandLogDTO.push(CommandLogMapper.fromEntityToDTO(commandLog)));
      resultList[0] = commandLogDTO;
    }
    return [commandLogDTO, resultList[1]];
  }

  async findRunningCommandsByVehicle(vehicle: VehicleDTO, limit: number): Promise<CommandLogResponse[]> {
    const qb = this.commandLogRepository.createQueryBuilder('commandLog');
    const listJobIdentifiers = qb
      .select('DISTINCT (commandLog.job_identifier) as jobIdentifier')
      .innerJoin('commandLog.command', 'command')
      .where("commandLog.status in ('SUCCEEDED','FAILED', 'TIMED_OUT') and vehicle_id=:vehicleId")
      .groupBy('jobIdentifier,status');

    const notFinished = this.commandLogRepository
      .createQueryBuilder('commandLog')
      .select(
        'commandLog.job_identifier as jobIdentifier, commandLog.command_id as commandID, commandLog.executed_at as executedAt',
      )
      .where(`commandLog.job_identifier NOT IN (${listJobIdentifiers.getQuery()}) AND commandLog.vehicle_id=:vehicleId`, { vehicleId: vehicle.id })
      .orderBy('commandLog.executed_at', 'DESC')
      .groupBy('jobIdentifier,status');

    const notFinishedList = await notFinished.limit(limit).getRawMany<CommandLogResponse>();
    return notFinishedList;
  }

  async findLastExecuted(vehicle: VehicleDTO, limit: number): Promise<CommandLogDTO[]> {
    const qb = this.commandLogRepository.createQueryBuilder('commandLog');
    const listJobIdentifiers = qb
      .select('DISTINCT (commandLog.id) as id')
      .innerJoin('commandLog.command', 'command')
      .where("commandLog.status in ('SUCCEEDED','FAILED', 'TIMED_OUT') and vehicle_id=:vehicleId")
      .groupBy('commandLog.job_identifier,commandLog.status')
      .orderBy('commandLog.executed_at', 'DESC');

    const notFinished = this.commandLogRepository
      .createQueryBuilder('commandLog')
      .leftJoinAndSelect('commandLog.command', 'command')
      .leftJoinAndSelect('commandLog.vehicle', 'vehicle')
      .leftJoinAndSelect('commandLog.account', 'account')
      .where(`commandLog.id IN (${listJobIdentifiers.getQuery()})  AND commandLog.vehicle_id=:vehicleId`, { vehicleId: +vehicle.id })
      .limit(limit);

    const resultList = await notFinished.getMany();
    return resultList?.map(commandLog => CommandLogMapper.fromEntityToDTO(commandLog));
  }

  async save(commandLogDTO: CommandLogDTO, creator?: string): Promise<CommandLogDTO | undefined> {
    const entity = CommandLogMapper.fromDTOtoEntity(commandLogDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.commandLogRepository.save(entity);
    return CommandLogMapper.fromEntityToDTO(result);
  }

  async update(commandLogDTO: CommandLogDTO, updater?: string): Promise<CommandLogDTO | undefined> {
    const entity = CommandLogMapper.fromDTOtoEntity(commandLogDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.commandLogRepository.save(entity);
    return CommandLogMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.commandLogRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
