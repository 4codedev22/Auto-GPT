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
import { LocationDTO } from '../../service/dto/location.dto';
import { LocationService } from '../../service/location.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { LocationOpeningHoursDTO } from '../../service/dto/location-opening-hours.dto';

@Controller('v2/locations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('locations')
export class LocationController {
    logger = new Logger('LocationController');

    constructor(private readonly locationService: LocationService) { }

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
    @UseGuards(ContractGuard)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: LocationDTO,
    })
    async getAll(@Req() req: Request): Promise<LocationDTO[]> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page,
            req.query.size,
            req.query.sort ?? 'location.id,DESC',
            req.query.search,
            req.query.filter,
            req.query.contractID,
        );
        const [results, count] = await this.locationService.findAndCount(
            {
                skip: pageRequest.skip,
                take: pageRequest.size,
                order: pageRequest.sort.asOrder(),
            },
            pageRequest.search,
            pageRequest.filter,
            pageRequest.contractID,
        );
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: LocationDTO,
    })
    async getOne(@Param('id') id: number): Promise<LocationDTO> {
        return await this.locationService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
    @UseGuards(ContractGuard)
    @ApiOperation({ title: 'Create location' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: LocationDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() locationDTO: LocationDTO): Promise<LocationDTO> {
        const created = await this.locationService.save(locationDTO, +req.query.contractID, req.user);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', created.id);
        return created;
    }

    @Put('/updateOpeningHours/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
    @UseGuards(ContractGuard)
    @ApiOperation({ title: 'Create location' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: LocationDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async updateOpeningHours(
        @Req() req: Request,
        @Body() locationDTO: LocationOpeningHoursDTO,
        @Param('id') id: number,
    ): Promise<LocationDTO> {
        const created = await this.locationService.updateOpeningHours(id, locationDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', created.id);
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
    async createReport(@Req() req: Request): Promise<void> {
        const pageRequest: PageRequest = new PageRequest(
            req.query.page ?? 0,
            req.query.size ?? 0,
            req.query.sort ?? 'location.id,DESC',
        );
        await this.locationService.report(
            {
                order: pageRequest.sort.asOrder(),
            },
            +req.query.contractID,
            req.user
        );
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
    @ApiOperation({ title: 'Update location' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: LocationDTO,
    })
    async put(@Req() req: Request, @Body() locationDTO: LocationDTO): Promise<LocationDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', locationDTO.id);
        return await this.locationService.update(locationDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
    @ApiOperation({ title: 'Update location with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: LocationDTO,
    })
    async putId(@Req() req: Request, @Body() locationDTO: LocationDTO, @Param('id') id: number): Promise<LocationDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', locationDTO.id);
        return await this.locationService.updateById(+id, locationDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
    @ApiOperation({ title: 'Delete location' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Location', id);
        return await this.locationService.deleteById(id);
    }

    @Get('/:lat/:lon')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
    @UseGuards(ContractGuard)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: LocationDTO,
    })
    async getOneByLatLon(@Req() req: Request, @Param('lat') lat: number, @Param('lon') lon: number): Promise<LocationDTO> {
        return await this.locationService.findLocationByLatLon(lat, lon, +req.query.contractID);
    }


    @Get('/searchAddress/:search/:sessionToken')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: LocationDTO,
    })
    async searchAddres(@Param('search') search: string, @Param('sessionToken') sessionToken: string): Promise<any> {
        return await this.locationService.searchAddress(search, sessionToken);
    }
}
