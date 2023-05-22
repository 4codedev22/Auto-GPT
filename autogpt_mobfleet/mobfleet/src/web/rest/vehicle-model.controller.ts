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
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { VehicleModelDTO } from '../../service/dto/vehicle-model.dto';
import { VehicleModelService } from '../../service/vehicle-model.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { VehicleModelCreateDTO } from '../../service/dto/vehicle-model-create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VehicleModelUpdateDTO } from '../../service/dto/vehicle-model-update.dto';

@Controller('v2/vehicle-models')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('vehicle-models')
export class VehicleModelController {
  logger = new Logger('VehicleModelController');

  constructor(private readonly vehicleModelService: VehicleModelService) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleModelDTO,
  })
  async getAllPaginated(@Req() req: Request): Promise<VehicleModelDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'vehicleModel.id,DESC',
      req.query.search,
      req.query.filter,
      req.query.contractID,
    );
    const [results, count] = await this.vehicleModelService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      pageRequest.search,
      pageRequest.filter,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }


  @Get('/all')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleModelDTO,
  })
  async getAll(): Promise<VehicleModelDTO[]> {
    return await this.vehicleModelService.findAll();
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleModelDTO,
  })
  async getOne(@Param('id') id: number): Promise<VehicleModelDTO> {
    return await this.vehicleModelService.findById(id);
  }


  @PostMethod('/')
  @ApiOperation({ title: 'Create account' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleModelDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER )
  @UseGuards(ContractGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos' },
    ]),
  )
  async post(
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() accountsDTO: VehicleModelCreateDTO,
  ): Promise<VehicleModelDTO> {
    const created = await this.vehicleModelService.createWithFiles(
      { photos: files?.photos },
      accountsDTO,
      +req.query.contractID,
      req.user
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
    return created;
  }


  @Put('/')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Update vehicleModel' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleModelDTO,
  })
  async put(@Req() req: Request, @Body() vehicleModelDTO: VehicleModelDTO): Promise<VehicleModelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleModel', vehicleModelDTO.id);
    return await this.vehicleModelService.update(vehicleModelDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @ApiOperation({ title: 'Update VehicleModel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleModelDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER )
  @UseGuards(ContractGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos' },
    ]),
  )
  async putById(
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() vehicleModelDTO: VehicleModelUpdateDTO,
    @Param('id') id: number
  ): Promise<VehicleModelDTO> {
    const created = await this.vehicleModelService.updateWithFiles(
      id,
      { photos: files?.photos },
      vehicleModelDTO,
      +req.query.contractID,
      req.user
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
    return created;
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR)
  @ApiOperation({ title: 'Delete vehicleModel' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'VehicleModel', id);
    return await this.vehicleModelService.deleteById(id);
  }
}
