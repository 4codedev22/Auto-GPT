import { Injectable, HttpException, HttpStatus, Logger, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';
import { DamageDTO } from '../service/dto/damage.dto';
import { DamageMapper } from '../service/mapper/damage.mapper';
import { DamageRepository } from '../repository/damage.repository';
import { DamageCreateDTO } from './dto/damage-create.dto';
import { AccountDTO } from './dto/account.dto';
import { ContractService } from './contract.service';
import { UploadService } from '../module/shared/upload.service';
import { AccountService } from './account.service';
import { ReservationService } from './reservation.service';
import { VehicleService } from './vehicle.service';
import { DamageSolveDTO } from './dto/damage-solve.dto';
import { Damage } from '../domain/damage.entity';
import { ReportService } from './report.service';
import { DamageReportFilterDTO } from './dto/damage-report.filter.dto';
import { readFile } from 'fs';
import * as path from 'path';
import puppeteer, { PuppeteerLaunchOptions } from 'puppeteer-core';
import { compileTemplate } from '../module/shared/report-utils';

const relationshipNames = [];
relationshipNames.push('contract');
relationshipNames.push('vehicle');
relationshipNames.push('vehicle.vehicleModel');
relationshipNames.push('vehicle.vehicleGroup');
relationshipNames.push('account');
relationshipNames.push('solver');
relationshipNames.push('reservation');

type damageOrder = {
  [P in keyof Damage]?: 'ASC' | 'DESC' | 1 | -1;
};

@Injectable()
export class DamageService {
  logger = new Logger('DamageService');

  constructor(
    @InjectRepository(DamageRepository) private damageRepository: DamageRepository,
    private contractService: ContractService,
    @Inject(forwardRef(() => ReservationService))
    private reservationService: ReservationService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    private accountService: AccountService,
    private uploadService: UploadService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
  ) { }

  async findById(id: number): Promise<DamageDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.damageRepository.findOne(id, options);
    return DamageMapper.fromEntityToDTO(result);
  }



  async countUnsolvedDamagesForVehicle(vehicleId: number): Promise<number> {
    let qb = this.damageRepository.createQueryBuilder('damages');
    qb = qb.where('vehicle.id = :vehicleId AND damages.solved = 0', { vehicleId });
    qb = qb
      .leftJoinAndSelect('damages.vehicle', 'vehicle');
    const result = await qb.getCount();
    return result;
  }


  async findByFields(options: FindOneOptions<DamageDTO>): Promise<DamageDTO | undefined> {
    const result = await this.damageRepository.findOne(options);
    return DamageMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    contractID: number,
    skip: number,
    take: number,
    order: damageOrder,
  ): Promise<[DamageDTO[], number]> {
    const resultList = await this.damageRepository.findAndCount({
      relations: relationshipNames,
      where: { contract: { id: contractID } },
      skip,
      take,
      order,
    });
    const damageDTO: DamageDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(damage => damageDTO.push(DamageMapper.fromEntityToDTO(damage)));
      resultList[0] = damageDTO;
    }
    return [damageDTO, resultList[1]];
  }

  async report(
    options: FindManyOptions<DamageDTO>,
    contractID: number,
    filter: DamageReportFilterDTO,
    creator: AccountDTO
  ): Promise<void> {
    try {

      if (!!filter?.id) {
        return this.reportPdfById(options, contractID, filter, creator);
      }
      return this.reportXlsx(options, contractID, filter, creator);
    } catch (error) {
      this.logger.error({ error });
    }
  }

  async reportXlsx(
    options: FindManyOptions<DamageDTO>,
    contractID: number,
    filter: DamageReportFilterDTO,
    creator: AccountDTO
  ): Promise<void> {
    try {
      try {
        const queryBuilder = await this.damageRepository.reportByStream(contractID, filter, options.order as OrderByCondition);
        await this.reportService.createXlsxStreamReport('damages', creator, await queryBuilder.stream());
      } catch (error) {
        this.logger.error(error, error, 'damages.report');
      }
    } catch (error) {
      this.logger.error({ error });
    }
  }

  async reportPdfById(
    options: FindManyOptions<DamageDTO>,
    contractID: number,
    filter: Pick<DamageReportFilterDTO, 'id'>,
    creator: AccountDTO
  ): Promise<void> {

    try {
      const damageRaw = await this.damageRepository.reportById(contractID, filter, options.order as OrderByCondition);
      if (!damageRaw) {
        throw new NotFoundException('global.noItemsFound');
      }
      this.createPdfReport(damageRaw, creator);
    } catch (error) {
      this.logger.error(error, error, 'damages.report');
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async createPdfReport(
    damage: any, creator: AccountDTO
  ): Promise<void> {
    try {
      const basePath = path.join(path.resolve(), 'html-template', 'damages/');
      const htmlPath = path.join(basePath, 'report-template.html');
      readFile(htmlPath, { encoding: 'utf8' }, async (error, content) => {
        if (error) {
          this.logger.error(error, 'reading html error', 'damages.report');
          return;
        }
        try {
          const data = {
            damage
          };
          const pdfOptions: puppeteer.PDFOptions = {
            format: "A4",
            preferCSSPageSize: true
          };
          const options: PuppeteerLaunchOptions = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: process.env.CHROMIUM_EXECUTABLE_PATH };
          const browser = await puppeteer.launch(options);
          const page = await browser.newPage();
          await page.setContent(compileTemplate({ content, data }), { waitUntil: 'networkidle0' });
          const stream = await page.createPDFStream(pdfOptions);
          await this.reportService.createPdfStreamReport('damages', creator, stream);
          const close = async (a) => {
            if (a) {
              this.logger.error(a, `${a}`, 'close');
            }
            if (browser.isConnected()) {
              return await browser.close();
            }
            return a;
          }
          stream.on('end', async e => await close(e));
          stream.on('error', async error => {
            this.logger.error(error, `${error}`, 'stream  error');
            await close(error);
          });
        } catch (error) {
          this.logger.error(error, `${error}`, 'pdf error');
        }
      });
    } catch (error) {
      this.logger.error(error, error, 'damages.report');
    }
  }

  async findAndCountByVehicleId(
    vehicleID: number,
    contractID: number,
    skip: number,
    take: number,
    order: damageOrder,
  ): Promise<[DamageDTO[], number]> {
    const resultList = await this.damageRepository.findAndCount({
      relations: relationshipNames,
      where: { contract: { id: contractID }, vehicle: { id: vehicleID } },
      skip,
      take,
      order,
    });
    const damageDTO: DamageDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(damage => damageDTO.push(DamageMapper.fromEntityToDTO(damage)));
      resultList[0] = damageDTO;
    }
    return [damageDTO, resultList[1]];
  }

  async createWithFiles(
    files: { damageImages?: Express.Multer.File[] },
    damageDTO: DamageCreateDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<DamageDTO | undefined> {
    const damage = DamageMapper.fromCreateDTOtoEntity(damageDTO);
    if (files?.damageImages?.length) {
      try {
        const data = await Promise.all(
          await files.damageImages.map(
            async f => await this.uploadService.uploadFile(f.buffer, f.originalname),
          ),
        );
        damage.damageImages = data.map(d => d.Location);
      } catch (error) {
        this.logger.debug(error, 'create-damageImages');
      }
    }

    damage.solved = false;
    damage.contract = await this.contractService.findById(+contractID, creator);
    damage.reservation = await this.reservationService.findByIdAndContract(+damageDTO.reservation, contractID);
    damage.vehicle = await this.vehicleService.findById(+damageDTO.vehicle);

    if (creator) {
      damage.lastModifiedBy = creator.email;
    }
    const result = await this.damageRepository.save(damage);
    this.vehicleService.updateCountUnsolvedDamages(damage.vehicle?.id);
    return DamageMapper.fromEntityToDTO(result);
  }

  async solve(
    id: number,
    files: { solutionImages?: Express.Multer.File[] },
    damageDTO: DamageSolveDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<DamageDTO | undefined> {
    const damage = await this.damageRepository.findOne({ where: { id } });
    if (!damage?.id) {
      throw new NotFoundException("damage not found");
    }
    if (files?.solutionImages?.length) {
      try {
        const data = await Promise.all(
          await files.solutionImages.map(
            async f => await this.uploadService.uploadFile(f.buffer, f.originalname),
          ),
        );
        damage.solutionImages = data.map(d => d.Location);
      } catch (error) {
        this.logger.debug(error, 'create-solutionImages');
      }
    }
    damage.solved = true;
    damage.solvedAt = new Date();
    damage.solutionComment = damageDTO.solutionComment;

    if (creator) {
      damage.lastModifiedBy = creator.email;
      damage.solver = creator;
    }
    const result = await this.damageRepository.save(damage);

    this.vehicleService.updateCountUnsolvedDamages(damage.vehicle?.id);
    return DamageMapper.fromEntityToDTO(result);
  }

  async save(damageDTO: DamageDTO, creator?: string): Promise<DamageDTO | undefined> {
    const entity = DamageMapper.fromDTOtoEntity(damageDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.damageRepository.save(entity);
    return DamageMapper.fromEntityToDTO(result);
  }

  async update(damageDTO: DamageDTO, updater?: string): Promise<DamageDTO | undefined> {
    const entity = DamageMapper.fromDTOtoEntity(damageDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.damageRepository.save(entity);
    this.vehicleService.updateCountUnsolvedDamages(result.vehicle?.id);
    return DamageMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.damageRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
