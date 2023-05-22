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
import { MaintenanceDTO } from '../../service/dto/maintenance.dto';
import { MaintenanceService } from '../../service/maintenance.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/maintenances')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('maintenances')
export class MaintenanceController {
    logger = new Logger('MaintenanceController');

    constructor(private readonly maintenanceService: MaintenanceService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: MaintenanceDTO,
    })
    async getAll(@Req() req: Request): Promise<MaintenanceDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.maintenanceService.findAndCount({
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
        type: MaintenanceDTO,
    })
    async getOne(@Param('id') id: number): Promise<MaintenanceDTO> {
        return await this.maintenanceService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create maintenance' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: MaintenanceDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() maintenanceDTO: MaintenanceDTO): Promise<MaintenanceDTO> {
        const created = await this.maintenanceService.save(maintenanceDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Maintenance', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update maintenance' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MaintenanceDTO,
    })
    async put(@Req() req: Request, @Body() maintenanceDTO: MaintenanceDTO): Promise<MaintenanceDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Maintenance', maintenanceDTO.id);
        return await this.maintenanceService.update(maintenanceDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update maintenance with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MaintenanceDTO,
    })
    async putId(@Req() req: Request, @Body() maintenanceDTO: MaintenanceDTO): Promise<MaintenanceDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Maintenance', maintenanceDTO.id);
        return await this.maintenanceService.update(maintenanceDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete maintenance' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Maintenance', id);
        return await this.maintenanceService.deleteById(id);
    }
}
