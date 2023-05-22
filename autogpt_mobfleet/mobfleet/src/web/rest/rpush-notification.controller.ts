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
import { RpushNotificationDTO } from '../../service/dto/rpush-notification.dto';
import { RpushNotificationService } from '../../service/rpush-notification.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/rpush-notifications')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('rpush-notifications')
export class RpushNotificationController {
    logger = new Logger('RpushNotificationController');

    constructor(private readonly rpushNotificationService: RpushNotificationService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: RpushNotificationDTO,
    })
    async getAll(@Req() req: Request): Promise<RpushNotificationDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.rpushNotificationService.findAndCount({
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
        type: RpushNotificationDTO,
    })
    async getOne(@Param('id') id: number): Promise<RpushNotificationDTO> {
        return await this.rpushNotificationService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create rpushNotification' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RpushNotificationDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() rpushNotificationDTO: RpushNotificationDTO): Promise<RpushNotificationDTO> {
        const created = await this.rpushNotificationService.save(rpushNotificationDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushNotification', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushNotification' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushNotificationDTO,
    })
    async put(@Req() req: Request, @Body() rpushNotificationDTO: RpushNotificationDTO): Promise<RpushNotificationDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushNotification', rpushNotificationDTO.id);
        return await this.rpushNotificationService.update(rpushNotificationDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushNotification with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushNotificationDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() rpushNotificationDTO: RpushNotificationDTO,
    ): Promise<RpushNotificationDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushNotification', rpushNotificationDTO.id);
        return await this.rpushNotificationService.update(rpushNotificationDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete rpushNotification' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'RpushNotification', id);
        return await this.rpushNotificationService.deleteById(id);
    }
}
