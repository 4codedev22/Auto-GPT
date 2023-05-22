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
import { ChecklistDTO } from '../../service/dto/checklist.dto';
import { ChecklistService } from '../../service/checklist.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { CheckListReportFilterDTO } from '../../service/dto/checklist-report.filter.dto';

@Controller('v2/checklists')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('checklists')
export class ChecklistController {
    logger = new Logger('ChecklistController');

    constructor(private readonly checklistService: ChecklistService) { }

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ChecklistDTO,
    })
    async getAll(@Req() req: Request): Promise<ChecklistDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page ?? 0,
            req.query.size ?? 0,
            req.query.sort ?? 'id,DESC',
          );
        const [results, count] = await this.checklistService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
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
    async createReport(@Req() req: Request, @Query('contractID') contractID: number, @Query() filter: CheckListReportFilterDTO): Promise<void> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page ?? 0,
            req.query.size ?? 0,
            req.query.sort ?? 'checklist.id,DESC',
        );
        await this.checklistService.report(
            {
                order: pageRequest.sort.asOrder(),
            },
            +req.query.contractID,
            filter,
            req.user
        );
    }

    @Get('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: ChecklistDTO,
    })
    async getOne(@Param('id') id: number): Promise<ChecklistDTO> {
        return await this.checklistService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create checklist' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ChecklistDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() checklistDTO: ChecklistDTO): Promise<ChecklistDTO> {
        const created = await this.checklistService.save(checklistDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Checklist', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update checklist' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ChecklistDTO,
    })
    async put(@Req() req: Request, @Body() checklistDTO: ChecklistDTO): Promise<ChecklistDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Checklist', checklistDTO.id);
        return await this.checklistService.update(checklistDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update checklist with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ChecklistDTO,
    })
    async putId(@Req() req: Request, @Body() checklistDTO: ChecklistDTO): Promise<ChecklistDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Checklist', checklistDTO.id);
        return await this.checklistService.update(checklistDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete checklist' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Checklist', id);
        return await this.checklistService.deleteById(id);
    }
}
