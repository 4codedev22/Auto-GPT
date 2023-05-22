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
import { RpushAppDTO } from '../../service/dto/rpush-app.dto';
import { RpushAppService } from '../../service/rpush-app.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/rpush-apps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('rpush-apps')
export class RpushAppController {
    logger = new Logger('RpushAppController');

    constructor(private readonly rpushAppService: RpushAppService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: RpushAppDTO,
    })
    async getAll(@Req() req: Request): Promise<RpushAppDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.rpushAppService.findAndCount({
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
        type: RpushAppDTO,
    })
    async getOne(@Param('id') id: number): Promise<RpushAppDTO> {
        return await this.rpushAppService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create rpushApp' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RpushAppDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() rpushAppDTO: RpushAppDTO): Promise<RpushAppDTO> {
        const created = await this.rpushAppService.save(rpushAppDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushApp', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushApp' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushAppDTO,
    })
    async put(@Req() req: Request, @Body() rpushAppDTO: RpushAppDTO): Promise<RpushAppDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushApp', rpushAppDTO.id);
        return await this.rpushAppService.update(rpushAppDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushApp with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushAppDTO,
    })
    async putId(@Req() req: Request, @Body() rpushAppDTO: RpushAppDTO): Promise<RpushAppDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushApp', rpushAppDTO.id);
        return await this.rpushAppService.update(rpushAppDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete rpushApp' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'RpushApp', id);
        return await this.rpushAppService.deleteById(id);
    }
}
