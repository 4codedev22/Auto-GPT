import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReportDTO } from '../../service/dto/report.dto';
import { ReportService } from '../../service/report.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';


@Controller('v2/reports')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('reports')
export class ReportController {
  logger = new Logger('ReportController');

  constructor(private readonly reportService: ReportService) { }


  @Get('/')
  @Roles(...N2_AND_HIGHER)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ReportDTO,
  })
  async getAll(@Req() req: Request): Promise<ReportDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size ?? 5,
      req.query.sort ?? 'report.id,DESC',
      req.query.search,
      req.query.filter,
      req.query.contractID,
    );
    const [results, count] = await this.reportService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    },
      pageRequest.contractID);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }



  @Get('/byUser')
  @Roles(...N2_AND_HIGHER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ReportDTO,
  })
  @UseGuards(ContractGuard)
  async getAllByUser(@Req() req: Request): Promise<ReportDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'report.id,DESC',
      req.query.search,
      req.query.filter,
      req.query.contractID,
    );
    const [results, count] = await this.reportService.findAndCountByUser({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    },
      pageRequest.contractID,
      req.user);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }


  @Get('/:id')
  @Roles(...N2_AND_HIGHER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ReportDTO,
  })
  async getOne(@Param('id') id: number): Promise<ReportDTO> {
    return await this.reportService.findById(id);
  }

  @Delete('/:id')
  @Roles(...N2_AND_HIGHER)
  @ApiOperation({ title: 'Delete report' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Report', id);
    return await this.reportService.deleteById(id);
  }
}
