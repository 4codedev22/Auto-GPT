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
import { NotificationAccountDTO } from '../../service/dto/notification-account.dto';
import { NotificationAccountService } from '../../service/notification-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/notification-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('notification-accounts')
export class NotificationAccountController {
    logger = new Logger('NotificationAccountController');

    constructor(private readonly notificationAccountService: NotificationAccountService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: NotificationAccountDTO,
    })
    async getAll(@Req() req: Request): Promise<NotificationAccountDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.notificationAccountService.findAndCount({
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
        type: NotificationAccountDTO,
    })
    async getOne(@Param('id') id: number): Promise<NotificationAccountDTO> {
        return await this.notificationAccountService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create notificationAccount' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: NotificationAccountDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() notificationAccountDTO: NotificationAccountDTO,
    ): Promise<NotificationAccountDTO> {
        const created = await this.notificationAccountService.save(notificationAccountDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'NotificationAccount', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update notificationAccount' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: NotificationAccountDTO,
    })
    async put(
        @Req() req: Request,
        @Body() notificationAccountDTO: NotificationAccountDTO,
    ): Promise<NotificationAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'NotificationAccount', notificationAccountDTO.id);
        return await this.notificationAccountService.update(notificationAccountDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update notificationAccount with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: NotificationAccountDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() notificationAccountDTO: NotificationAccountDTO,
    ): Promise<NotificationAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'NotificationAccount', notificationAccountDTO.id);
        return await this.notificationAccountService.update(notificationAccountDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete notificationAccount' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'NotificationAccount', id);
        return await this.notificationAccountService.deleteById(id);
    }
}
