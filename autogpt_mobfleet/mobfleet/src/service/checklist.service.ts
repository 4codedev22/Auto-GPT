import { Injectable, HttpException, HttpStatus, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';
import { ChecklistDTO } from './dto/checklist.dto';
import { ChecklistMapper } from './mapper/checklist.mapper';
import { ChecklistRepository } from '../repository/checklist.repository';
import { CheckListReportFilterDTO } from './dto/checklist-report.filter.dto';
import { AccountDTO } from './dto/account.dto';
import { ReportService } from './report.service';

const relationshipNames = [];
relationshipNames.push('vehicle');
relationshipNames.push('account');
relationshipNames.push('reservation');

@Injectable()
export class ChecklistService {
    logger = new Logger('ChecklistService');

    constructor(
        @InjectRepository(ChecklistRepository)
        private checklistRepository: ChecklistRepository,
        @Inject(forwardRef(() => ReportService))
        private reportService: ReportService,) { }

    async findById(id: number): Promise<ChecklistDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.checklistRepository.findOne(id, options);
        return ChecklistMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ChecklistDTO>): Promise<ChecklistDTO | undefined> {
        const result = await this.checklistRepository.findOne(options);
        return ChecklistMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ChecklistDTO>): Promise<[ChecklistDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.checklistRepository.findAndCount(options);
        const checklistDTO: ChecklistDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(checklist => checklistDTO.push(ChecklistMapper.fromEntityToDTO(checklist)));
            resultList[0] = checklistDTO;
        }
        return [checklistDTO, resultList[1]];
    }

    async report(
        options: FindManyOptions<ChecklistDTO>,
        contractID: number,
        filter: CheckListReportFilterDTO,
        creator: AccountDTO
    ): Promise<void> {
        try {
            const queryBuilder = await this.checklistRepository.report(contractID, filter, options.order as OrderByCondition);
            await this.reportService.createXlsxStreamReport('checklists', creator, await queryBuilder.stream());
        } catch (error) {
            this.logger.error(error, error, 'checklists.report');
        }
    }


    async save(checklistDTO: ChecklistDTO, creator?: string): Promise<ChecklistDTO | undefined> {
        const entity = ChecklistMapper.fromDTOtoEntity(checklistDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.checklistRepository.save(entity);
        return ChecklistMapper.fromEntityToDTO(result);
    }

    async update(checklistDTO: ChecklistDTO, updater?: string): Promise<ChecklistDTO | undefined> {
        const entity = ChecklistMapper.fromDTOtoEntity(checklistDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.checklistRepository.save(entity);
        return ChecklistMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.checklistRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
