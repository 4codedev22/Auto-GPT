import { Body, ClassSerializerInterceptor, Controller, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Query, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReservationDTO } from '../../service/dto/reservation.dto';
import { ReservationService } from '../../service/reservation.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { ReservationCreateDTO } from '../../service/dto/reservation-create.dto';
import { MaintenanceReservationCreateDTO } from '../../service/dto/maintenance-reservation-create.dto';
import { AuthService } from '../../service/auth.service';
import { ReservationReportFilterDTO } from '../../service/dto/reservation-report.filter.dto';
import { ReservationFinishDTO } from '../../service/dto/reservation-finish.dto';
import { RatingReservationCreateDTO } from '../../service/dto/rating-reservation.create.dto';
import { ReservationChargeDTO } from '../../service/dto/reservation-charge.dto';
import { ContractPaymentGuard } from '../../security/guards/contract-payment.guard';
import { ChargeDTO } from '../../service/dto/charge.dto';
import { ReservationPaymentService } from '../../service/reservation-payment.service';
import { ReservationPaymentMapper } from '../../service/mapper/reservation-payment.mapper';
import { ReservationFilterDTO } from '../../service/dto/reservation-filter.dto';

@Controller('v2/reservations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('reservations')
export class ReservationController {
  logger = new Logger('ReservationController');

  constructor(
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
    private readonly reservationPaymentService: ReservationPaymentService,
  ) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.BACKOFFICE_N2, RoleType.BACKOFFICE_N1)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'List all records', type: ReservationDTO, })
  async getAll(@Req() req: Request, @Query() query: ReservationFilterDTO): Promise<ReservationDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'reservation.id,DESC',
      req.query.search
    );
    const [results, count] = await this.reservationService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      query,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/charges')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'List all records that has charge', type: ReservationDTO, })
  async getAllReservationsWithCharges(@Req() req: Request): Promise<ReservationDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'reservation.id,DESC', req.query.search);

    const [results, count] = await this.reservationService.findAndCountWithCharges(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      pageRequest.search
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/dateInPeriodAndVehicleId')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Find reservation by date in period and vehicle id' })
  @ApiResponse({ status: 200, description: 'finded record' })
  async findByDateInReservationPeriodAndVehicle(
    @Req() req: Request,
    @Query() query
  ): Promise<ReservationDTO> {
    return await this.reservationService.findByDateInReservationPeriodAndVehicle(
      query.vehicleId,
      query.date
    );
  }

  @Post('/:id/charges')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard, ContractPaymentGuard)
  @ApiOperation({ title: 'Add new charge to reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ChargeDTO })
  async newCharge(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() reservationChargeDTO: ReservationChargeDTO
  ): Promise<ChargeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationPaymentService.createManualCharge(
      ReservationPaymentMapper.fromManualChargeDTOToDomain(
        id,
        reservationChargeDTO,
        +req.query.contractID, req.user
      )
    );
  }

  @Put('/:id/charges/:chargeId/cancel')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard, ContractPaymentGuard)
  @ApiOperation({ title: 'Cancel reservation charge with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  async charge(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('chargeId') chargeId: number,
  ): Promise<void> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    await this.reservationPaymentService.cancelCharge(
      ReservationPaymentMapper.fromCancelChargeDTOtoDomain({
        account: req.user,
        chargeId,
        contractId: +req.query.contractID,
        reservationId: id,
      })
    );
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'The found record', type: ReservationDTO, })
  async getOne(@Req() req: Request, @Param('id') id: number): Promise<ReservationDTO> {
    return await this.reservationService.findByIdAndContract(id, +req.query.contractID);
  }


  @Get('byPin/:pin')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'The found record', type: ReservationDTO, })
  async getOneByPin(@Req() req: Request, @Param('pin') pin: number): Promise<ReservationDTO> {
    return await this.reservationService.findByPinAndContract(pin, +req.query.contractID);
  }

  @Put('trackingByPin/:pin')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'The found record', type: ReservationDTO, })
  async trackingByPin(@Req() req: Request, @Param('pin') pin: number): Promise<void> {
    return await this.reservationService.createReservationTrakingUrlByPinAndContract(pin, +req.query.contractID);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create reservation' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: ReservationDTO, })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() reservationDTO: ReservationCreateDTO): Promise<ReservationDTO> {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    const created = await this.reservationService.createOnV1AndUpdateInV2(reservationDTO, req.user, token, +req.query.contractID);
    this.logger.debug('Created: ' + JSON.stringify(created));
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', created.id);
    return created;
  }

  @PostMethod('/report')
  @Roles(...N2_AND_HIGHER)
  @UseGuards(ContractGuard)
  @ApiResponse({ status: 200, description: 'Create Report', })
  async createReport(@Req() req: Request, @Query('contractID') contractID: number, @Query() filter: ReservationReportFilterDTO): Promise<void> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'reservation.id,DESC',
    );
    await this.reservationService.report(
      {
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter,
      req.user
    );
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async put(@Req() req: Request, @Body() reservationDTO: ReservationDTO): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', reservationDTO.id);
    return await this.reservationService.update(reservationDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async putId(@Req() req: Request, @Param('id') id: number, @Body() reservationDTO: ReservationCreateDTO): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', reservationDTO.id);
    return await this.reservationService.updateById(id, reservationDTO, req.user, +req.query.contractID);
  }

  @Put('/:id/ratings')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async addRatings(@Req() req: Request, @Param('id') id: number, @Body() ratings: RatingReservationCreateDTO): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.addRatings(id, ratings, req.user, +req.query.contractID);
  }

  @Put('/:id/cancel')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async cancelById(@Req() req: Request, @Param('id') id: number): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.cancelById(id, req.user, +req.query.contractID, this.authService.getTokenFromRequest(req));
  }

  @Put('/:id/finish')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async finishById(@Req() req: Request, @Param('id') id: number, @Body() reservationDTO: ReservationFinishDTO): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.finishById(id, req.user, +req.query.contractID, this.authService.getTokenFromRequest(req), reservationDTO);
  }

  @Put('/:id/start')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async startById(@Req() req: Request, @Param('id') id: number): Promise<ReservationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.startById(id, req.user, +req.query.contractID, this.authService.getTokenFromRequest(req));
  }

  @Get('/:id/authorization')
  @Roles(RoleType.CLIENT, RoleType.SUPPORT)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Get ble authorization package for the reservation' })
  @ApiResponse({ status: 200, description: 'The authorization package has been successfully generated.', })
  async getAuthorizationPackage(@Req() req: Request, @Param('id') id: number): Promise<any> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.getAuthorizationPackage(id, req.user, Number(req.query.contractID));
  }

  @PostMethod('/maintenance')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create maintenance reservation' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: ReservationDTO, })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createMaintenanceReservation(@Req() req: Request, @Body() reservationDTO: MaintenanceReservationCreateDTO): Promise<any> {
    const created = await this.reservationService.createMaintenanceReservation(reservationDTO, req.user, +req.query.contractID);
    this.logger.debug('Created: ' + JSON.stringify(created));
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', created.id);
    return created;
  }

  @Put('/maintenance/:id/start')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update maintenance reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async startMaintenanceById(@Req() req: Request, @Param('id') id: number): Promise<any> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.startMaintenanceById(id, req.user, +req.query.contractID);
  }

  @Put('/maintenance/:id/finish')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update maintenance reservation with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ReservationDTO, })
  async finishMaintenanceById(@Req() req: Request, @Param('id') id: number, @Body() reservationDTO: ReservationFinishDTO): Promise<any> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reservation', id);
    return await this.reservationService.finishMaintenanceById(id, req.user, +req.query.contractID, reservationDTO);
  }

}
