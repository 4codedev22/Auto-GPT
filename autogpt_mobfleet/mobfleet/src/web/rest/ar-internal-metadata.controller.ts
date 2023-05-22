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
import { ArInternalMetadataDTO } from '../../service/dto/ar-internal-metadata.dto';
import { ArInternalMetadataService } from '../../service/ar-internal-metadata.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/ar-internal-metadata')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('ar-internal-metadata')
export class ArInternalMetadataController {
    logger = new Logger('ArInternalMetadataController');

    constructor(private readonly arInternalMetadataService: ArInternalMetadataService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ArInternalMetadataDTO,
    })
    async getAll(@Req() req: Request): Promise<ArInternalMetadataDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.arInternalMetadataService.findAndCount({
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
        type: ArInternalMetadataDTO,
    })
    async getOne(@Param('id') id: number): Promise<ArInternalMetadataDTO> {
        return await this.arInternalMetadataService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create arInternalMetadata' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ArInternalMetadataDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() arInternalMetadataDTO: ArInternalMetadataDTO,
    ): Promise<ArInternalMetadataDTO> {
        const created = await this.arInternalMetadataService.save(arInternalMetadataDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ArInternalMetadata', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update arInternalMetadata' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ArInternalMetadataDTO,
    })
    async put(
        @Req() req: Request,
        @Body() arInternalMetadataDTO: ArInternalMetadataDTO,
    ): Promise<ArInternalMetadataDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ArInternalMetadata', arInternalMetadataDTO.id);
        return await this.arInternalMetadataService.update(arInternalMetadataDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update arInternalMetadata with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ArInternalMetadataDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() arInternalMetadataDTO: ArInternalMetadataDTO,
    ): Promise<ArInternalMetadataDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ArInternalMetadata', arInternalMetadataDTO.id);
        return await this.arInternalMetadataService.update(arInternalMetadataDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete arInternalMetadata' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ArInternalMetadata', id);
        return await this.arInternalMetadataService.deleteById(id);
    }
}
