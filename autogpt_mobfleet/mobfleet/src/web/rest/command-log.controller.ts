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
import { CommandLogDTO } from '../../service/dto/command-log.dto';
import { CommandLogService } from '../../service/command-log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/command-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('command-logs')
export class CommandLogController {
    logger = new Logger('CommandLogController');

    constructor(private readonly commandLogService: CommandLogService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CommandLogDTO,
    })
    async getAll(@Req() req: Request): Promise<CommandLogDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.commandLogService.findAndCount({
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
        type: CommandLogDTO,
    })
    async getOne(@Param('id') id: number): Promise<CommandLogDTO> {
        return await this.commandLogService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create commandLog' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CommandLogDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() commandLogDTO: CommandLogDTO): Promise<CommandLogDTO> {
        const created = await this.commandLogService.save(commandLogDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CommandLog', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update commandLog' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CommandLogDTO,
    })
    async put(@Req() req: Request, @Body() commandLogDTO: CommandLogDTO): Promise<CommandLogDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CommandLog', commandLogDTO.id);
        return await this.commandLogService.update(commandLogDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update commandLog with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CommandLogDTO,
    })
    async putId(@Req() req: Request, @Body() commandLogDTO: CommandLogDTO): Promise<CommandLogDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CommandLog', commandLogDTO.id);
        return await this.commandLogService.update(commandLogDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete commandLog' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CommandLog', id);
        return await this.commandLogService.deleteById(id);
    }
}
