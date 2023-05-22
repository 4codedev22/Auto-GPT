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
import { VehicleManufacturerDTO } from '../../service/dto/vehicle-manufacturer.dto';
import { VehicleManufacturerService } from '../../service/vehicle-manufacturer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/vehicle-manufacturers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('vehicle-manufacturers')
export class VehicleManufacturerController {
  logger = new Logger('VehicleManufacturerController');

  constructor(private readonly vehicleManufacturerService: VehicleManufacturerService) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleManufacturerDTO,
  })
  async getAll(@Req() req: Request): Promise<VehicleManufacturerDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,DESC');
    const [results, count] = await this.vehicleManufacturerService.findAndCount({
      skip: pageRequest.skip,
      take: pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleManufacturerDTO,
  })
  async getOne(@Param('id') id: number): Promise<VehicleManufacturerDTO> {
    return await this.vehicleManufacturerService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Create vehicleManufacturer' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleManufacturerDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(
    @Req() req: Request,
    @Body() vehicleManufacturerDTO: VehicleManufacturerDTO,
  ): Promise<VehicleManufacturerDTO> {
    const created = await this.vehicleManufacturerService.save(vehicleManufacturerDTO, `${req.user?.id}`);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleManufacturer', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update vehicleManufacturer' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleManufacturerDTO,
  })
  async put(
    @Req() req: Request,
    @Body() vehicleManufacturerDTO: VehicleManufacturerDTO,
  ): Promise<VehicleManufacturerDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleManufacturer', vehicleManufacturerDTO.id);
    return await this.vehicleManufacturerService.update(vehicleManufacturerDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update vehicleManufacturer with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleManufacturerDTO,
  })
  async putId(
    @Req() req: Request,
    @Body() vehicleManufacturerDTO: VehicleManufacturerDTO,
  ): Promise<VehicleManufacturerDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleManufacturer', vehicleManufacturerDTO.id);
    return await this.vehicleManufacturerService.update(vehicleManufacturerDTO, `${req.user?.id}`);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Delete vehicleManufacturer' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'VehicleManufacturer', id);
    return await this.vehicleManufacturerService.deleteById(id);
  }
}
