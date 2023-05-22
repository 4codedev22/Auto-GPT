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
import { SmsTokenDTO } from '../../service/dto/sms-token.dto';
import { SmsTokenService } from '../../service/sms-token.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/sms-tokens')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('sms-tokens')
export class SmsTokenController {
    logger = new Logger('SmsTokenController');

    constructor(private readonly smsTokenService: SmsTokenService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: SmsTokenDTO,
    })
    async getAll(@Req() req: Request): Promise<SmsTokenDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.smsTokenService.findAndCount({
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
        type: SmsTokenDTO,
    })
    async getOne(@Param('id') id: number): Promise<SmsTokenDTO> {
        return await this.smsTokenService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create smsToken' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: SmsTokenDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() smsTokenDTO: SmsTokenDTO): Promise<SmsTokenDTO> {
        const created = await this.smsTokenService.save(smsTokenDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'SmsToken', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update smsToken' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: SmsTokenDTO,
    })
    async put(@Req() req: Request, @Body() smsTokenDTO: SmsTokenDTO): Promise<SmsTokenDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'SmsToken', smsTokenDTO.id);
        return await this.smsTokenService.update(smsTokenDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update smsToken with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: SmsTokenDTO,
    })
    async putId(@Req() req: Request, @Body() smsTokenDTO: SmsTokenDTO): Promise<SmsTokenDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'SmsToken', smsTokenDTO.id);
        return await this.smsTokenService.update(smsTokenDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete smsToken' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'SmsToken', id);
        return await this.smsTokenService.deleteById(id);
    }
}
