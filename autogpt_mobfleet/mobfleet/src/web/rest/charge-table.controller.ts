import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChargeTableDTO } from '../../service/dto/charge-table.dto';
import { ChargeTableService } from '../../service/charge-table.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, ContractGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChargeTableFilterDTO } from '../../service/dto/charge-table-filter.dto';


@Controller('v2/charge-tables')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('charge-tables')
export class ChargeTableController {
  logger = new Logger('ChargeTableController');

  constructor(private readonly chargeTableService: ChargeTableService) { }


  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChargeTableDTO,
  })
  async getAll(@Req() req: Request, @Query() query: ChargeTableFilterDTO): Promise<ChargeTableDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      query.page,
      query.size,
      query.sort ?? 'id,DESC',
    );

    const [results, count] = await this.chargeTableService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        sort: pageRequest.sort
      },
      query
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));

    return results;
  }


  @Get('/active/vehicle-group/:groupId')
  @UseGuards(ContractGuard)
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({ status: 200, description: 'Get current active charge table for the vehicle group', type: ChargeTableDTO, })
  async getActiveTableForGroup(@Param('groupId') groupId: number, @Req() req: Request): Promise<ChargeTableDTO> {
    this.logger.log(groupId);
    const now = new Date();
    return this.chargeTableService.find(+req.query.contractID, groupId, now);
  }

  @Get('/actives')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all active records',
    type: ChargeTableDTO,
  })
  async getAllActive(@Req() req: Request): Promise<ChargeTableDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,DESC');

    const [results, count] = await this.chargeTableService.findManyActive({
      contractID: +req.query.contractID,
      vehicleGroupId: +req.query.vehicleGroupId,
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      sort: pageRequest.sort
    });

    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/existsOther')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Update chargeTable' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChargeTableDTO,
  })
  async existsOther(@Req() req: Request, @Query() chargeTableDTO: Partial<Pick<ChargeTableDTO, 'contract' | 'vehicleGroup' | 'startAt' | 'endAt' | 'id'>>): Promise<ChargeTableDTO> {
    return await this.chargeTableService.getOneByContractVehicleGroupAndPeriod(chargeTableDTO);
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChargeTableDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChargeTableDTO> {
    return await this.chargeTableService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Create chargeTable' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChargeTableDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() chargeTableDTO: ChargeTableDTO): Promise<ChargeTableDTO> {
    const created = await this.chargeTableService.save(chargeTableDTO, `${req.user?.id}`);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChargeTable', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Update chargeTable' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChargeTableDTO,
  })
  async put(@Req() req: Request, @Body() chargeTableDTO: ChargeTableDTO): Promise<ChargeTableDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChargeTable', chargeTableDTO.id);
    return await this.chargeTableService.update(chargeTableDTO, `${req.user?.id}`);
  }


  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Update chargeTable with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChargeTableDTO,
  })
  async putId(@Req() req: Request, @Body() chargeTableDTO: ChargeTableDTO): Promise<ChargeTableDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChargeTable', chargeTableDTO.id);
    return await this.chargeTableService.update(chargeTableDTO, `${req.user?.id}`);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Delete chargeTable' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChargeTable', id);
    return await this.chargeTableService.deleteById(id);
  }
}
