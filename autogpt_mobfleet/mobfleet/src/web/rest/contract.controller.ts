import {
    Body,
    ClassSerializerInterceptor,
    Controller,
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
import { ContractDTO } from '../../service/dto/contract.dto';
import { ContractService } from '../../service/contract.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractCreateDTO } from '../../service/dto/contract-create.dto';
import { ContractCreateWithCompanyAndVehicleGroupsDTO } from '../../service/dto/contract-create-with-company-and-vehicle-groups.dto';
import { ContractFilterDTO } from '../../service/dto/contract-filter.dto';

@Controller('v2/contracts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('contracts')
export class ContractController {
    logger = new Logger('ContractController');

    constructor(private readonly contractService: ContractService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
    @ApiResponse({
        status: 200,
        description: 'List all my records',
        type: ContractDTO,
    })
    async getAll(@Req() req: Request, @Query() query: ContractFilterDTO): Promise<ContractDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            query.page,
            query.size,
            query.sort ?? 'contract.id,DESC',
            query.search,
        );
        const [results, count] = await this.contractService.findAndCountByAccount(
            {
                skip: pageRequest.skip,
                take: pageRequest.size,
                order: pageRequest.sort.asOrder(),
            },
            req.user,
            query,
        );
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }
 
    @Get('/actives')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
    @ApiResponse({
        status: 200,
        description: 'List all my records',
        type: ContractDTO,
    })
    async getAllActive(@Req() req: Request): Promise<ContractDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page,
            req.query.size,
            req.query.sort ?? 'contract.id,DESC',
            req.query.search,
        );
        const [results, count] = await this.contractService.findAndCountByAccountActive(
            {
                skip: +pageRequest.page * pageRequest.size,
                take: +pageRequest.size,
                order: pageRequest.sort.asOrder(),
            },
            req.user,
            pageRequest.search,
        );
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: ContractDTO,
    })
    async getOne(@Req() req: Request, @Param('id') id: number): Promise<ContractDTO> {
        return await this.contractService.findById(id, req.user);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create contract' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ContractDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() contractDTO: ContractCreateDTO): Promise<ContractDTO> {
        const created = await this.contractService.create(contractDTO, req.user);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Contract', created.id);
        return created;
    }


    @PostMethod('/withCompanyAndVehicleGroups')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create contract' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ContractDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async postWithCompanyAndVehicleGroups(@Req() req: Request, @Body() contractDTO: ContractCreateWithCompanyAndVehicleGroupsDTO): Promise<ContractDTO> {
        const created = await this.contractService.createWithCompanyAndVehicleGroups(contractDTO, req.user);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Contract', created.id);
        return created;
    }

    @Put('/withCompanyAndVehicleGroups/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create contract' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ContractDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async putWithCompanyAndVehicleGroupsByID(@Req() req: Request, @Body() contractDTO: ContractCreateWithCompanyAndVehicleGroupsDTO, @Param('id') contractID: number): Promise<ContractDTO> {
        const created = await this.contractService.updateWithCompanyAndVehicleGroups(+contractID, contractDTO, req.user);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Contract', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update contract' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ContractDTO,
    })
    async put(@Req() req: Request, @Body() contractDTO: ContractDTO): Promise<ContractDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Contract', contractDTO.id);
        return await this.contractService.update(contractDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update contract with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ContractDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() contractDTO: ContractCreateDTO,
        @Param('id') id: number,
    ): Promise<ContractDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Contract', contractDTO.id);
        return await this.contractService.updateById(id, contractDTO, req.user);
    }
}
