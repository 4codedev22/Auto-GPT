import { Injectable, HttpException, HttpStatus, Logger, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';

import { AccountDTO, AlertDTO, AlertReportFilterDTO, AlertFilterDTO } from './dto';
import { AlertMapper } from './mapper';

import { AlertRepository } from '../repository';

import { ReportService } from '.';

const relationshipNames = [];

@Injectable()
export class AlertService {
  logger = new Logger('AlertService');

  constructor(
    @InjectRepository(AlertRepository)
    private alertRepository: AlertRepository,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService) { }

  async findById(id: number): Promise<AlertDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.alertRepository.findOne(id, options);
    return AlertMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<AlertDTO>): Promise<AlertDTO | undefined> {
    const result = await this.alertRepository.findOne(options);
    return AlertMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<AlertDTO>, alertFilter: AlertFilterDTO): Promise<[AlertDTO[], number]> {
    if (!alertFilter?.vehicleIdentifier) {
      throw new BadRequestException('The parameter vehicleIdentifier is required!');
    }

    let queryBuilder = this.alertRepository.createQueryBuilder('alert')
      .where('alert.vehicleIdentifier = :vehicleIdentifier', { vehicleIdentifier: alertFilter?.vehicleIdentifier });

    if (alertFilter?.searchGroupAndType) {
      let queryGroupAndType = alertFilter?.searchGroupAndType.split(',').map((groupAndType) => {
        const [group, type] = groupAndType.split('.');
        return `(alert.groupId = '${group}' AND alert.typeId = '${type}')`;
      }).join(' OR ');
      queryBuilder = queryBuilder.andWhere(`(${queryGroupAndType})`);
    }

    if (alertFilter?.status) {
      queryBuilder = queryBuilder.andWhere('alert.status = :status', { status: alertFilter?.status });
    }


    const resultList = await queryBuilder
      .orderBy(options.order as OrderByCondition)
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();

    const alertDTO: AlertDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(alert => alertDTO.push(AlertMapper.fromEntityToDTO(alert)));
    }

    return [alertDTO, resultList[1]];
  }

  async report(
    options: FindManyOptions<AlertDTO>,
    contractID: number,
    filter: AlertReportFilterDTO,
    creator: AccountDTO
  ): Promise<void> {
    try {
      const queryBuilder = await this.alertRepository.report(contractID, filter, options.order as OrderByCondition);
      await this.reportService.createXlsxStreamReport('alerts', creator, await queryBuilder.stream());
    } catch (error) {
      this.logger.error(error, error, 'alerts.report');
    }
  }

  async save(alertDTO: AlertDTO, creator?: string): Promise<AlertDTO | undefined> {
    const entity = AlertMapper.fromDTOtoEntity(alertDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.alertRepository.save(entity);
    return AlertMapper.fromEntityToDTO(result);
  }

  async update(alertDTO: AlertDTO, updater?: string): Promise<AlertDTO | undefined> {
    const entity = AlertMapper.fromDTOtoEntity(alertDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.alertRepository.save(entity);
    return AlertMapper.fromEntityToDTO(result);
  }

  async updateById(id, alertDTO: AlertDTO, updater?: string): Promise<AlertDTO | undefined> {
    const entity = AlertMapper.fromDTOtoEntity(alertDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }

    await this.alertRepository.update(id, entity);
    
    return this.findById(id);
  }


  async deleteById(id: number): Promise<void | undefined> {
    await this.alertRepository.softDelete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
