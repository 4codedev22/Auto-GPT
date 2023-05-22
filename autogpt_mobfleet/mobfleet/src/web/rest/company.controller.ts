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
    BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { AuthGuard, Roles, RolesGuard, RoleType, BypassAuth } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { CompanyService } from '../../service/company.service';
import { ContractService } from '../../service/contract.service';
import { CompanyDTO } from '../../service/dto/company.dto';

@Controller('v2/companies')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('companies')
export class CompanyController {
    logger = new Logger('CompanyController');

    constructor(
        private readonly companyService: CompanyService,
        private readonly contractService: ContractService) { }

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({ status: 200, description: 'List all records', type: CompanyDTO, })
    async getAll(@Req() req: Request): Promise<CompanyDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page,
            req.query.size,
            req.query.sort ?? 'company.id,DESC',
            req.query.search,
        );
        const [results, count] = await this.companyService.findAndCount(
            {
                skip: pageRequest.skip,
                take: pageRequest.size,
                order: pageRequest.sort.asOrder(),
            },
            pageRequest.search,
        );
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CompanyDTO,
    })
    async getOne(@Param('id') id: number): Promise<CompanyDTO> {
        return await this.companyService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create company' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: CompanyDTO, })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() companyDTO: CompanyDTO): Promise<CompanyDTO> {
        const created = await this.companyService.save(companyDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Company', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update company' })
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: CompanyDTO, })
    async put(@Req() req: Request, @Body() companyDTO: CompanyDTO): Promise<CompanyDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Company', companyDTO.id);
        return await this.companyService.update(companyDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update company with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CompanyDTO,
    })
    async putId(@Req() req: Request, @Body() companyDTO: CompanyDTO): Promise<CompanyDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Company', companyDTO.id);
        return await this.companyService.update(companyDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete company' })
    @ApiResponse({ status: 204, description: 'The record has been successfully deleted.', })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Company', id);
        return await this.companyService.deleteById(id);
    }


    @BypassAuth()
    @Get('/:id/contracts')
    @ApiOperation({ title: 'List contracts for register through app' })
    @ApiResponse({ status: 200, description: 'List of contracts', })
    async listContractsForAppRegister(@Req() req: Request,): Promise<any> {
        const { id } = req.params;
        if (!id) throw new BadRequestException('Company id is required');

        return this.companyService.getContracts(+id);
    }

}
