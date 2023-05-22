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
import { VehicleStatusLogDTO } from '../../service/dto/vehicle-status-log.dto';
import { VehicleStatusLogService } from '../../service/vehicle-status-log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/vehicle-status-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('vehicle-status-logs')
export class VehicleStatusLogController {
    logger = new Logger('VehicleStatusLogController');

    constructor(private readonly vehicleStatusLogService: VehicleStatusLogService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: VehicleStatusLogDTO,
    })
    async getAll(@Req() req: Request): Promise<VehicleStatusLogDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.vehicleStatusLogService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
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
        type: VehicleStatusLogDTO,
    })
    async getOne(@Param('id') id: number): Promise<VehicleStatusLogDTO> {
        return await this.vehicleStatusLogService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create vehicleStatusLog' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: VehicleStatusLogDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() vehicleStatusLogDTO: VehicleStatusLogDTO): Promise<VehicleStatusLogDTO> {
        const created = await this.vehicleStatusLogService.save(vehicleStatusLogDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleStatusLog', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update vehicleStatusLog' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: VehicleStatusLogDTO,
    })
    async put(@Req() req: Request, @Body() vehicleStatusLogDTO: VehicleStatusLogDTO): Promise<VehicleStatusLogDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleStatusLog', vehicleStatusLogDTO.id);
        return await this.vehicleStatusLogService.update(vehicleStatusLogDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update vehicleStatusLog with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: VehicleStatusLogDTO,
    })
    async putId(@Req() req: Request, @Body() vehicleStatusLogDTO: VehicleStatusLogDTO): Promise<VehicleStatusLogDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'VehicleStatusLog', vehicleStatusLogDTO.id);
        return await this.vehicleStatusLogService.update(vehicleStatusLogDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete vehicleStatusLog' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'VehicleStatusLog', id);
        return await this.vehicleStatusLogService.deleteById(id);
    }
}
