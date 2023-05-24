import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, OrderByCondition } from 'typeorm';
import { ReportDTO } from './dto/report.dto';
import { ReportMapper } from './mapper/report.mapper';
import { ReportRepository } from '../repository/report.repository';
import { AccountDTO } from './dto/account.dto';
import ExcelJS, { Worksheet } from 'exceljs';
import { UploadService } from '../module/shared/upload.service';
import { format } from 'date-fns';
import { PassThrough, Stream } from 'stream';
import { ReportExtensionType } from 'src/repository/repository-util';

const relationshipNames = [];
relationshipNames.push('account');


@Injectable()
export class ReportService {
  logger = new Logger('ReportService');

  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository,
    private uploadService: UploadService) { }

  async findById(id: number): Promise<ReportDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.reportRepository.findOne(id, options);
    return ReportMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ReportDTO>): Promise<ReportDTO | undefined> {
    const result = await this.reportRepository.findOne(options);
    return ReportMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    { skip, take, order },
    contractID?: number
  ): Promise<[ReportDTO[], number]> {
    let qb = this.reportRepository.createQueryBuilder('report');
    qb = qb.leftJoin('report.account', 'account');
    qb = qb.leftJoin('account.contracts', 'contracts')
    qb = qb.where('contracts.id = :contractID AND (report.is_empty = 1 OR report.url is not NULL)', { contractID: +contractID });
    qb = qb
      .skip(skip)
      .take(take)
      .orderBy(order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    const reportDTO: ReportDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(report => reportDTO.push(ReportMapper.fromEntityToDTO(report)));
    }
    return [reportDTO, resultList[1]];
  }

  async findAndCountByUser(
    { skip, take, order },
    contractID: number,
    user: AccountDTO
  ): Promise<[ReportDTO[], number]> {
    let qb = this.reportRepository.createQueryBuilder('report');
    qb = qb.innerJoin('report.account', 'account', 'account.id = :userID', { userID: user.id });
    qb = qb.leftJoin('account.contracts', 'contracts')
    qb = qb.where('contracts.id = :contractID', { contractID: +contractID });
    qb = qb
      .skip(skip)
      .take(take)
      .orderBy(order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    const reportDTO: ReportDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(report => reportDTO.push(ReportMapper.fromEntityToDTO(report)));
    }
    return [reportDTO, resultList[1]];
  }

  async save(reportDTO: ReportDTO, creator?: string): Promise<ReportDTO | undefined> {
    const entity = ReportMapper.fromDTOtoEntity(reportDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.reportRepository.save(entity);
    return ReportMapper.fromEntityToDTO(result);
  }


  createFileName(report: ReportDTO, extension: ReportExtensionType): string {
    const now = new Date();
    const entityName = report.entityName;
    const dateToString = format(now, 'yyyyMMddHHmmssSSS');
    return `${entityName}-${dateToString}.${extension}`;
  }

  fillWorkbookFromQueryStream(report: ReportDTO, stream, workbook: ExcelJS.stream.xlsx.WorkbookWriter, prepareReportLine: (v: any, buildHeaders: boolean) => any, workbookStream?: PassThrough) {
    let worksheet: Worksheet = null;
    try {
      stream
        .on('data', (data) => {
          const preparedData = prepareReportLine?.(data, !worksheet) ?? data;
          if (!worksheet) {
            worksheet = workbook.addWorksheet(report.entityName);
            if (preparedData?.headers?.length) {
              worksheet.columns = preparedData.headers;
            } else {
              worksheet.columns = Object.getOwnPropertyNames(preparedData).map(header => ({ header, key: header }));
            }
          }
          worksheet.addRow(preparedData).commit();
        }).on('end', (fd) => {
          if (!worksheet) {
            // workbookStream.readableLength
            workbookStream.destroy(new Error('global.noItemsFound'));
          }
          workbook.commit();
        })
        .on('error', (fd) => {
          this.logger.error({ msg: 'data stream fail', fd });
        });
    } catch (error) {
      this.logger.error(error);
    }
  }


  async createXlsxStreamReport(entityName: string, creator: AccountDTO, queryStream: Stream, prepareReportLine?: (v: any, buildHeaders: boolean) => any): Promise<void> {
    const report = await this.createReport(creator, entityName);
    const workbookStream = new Stream.PassThrough();
    workbookStream.on('error', (error) => {
      this.logger.error(error);
    })
    const workbook = this.createWorkbook(workbookStream);
    this.uploadFileAndUpdateReportUrlByStream(report, workbookStream);
    this.fillWorkbookFromQueryStream(report, queryStream, workbook, prepareReportLine, workbookStream);
  }



  async createPdfStreamReport(entityName: string, creator: AccountDTO, pdfStream: Stream): Promise<void> {
    const report = await this.createReport(creator, entityName, 'pdf');
    this.uploadFileAndUpdateReportUrlByStream(report, pdfStream);
  }



  async createPdfBufferReport(entityName: string, creator: AccountDTO, data: Buffer): Promise<void> {
    const report = await this.createReport(creator, entityName, 'pdf');
    this.uploadFileAndUpdateReportUrlByBuffer(report, data);
  }
  private createWorkbook(workbookStream: PassThrough) {
    const options = {
      stream: workbookStream
    };
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
    return workbook;
  }

  private async createReport(creator: AccountDTO, entityName: string, extension: ReportExtensionType = 'xlsx') {
    const reportDTO = new ReportDTO();
    reportDTO.account = creator;
    reportDTO.entityName = entityName;

    reportDTO.fileName = this.createFileName(reportDTO, extension);;

    const entity = ReportMapper.fromDTOtoEntity(reportDTO);
    if (creator) {
      entity.lastModifiedBy = `${creator.id}`;
    }
    const result = await this.reportRepository.save(entity);
    const report = ReportMapper.fromEntityToDTO(result);
    return report;
  }

  async createBufferReport(entityName: string, creator: AccountDTO, extension: ReportExtensionType = 'xlsx'): Promise<ReportDTO> {
    const reportDTO = new ReportDTO();
    reportDTO.account = creator;
    reportDTO.entityName = entityName;

    reportDTO.fileName = this.createFileName(reportDTO, extension);;

    const entity = ReportMapper.fromDTOtoEntity(reportDTO);
    if (creator) {
      entity.lastModifiedBy = `${creator.id}`;
    }
    const result = await this.reportRepository.save(entity);
    return ReportMapper.fromEntityToDTO(result);
  }

  async uploadFileAndUpdateReportUrlByStream(report: ReportDTO, stream: Stream) {
    try {
      this.uploadService.uploadFileStream(stream, report.fileName, false)
        .then(async ({ Location, ...other }) => {
          report.url = Location;
          return await this.update(report);
        }).catch(async (error) => {
          this.logger.error(error);
          return await this.update(report);
        });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async uploadFileAndUpdateReportUrlByBuffer(report: ReportDTO, buffer: Buffer): Promise<ReportDTO> {
    try {
      if (!buffer) {
        report.isEmpty = true;
      } else {
        const { Location } = await this.uploadService.uploadFile(buffer, report.fileName, false);
        report.url = Location;
      }
      return await this.update(report);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(reportDTO: ReportDTO, creator?: AccountDTO): Promise<ReportDTO | undefined> {
    if (!reportDTO?.url) {
      reportDTO.isEmpty = true;
    }
    const entity = ReportMapper.fromDTOtoEntity(reportDTO);
    entity.lastModifiedBy = `${creator?.id ?? reportDTO?.account?.id}`;
    const result = await this.reportRepository.save(entity);
    return ReportMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.reportRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
