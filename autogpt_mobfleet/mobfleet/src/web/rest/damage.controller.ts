import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { DamageDTO } from '../../service/dto/damage.dto';
import { DamageService } from '../../service/damage.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DamageCreateDTO } from '../../service/dto/damage-create.dto';
import { DamageSolveDTO } from '../../service/dto/damage-solve.dto';
import { DamageReportFilterDTO } from '../../service/dto/damage-report.filter.dto';

@Controller('v2/damages')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('damages')
export class DamageController {
  logger = new Logger('DamageController');

  constructor(private readonly damageService: DamageService) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DamageDTO,
  })
  async getAll(@Req() req: Request): Promise<DamageDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.damageService.findAndCount(
      +req.query.contractID,
      +pageRequest.page * pageRequest.size,
      +pageRequest.size,
      pageRequest.sort.asOrder(),
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: DamageDTO,
  })
  async getOne(@Param('id') id: number): Promise<DamageDTO> {
    return await this.damageService.findById(id);
  }

  @PostMethod('/report')
  @Roles(
    ...N2_AND_HIGHER
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'Create Report',
  })
  async createReport(@Req() req: Request, @Query('contractID') contractID: number, @Query() filter: DamageReportFilterDTO): Promise<void> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'damage.id,DESC',
    );
    await this.damageService.report(
      {
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter,
      req.user
    );
  }

  @Get('/byVehicleId/:vehicleId')
  @Roles(RoleType.ADMINISTRATOR,  RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: DamageDTO,
  })
  async getOneByVehicleId(@Param('vehicleId') vehicleId: number, @Req() req: Request): Promise<DamageDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.damageService.findAndCountByVehicleId(
      +vehicleId,
      +req.query.contractID,
      +pageRequest.page * pageRequest.size,
      +pageRequest.size,
      pageRequest.sort.asOrder(),
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Create damage' })
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DamageDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() damageDTO: DamageDTO): Promise<DamageDTO> {
    const created = await this.damageService.save(damageDTO, `${req.user?.id}`);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Damage', created.id);
    return created;
  }

  @PostMethod('/create')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create damage' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DamageDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'damageImages' }]))
  async create(
    @UploadedFiles() files: { damageImages?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() damageDTO: DamageCreateDTO,
  ): Promise<DamageDTO> {
    const created = await this.damageService.createWithFiles(
      { damageImages: files?.damageImages },
      damageDTO,
      req.user,
      +req.query.contractID,
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Damage', created.id);
    return created;
  }

  @PostMethod('/solve/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create damage' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DamageDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'solutionImages' }]))
  async solve(
    @UploadedFiles() files: { solutionImages?: Express.Multer.File[] },
    @Param('id') id: number,
    @Req() req: Request,
    @Body() damageDTO: DamageSolveDTO,
  ): Promise<DamageDTO> {
    const created = await this.damageService.solve(
      +id,
      { solutionImages: files?.solutionImages },
      damageDTO,
      req.user,
      +req.query.contractID,
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Damage', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update damage' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DamageDTO,
  })
  async put(@Req() req: Request, @Body() damageDTO: DamageDTO): Promise<DamageDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Damage', damageDTO.id);
    return await this.damageService.update(damageDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update damage with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DamageDTO,
  })
  async putId(@Req() req: Request, @Body() damageDTO: DamageDTO): Promise<DamageDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Damage', damageDTO.id);
    return await this.damageService.update(damageDTO, `${req.user?.id}`);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Delete damage' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Damage', id);
    return await this.damageService.deleteById(id);
  }
}
