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
    UploadedFiles,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ConfigDTO } from '../../service/dto/config.dto';
import { ConfigCreateOrUpdateDTO } from '../../service/dto/config-create-or-update.dto';
import { ConfigService } from '../../service/config.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, BypassAuth, ContractGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('v2/configs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('configs')
export class ConfigController {
    logger = new Logger('ConfigController');

    constructor(private readonly configService: ConfigService) { }


    @Get('/companies/:id')
    @BypassAuth()
    @ApiResponse({ status: 200, description: 'List all records', type: ConfigDTO, })
    async getByCompany(@Req() req: Request): Promise<ConfigDTO[]> {
        const { id } = req.params;
        const companyConfigs = await this.configService.findByCompany(+id);
        HeaderUtil.addConfigsUpdatedAtHeader(req.res, companyConfigs.updated_at);
        return companyConfigs;
    }

    @Get('/contracts/:id')
    @BypassAuth()
    @ApiResponse({ status: 200, description: 'List all records', type: ConfigDTO, })
    async getByContract(@Req() req: Request): Promise<ConfigDTO[]> {
        const { id } = req.params;
        const contractConfigs = await this.configService.findByContract(+id);
        HeaderUtil.addConfigsUpdatedAtHeader(req.res, contractConfigs.updated_at);
        return contractConfigs;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create or Update config' })
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
    async createOrUpdateMultiple(@Req() req: Request, @Body() configDTO: ConfigCreateOrUpdateDTO): Promise<any> {
        return await this.configService.createOrUpdateMultiple(configDTO, `${req.user?.id}`);
    }

    @Put('/files')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update config files with contract id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @UseGuards(ContractGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'terms_of_use.file_url', maxCount: 1 },
            { name: 'layout.logo', maxCount: 1 },
            { name: 'layout.location_images.HOTSPOT', maxCount: 1 },
            { name: 'layout.location_images.INFO_POINT', maxCount: 1 },
            { name: 'layout.location_images.GROUPER', maxCount: 1 },
        ]),
    )
    async updateConfigFiles(
        @Req() req: Request,
        @UploadedFiles() files: { [key in string] ?: Express.Multer.File; },
        @Query('contractID') contractID,
    ): Promise<ConfigDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Setting', 'setting terms of use');
        return await this.configService.updateConfigFiles(contractID, files, `${req.user?.id}`);
  }

    // @Get('/')
    // @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    // @ApiResponse({ status: 200, description: 'List all records', type: ConfigDTO, })
    // async getAll(@Req() req: Request): Promise<ConfigDTO[]> {
    //     const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    //     const [results, count] = await this.configService.findAndCount({
    //         skip: +pageRequest.page * pageRequest.size,
    //         take: +pageRequest.size,
    //         order: pageRequest.sort.asOrder(),
    //     });
    //     HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    //     return results;
    // }

    // @Get('/:id')
    // @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    // @ApiResponse({ status: 200, description: 'The found record', type: ConfigDTO, })
    // async getOne(@Param('id') id: number): Promise<ConfigDTO> {
    //     return await this.configService.findById(id);
    // }

    // @PostMethod('/')
    // @Roles(RoleType.ADMINISTRATOR)
    // @ApiOperation({ title: 'Create config' })
    // @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: ConfigDTO, })
    // @ApiResponse({ status: 403, description: 'Forbidden.' })
    // async post(@Req() req: Request, @Body() configDTO: ConfigDTO): Promise<ConfigDTO> {
    //     const created = await this.configService.save(configDTO, `${req.user?.id}`);
    //     HeaderUtil.addEntityCreatedHeaders(req.res, 'Config', created.id);
    //     return created;
    // }

    // @Put('/')
    // @Roles(RoleType.ADMINISTRATOR)
    // @ApiOperation({ title: 'Update config' })
    // @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ConfigDTO, })
    // async put(@Req() req: Request, @Body() configDTO: ConfigDTO): Promise<ConfigDTO> {
    //     HeaderUtil.addEntityCreatedHeaders(req.res, 'Config', configDTO.id);
    //     return await this.configService.update(configDTO, `${req.user?.id}`);
    // }

    // @Put('/:id')
    // @Roles(RoleType.ADMINISTRATOR)
    // @ApiOperation({ title: 'Update config with id' })
    // @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ConfigDTO, })
    // async putId(@Req() req: Request, @Body() configDTO: ConfigDTO): Promise<ConfigDTO> {
    //     HeaderUtil.addEntityCreatedHeaders(req.res, 'Config', configDTO.id);
    //     return await this.configService.update(configDTO, `${req.user?.id}`);
    // }

    // @Delete('/:id')
    // @Roles(RoleType.ADMINISTRATOR)
    // @ApiOperation({ title: 'Delete config' })
    // @ApiResponse({ status: 204, description: 'The record has been successfully deleted.', })
    // async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    //     HeaderUtil.addEntityDeletedHeaders(req.res, 'Config', id);
    //     return await this.configService.deleteById(id);
    // }
}
