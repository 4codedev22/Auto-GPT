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
import { VehicleDTO } from '../../service/dto/vehicle.dto';
import { TrackingParamsType, VehicleService } from '../../service/vehicle.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { VehicleCreateDTO } from '../../service/dto/vehicle-create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VehicleCalendarFilterDTO } from '../../service/dto/vehicle-calendar.filter.dto';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';
import { VehicleStatusChangeBodyDTO } from '../../service/dto/vehicle-status-change-body.dto';
import { VehicleMinimalDTO } from '../../service/dto/vehicle.minimal.dto';
import { VehicleMinimalFilterDTO } from '../../service/dto/vehicle-minimal.filter.dto';
import { VehicleDashboardFilterDTO } from '../../service/dto/vehicle-dashboard.filter.dto';
import { VehicleTrackingResultDTO } from '../../service/dto/vehicle-tracking-data.dto';
import { BodyLoggingInterceptor } from '../../client/interceptors/body-logging.interceptor';
import { VehicleFilterDTO } from '../../service/dto/vehicle-filter.dto';
import { VehicleTrackingDTO } from '../../service/dto/vehicle-tracking.dto';

@Controller('v2/vehicles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor, BodyLoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('vehicles')
export class VehicleController {
  logger = new Logger('VehicleController');

  constructor(private readonly vehicleService: VehicleService) { }

  @Get('/')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAll(@Req() req: Request, @Query() query: VehicleFilterDTO): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'vehicle.id,DESC',
      req.query.search,
      req.query.filter,
    );
    const [results, count] = await this.vehicleService.findAndCount(
      {
        skip: pageRequest.skip,
        take: pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      query,
      req.query.contractID,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/calendar')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAllByDate(@Req() req: Request, @Query() filter: VehicleCalendarFilterDTO): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'vehicle.id,DESC',
    );
    const [results, count] = await this.vehicleService.findAndCountByVehicleCalendarFilter(
      {
        skip: +(pageRequest.page * pageRequest.size),
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }



  @Get('/dashboard')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAllByDateForDashboard(@Req() req: Request, @Query() filter: VehicleDashboardFilterDTO): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'vehicle.id,DESC',
    );
    const [results, count] = await this.vehicleService.findAndCountByVehicleDashboardFilter(
      {
        skip: +(pageRequest.page * pageRequest.size),
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/minimal')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records with minimal values',
    type: VehicleMinimalDTO,
  })
  async getAllByFilterAndMinimal(@Req() req: Request, @Query() filter: VehicleMinimalFilterDTO): Promise<VehicleMinimalDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'vehicle.id,DESC',
    );
    const [results, count] = await this.vehicleService.findAndCountByVehicleMinimalFilter(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
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
  async createReport(@Req() req: Request, @Query('contractID') contractID: number, @Query() filter: Omit<VehicleCalendarFilterDTO, 'date'>): Promise<void> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'vehicle.id,DESC',
    );
    await this.vehicleService.report(
      {
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter,
      req.user
    );
  }

  @Get('/availability/:locationID/:withdraw/:devolution')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAvailability(
    @Req() req: Request,
    @Param('locationID') locationID: number,
    @Param('withdraw') withdraw: string,
    @Param('devolution') devolution: string,
  ): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'vehicle.id,DESC',
      req.query.search,
      req.query.filter,
    );
    const [results, count] = await this.vehicleService.listByAvailability(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      new Date(withdraw),
      new Date(devolution),
      locationID,
      +req.query.contractID,
      req.user
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/availabilityByUser/:userID/:locationID/:withdraw/:devolution')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAvailabilityByUser(
    @Req() req: Request,
    @Param('userID') userID: number,
    @Param('locationID') locationID: number,
    @Param('withdraw') withdraw: string,
    @Param('devolution') devolution: string,
  ): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'vehicle.id,DESC',
      req.query.search,
      req.query.filter,
    );
    const [results, count] = await this.vehicleService.listByAvailabilityByUserId(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      new Date(withdraw),
      new Date(devolution),
      userID,
      locationID,
      +req.query.contractID,
      pageRequest.search,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleDTO,
  })
  @ApiResponse({ status: 404, description: 'No vehicle found' })
  async getOne(@Req() req: Request, @Param('id') id: number): Promise<VehicleDTO> {
    return await this.vehicleService.findByIdContractAndUserWithAllData(id, +req.query.contractID, +req.user.id);
  }

  @Get('/tracking/:id')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleDTO,
  })
  @ApiResponse({ status: 404, description: 'No vehicle found' })
  async listTracking(@Req() req: Request, @Param('id') id: number, @Query() trackingParams: TrackingParamsType): Promise<VehicleTrackingResultDTO> {
    return await this.vehicleService.listTracking({ ...trackingParams, vehicleID: id, contractID: +req.query.contractID, user: req.user });
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create vehicle' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictureImage', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]),
  )
  async post(
    @UploadedFiles() files: { pictureImage?: Express.Multer.File[]; document?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() vehicleDTO: VehicleCreateDTO,
  ): Promise<VehicleDTO> {
    const created = await this.vehicleService.createWithFiles(
      { pictureImage: files?.pictureImage?.[0], document: files?.document?.[0] },
      vehicleDTO,
      req.user,
      +req.query.contractID,
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
    return created;
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Update vehicle with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleDTO,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictureImage', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]),
  )
  async putId(
    @UploadedFiles() files: { pictureImage?: Express.Multer.File[]; document?: Express.Multer.File[] },
    @Req() req: Request,
    @Param('id') id: number,
    @Body() vehicleDTO: VehicleDTO,
  ): Promise<VehicleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Vehicle', id);
    return await this.vehicleService.updateByIdWithFiles(
      { pictureImage: files?.pictureImage?.[0], document: files?.document?.[0] },
      id,
      vehicleDTO as any,
      `${req.user?.id}`,
    );
  }




  @Put('/:id/updateStatus/:newStatus')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT,
  )
  @ApiOperation({ title: 'Update vehicle status with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleDTO,
  })
  async updateVehicleStatusById(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('newStatus') newStatus: VehicleStatus,
    @Body() reason: VehicleStatusChangeBodyDTO
  ): Promise<VehicleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Vehicle', id);
    return await this.vehicleService.updateVehicleStatusById(
      +id,
      VehicleStatus[newStatus],
      req.user,
      reason
    );
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Delete vehicle' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Vehicle', id);
    return await this.vehicleService.deleteById(id);
  }
}
