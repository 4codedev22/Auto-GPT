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
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AlertDTO } from '../../service/dto/alert.dto';
import { AlertService } from '../../service/alert.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType, ALL_ROLES } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { AlertReportFilterDTO } from '../../service/dto/alert-report.filter.dto';
import { AlertFilterDTO } from '../../service/dto/alert-filter.dto';

@Controller('v2/alerts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('alerts')
export class AlertController {
    logger = new Logger('AlertController');

    constructor(private readonly alertService: AlertService) { }

    @Get('/')
    @Roles(...ALL_ROLES)
    @ApiResponse({
        status: 200,
        description: 'List all records by vehicleIdentifier',
        type: AlertDTO,
    })
    async getAll(@Req() req: Request, @Query() filter: AlertFilterDTO): Promise<AlertDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page,
            req.query.size,
            `${req.query.sort ?? 'id,ASC'}`
        );
        const [results, count] = await this.alertService.findAndCount({
                skip: +pageRequest.page * pageRequest.size,
                take: +pageRequest.size,
                order: pageRequest.sort.asOrder(),
            },
            filter
        );
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(...ALL_ROLES)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: AlertDTO,
    })
    async getOne(@Param('id') id: number): Promise<AlertDTO> {
        return await this.alertService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create alert' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AlertDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() alertDTO: AlertDTO): Promise<AlertDTO> {
        const created = await this.alertService.save(alertDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Alert', created.id);
        return created;
    }



    @PostMethod('/report')
    @Roles(
        ...N2_AND_HIGHER
    )
    @UseGuards(ContractGuard)
    @ApiResponse({
        status: 200,
        description: 'Create Report',
    })
    async createReport(@Req() req: Request, @Query('contractID') contractID: number, @Query() filter: AlertReportFilterDTO): Promise<void> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page ?? 0,
            req.query.size ?? 0,
            req.query.sort ?? 'alert.id,DESC',
        );
        await this.alertService.report(
            {
                order: pageRequest.sort.asOrder(),
            },
            +req.query.contractID,
            filter,
            req.user
        );
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update alert' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AlertDTO,
    })
    async put(@Req() req: Request, @Body() alertDTO: AlertDTO): Promise<AlertDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Alert', alertDTO.id);
        return await this.alertService.update(alertDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update alert with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AlertDTO,
    })
    async putId(@Req() req: Request, @Param('id') id: number,@Body() alertDTO: AlertDTO): Promise<AlertDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Alert', alertDTO.id);
        return await this.alertService.updateById(id, alertDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete alert' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Alert', id);
        return await this.alertService.deleteById(id);
    }
}
