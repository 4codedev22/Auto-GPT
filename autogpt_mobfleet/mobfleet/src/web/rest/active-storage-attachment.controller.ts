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
import { ActiveStorageAttachmentDTO } from '../../service/dto/active-storage-attachment.dto';
import { ActiveStorageAttachmentService } from '../../service/active-storage-attachment.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/active-storage-attachments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('active-storage-attachments')
export class ActiveStorageAttachmentController {
    logger = new Logger('ActiveStorageAttachmentController');

    constructor(private readonly activeStorageAttachmentService: ActiveStorageAttachmentService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ActiveStorageAttachmentDTO,
    })
    async getAll(@Req() req: Request): Promise<ActiveStorageAttachmentDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.activeStorageAttachmentService.findAndCount({
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
        type: ActiveStorageAttachmentDTO,
    })
    async getOne(@Param('id') id: number): Promise<ActiveStorageAttachmentDTO> {
        return await this.activeStorageAttachmentService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create activeStorageAttachment' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ActiveStorageAttachmentDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() activeStorageAttachmentDTO: ActiveStorageAttachmentDTO,
    ): Promise<ActiveStorageAttachmentDTO> {
        const created = await this.activeStorageAttachmentService.save(activeStorageAttachmentDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageAttachment', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update activeStorageAttachment' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ActiveStorageAttachmentDTO,
    })
    async put(
        @Req() req: Request,
        @Body() activeStorageAttachmentDTO: ActiveStorageAttachmentDTO,
    ): Promise<ActiveStorageAttachmentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageAttachment', activeStorageAttachmentDTO.id);
        return await this.activeStorageAttachmentService.update(activeStorageAttachmentDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update activeStorageAttachment with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ActiveStorageAttachmentDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() activeStorageAttachmentDTO: ActiveStorageAttachmentDTO,
    ): Promise<ActiveStorageAttachmentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageAttachment', activeStorageAttachmentDTO.id);
        return await this.activeStorageAttachmentService.update(activeStorageAttachmentDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete activeStorageAttachment' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ActiveStorageAttachment', id);
        return await this.activeStorageAttachmentService.deleteById(id);
    }
}
