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
import { ActiveStorageBlobDTO } from '../../service/dto/active-storage-blob.dto';
import { ActiveStorageBlobService } from '../../service/active-storage-blob.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/active-storage-blobs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('active-storage-blobs')
export class ActiveStorageBlobController {
    logger = new Logger('ActiveStorageBlobController');

    constructor(private readonly activeStorageBlobService: ActiveStorageBlobService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ActiveStorageBlobDTO,
    })
    async getAll(@Req() req: Request): Promise<ActiveStorageBlobDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.activeStorageBlobService.findAndCount({
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
        type: ActiveStorageBlobDTO,
    })
    async getOne(@Param('id') id: number): Promise<ActiveStorageBlobDTO> {
        return await this.activeStorageBlobService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create activeStorageBlob' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ActiveStorageBlobDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() activeStorageBlobDTO: ActiveStorageBlobDTO): Promise<ActiveStorageBlobDTO> {
        const created = await this.activeStorageBlobService.save(activeStorageBlobDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageBlob', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update activeStorageBlob' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ActiveStorageBlobDTO,
    })
    async put(@Req() req: Request, @Body() activeStorageBlobDTO: ActiveStorageBlobDTO): Promise<ActiveStorageBlobDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageBlob', activeStorageBlobDTO.id);
        return await this.activeStorageBlobService.update(activeStorageBlobDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update activeStorageBlob with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ActiveStorageBlobDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() activeStorageBlobDTO: ActiveStorageBlobDTO,
    ): Promise<ActiveStorageBlobDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ActiveStorageBlob', activeStorageBlobDTO.id);
        return await this.activeStorageBlobService.update(activeStorageBlobDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete activeStorageBlob' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ActiveStorageBlob', id);
        return await this.activeStorageBlobService.deleteById(id);
    }
}
