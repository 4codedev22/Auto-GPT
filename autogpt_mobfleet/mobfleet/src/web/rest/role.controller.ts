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
import { RoleDTO } from '../../service/dto/role.dto';
import { RoleService } from '../../service/role.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/roles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('roles')
export class RoleController {
    logger = new Logger('RoleController');

    constructor(private readonly roleService: RoleService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: RoleDTO,
    })
    async getAll(@Req() req: Request): Promise<RoleDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.roleService.findAndCount({
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
        type: RoleDTO,
    })
    async getOne(@Param('id') id: number): Promise<RoleDTO> {
        return await this.roleService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create role' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RoleDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() roleDTO: RoleDTO): Promise<RoleDTO> {
        const created = await this.roleService.save(roleDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Role', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update role' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RoleDTO,
    })
    async put(@Req() req: Request, @Body() roleDTO: RoleDTO): Promise<RoleDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Role', roleDTO.id);
        return await this.roleService.update(roleDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update role with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RoleDTO,
    })
    async putId(@Req() req: Request, @Body() roleDTO: RoleDTO): Promise<RoleDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Role', roleDTO.id);
        return await this.roleService.update(roleDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete role' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Role', id);
        return await this.roleService.deleteById(id);
    }
}
