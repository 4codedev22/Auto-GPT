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
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { VehicleGroupDTO } from '../../service/dto/vehicle-group.dto';
import { VehicleGroupService } from '../../service/vehicle-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { VehicleGroupCreateDTO } from '../../service/dto/vehicle-group-create.dto';
import { Contract } from '../../domain/contract.entity';

@Controller('v2/vehicle-groups')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('vehicle-groups')
export class VehicleGroupController {
  logger = new Logger('VehicleGroupController');

  constructor(private readonly vehicleGroupService: VehicleGroupService) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleGroupDTO,
  })
  async getAll(@Req() req: Request): Promise<VehicleGroupDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'vehicleGroup.id,DESC',
      req.query.search,
      req.query.filter,
      req.query.contractID,
    );
    const [results, count] = await this.vehicleGroupService.findAndCount(
      {
        skip: pageRequest.skip,
        take: pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +pageRequest.contractID,
      pageRequest.search,
      pageRequest.filter,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleGroupDTO,
  })
  async getOne(@Param('id') id: number): Promise<VehicleGroupDTO> {
    return await this.vehicleGroupService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Create vehicleGroup' })
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleGroupDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() vehicleGroupDTO: VehicleGroupCreateDTO): Promise<VehicleGroupDTO> {
    const created = await this.vehicleGroupService.create(vehicleGroupDTO, req.user, +req.query.contractID);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleGroup', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update vehicleGroup' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleGroupDTO,
  })
  async put(@Req() req: Request, @Body() vehicleGroupDTO: VehicleGroupDTO): Promise<VehicleGroupDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleGroup', vehicleGroupDTO.id);
    return await this.vehicleGroupService.update(vehicleGroupDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update vehicleGroup with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleGroupDTO,
  })
  async putId(@Req() req: Request, @Body() vehicleGroupDTO: VehicleGroupDTO): Promise<VehicleGroupDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleGroup', vehicleGroupDTO.id);
    return await this.vehicleGroupService.update(vehicleGroupDTO, `${req.user?.id}`);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Delete vehicleGroup' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'VehicleGroup', id);
    return await this.vehicleGroupService.deleteById(id);
  }
}
