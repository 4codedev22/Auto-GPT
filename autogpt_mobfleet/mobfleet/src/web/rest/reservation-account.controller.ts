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
import { ReservationAccountDTO } from '../../service/dto/reservation-account.dto';
import { ReservationAccountService } from '../../service/reservation-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/reservation-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('reservation-accounts')
export class ReservationAccountController {
    logger = new Logger('ReservationAccountController');

    constructor(private readonly reservationAccountService: ReservationAccountService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ReservationAccountDTO,
    })
    async getAll(@Req() req: Request): Promise<ReservationAccountDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.reservationAccountService.findAndCount({
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
        type: ReservationAccountDTO,
    })
    async getOne(@Param('id') id: number): Promise<ReservationAccountDTO> {
        return await this.reservationAccountService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create reservationAccount' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ReservationAccountDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() reservationAccountDTO: ReservationAccountDTO,
    ): Promise<ReservationAccountDTO> {
        const created = await this.reservationAccountService.save(reservationAccountDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ReservationAccount', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update reservationAccount' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ReservationAccountDTO,
    })
    async put(
        @Req() req: Request,
        @Body() reservationAccountDTO: ReservationAccountDTO,
    ): Promise<ReservationAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ReservationAccount', reservationAccountDTO.id);
        return await this.reservationAccountService.update(reservationAccountDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update reservationAccount with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ReservationAccountDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() reservationAccountDTO: ReservationAccountDTO,
    ): Promise<ReservationAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'ReservationAccount', reservationAccountDTO.id);
        return await this.reservationAccountService.update(reservationAccountDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete reservationAccount' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'ReservationAccount', id);
        return await this.reservationAccountService.deleteById(id);
    }
}
