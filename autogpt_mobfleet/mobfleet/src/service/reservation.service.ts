import { Injectable, Logger, ForbiddenException, BadRequestException, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, IsNull, Not, OrderByCondition } from 'typeorm';
import { generator } from 'rand-token';
import axios from 'axios';
import { add as addToDate, sub as subFromDate, format as formatDate, differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns';
import { RatingMapper } from './mapper/rating.mapper';
import { ReservationMapper } from '../service/mapper/reservation.mapper';

import { TypeFuel } from '../domain/enumeration/type-fuel';
import { ChargeType } from '../domain/enumeration/charge-type';
import { OrderStatus } from '../domain/enumeration/order-status';
import { ChargeStatus } from '../domain/enumeration/charge-status';
import { BlePermission } from '../domain/enumeration/ble-permission';
import { ReservationType } from '../domain/enumeration/reservation-type';
import { ReservationStatus } from '../domain/enumeration/reservation-status';

import { BACKOFFICE_OR_SUPPORT, hasRole, N2_AND_HIGHER, RoleType } from '../security/role-type';

import { ReservationRepository } from '../repository/reservation.repository';

import { ChargeService } from './charge.service';
import { RatingService } from './rating.service';
import { ReportService } from './report.service';
import { UploadService } from '../module/shared/upload.service';
import { AccountService } from './account.service';
import { VehicleService } from './vehicle.service';
import { ContractService } from './contract.service';
import { ChargeTableService } from './charge-table.service';
import { DiscountCouponService } from './discount-coupon.service';
import { TasksService } from '../tasks/tasks.service';
import { ReservationAccountService } from './reservation-account.service';
import { BackofficeReservationsService } from '../v1/backoffice-reservations/backoffice-reservations.service';
import { PagarmeService, ChargeItem, PaymentInfo } from './pagarme.service';

import { Reservation } from '../domain/reservation.entity';
import { CouponType } from '../domain/enumeration/coupon-type';

import { AccountDTO } from './dto/account.dto';
import { ChargeDTO } from './dto/charge.dto';
import { RatingDTO } from './dto/rating.dto';
import { VehicleDTO } from './dto/vehicle.dto';
import { ContractDTO } from './dto/contract.dto';
import { ReservationDTO } from '../service/dto/reservation.dto';
import { ChargeTableDTO } from './dto/charge-table.dto';
import { DiscountCouponDTO } from './dto/discount-coupon.dto';
import { ReservationCreateDTO } from './dto/reservation-create.dto';
import { ReservationFinishDTO } from './dto/reservation-finish.dto';
import { ReservationFilterDTO } from './dto/reservation-filter.dto';
import { ReservationAccountDTO } from './dto/reservation-account.dto';
import { VehicleTrackingDTO } from './dto/vehicle-tracking.dto';
import { VehicleLocationPathsDTO } from './dto/vehicle-tracking.dto';
import { ReservationReportFilterDTO } from './dto/reservation-report.filter.dto';
import { RatingReservationCreateDTO } from './dto/rating-reservation.create.dto';
import { MaintenanceReservationCreateDTO } from './dto/maintenance-reservation-create.dto';
import { UsedDiscountCouponAccountService } from './used-discount-coupon-account.service';
import { ConfigService } from './config.service';
import { parseOrSameValue } from '../json-util';


const relationshipNames = [];
relationshipNames.push('account');
relationshipNames.push('vehicle');
relationshipNames.push('charge');
relationshipNames.push('usedDiscountCoupon');

export const ReservationStatusNumeric = {
  OPEN: 1,
  IN_PROGRESS: 2,
  FINISHED: 3,
  CANCELLED: 4,
  OVERDUE: 5
}

const MIN_VALUE_TO_CHARGE_CENTS = 50;

@Injectable()
export class ReservationService {
  logger = new Logger('ReservationService');

  constructor(
    @InjectRepository(ReservationRepository)
    private reservationRepository: ReservationRepository,
    private backofficeReservationService: BackofficeReservationsService,
    private accountService: AccountService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    private reservationAccountService: ReservationAccountService,
    private uploadService: UploadService,
    private contractService: ContractService,
    private pagarmeService: PagarmeService,
    private chargeTableService: ChargeTableService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
    @Inject(forwardRef(() => RatingService))
    private ratingService: RatingService,
    @Inject(forwardRef(() => ChargeService))
    private chargeService: ChargeService,
    private tasksService: TasksService,
    private discountCouponService: DiscountCouponService,
    private usedDiscountCouponAccountService: UsedDiscountCouponAccountService,
    private configService: ConfigService,
  ) { }

  private async validateNewReservationTime(reservationDTO: ReservationCreateDTO, config: any) {
    const maxDurationHours = +(config?.['reservations.max_duration_hours'] ?? 0);
    const antecipationToNewMinutes = +(config?.['reservations.antecipation_to_new_minutes'] ?? 10);

    const canCreateInThisMoment = differenceInMinutes(new Date(reservationDTO.dateWithdrawal), new Date()) >= antecipationToNewMinutes;

    if (!canCreateInThisMoment) {
      throw new BadRequestException(`Reservation can only be created with ${antecipationToNewMinutes} minutes in advance`);
    }

    const duration = differenceInHours(new Date(reservationDTO.dateDevolution), new Date(reservationDTO.dateWithdrawal));
    if (duration > maxDurationHours && maxDurationHours > 0) {
      throw new BadRequestException(`Reservation duration can not be greater than ${maxDurationHours} hours`);
    }
  }

  private async validateReservationAccounts(reservationDTO: ReservationCreateDTO, config: any) {
    const allowRides = parseOrSameValue(config?.['reservations.allow_rides']);

    if (!allowRides && reservationDTO.reservationAccounts?.length > 0) {
      throw new BadRequestException('Rides are not allowed for this contract');
    }
  }

  private getCoreAuthorizationHeader(contract: ContractDTO): string {
    const apiToken = contract.clientToken;
    const apiSecret = contract.secretToken;
    const b64 = Buffer.from(`${apiToken}:${apiSecret}`).toString('base64');
    return `Basic ${b64}`;
  }

  async findByIdAndContract(id: number, contractID: number): Promise<ReservationDTO | undefined> {
    let qb = this.reservationRepository.createQueryBuilder('reservation');
    qb = qb.where('reservation.id = :id AND vehicle.contract_id = :contract', { id, contract: contractID });
    qb = qb
      .leftJoinAndSelect('reservation.charges', 'charges')
      .leftJoinAndSelect('reservation.account', 'account')
      .leftJoinAndSelect('account.rpushFeedback', 'rpushFeedback')
      .leftJoinAndSelect('reservation.damages', 'damages')
      .leftJoinAndSelect('reservation.checklists', 'checklists')
      .leftJoinAndSelect('reservation.originLocation', 'originLocation')
      .leftJoinAndSelect('reservation.destinyLocation', 'destinyLocation')
      .leftJoinAndSelect('reservation.devolutionLocation', 'devolutionLocation')
      .leftJoinAndSelect('reservation.ratings', 'ratings')
      .leftJoinAndSelect('reservation.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.contract', 'vehicleContract')
      .leftJoinAndSelect('vehicleContract.company', 'vehicleCompany')
      .leftJoinAndSelect('reservation.reservationAccounts', 'reservationAccounts')
      .leftJoinAndSelect('reservationAccounts.account', 'reservationAccount')
      .leftJoinAndSelect('reservation.usedDiscountCoupons', 'usedDiscountCoupons')
      .leftJoinAndSelect('usedDiscountCoupons.discountCoupon', 'discountCoupon');
    const result = await qb.getOne();
    return ReservationMapper.fromEntityToDTO(result);
  }

  async findByPinAndContract(pin: number, contractID: number): Promise<ReservationDTO | undefined> {
    let qb = this.reservationRepository.createQueryBuilder('reservation');
    qb = qb.where('reservation.pin = :pin AND vehicle.contract_id = :contract', { pin, contract: contractID });
    qb = qb
      .leftJoinAndSelect('reservation.charges', 'charges')
      .leftJoinAndSelect('reservation.account', 'account')
      .leftJoinAndSelect('reservation.damages', 'damages')
      .leftJoinAndSelect('reservation.checklists', 'checklists')
      .leftJoinAndSelect('reservation.originLocation', 'originLocation')
      .leftJoinAndSelect('reservation.destinyLocation', 'destinyLocation')
      .leftJoinAndSelect('reservation.devolutionLocation', 'devolutionLocation')
      .leftJoinAndSelect('reservation.ratings', 'ratings')
      .leftJoinAndSelect('reservation.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('vehicle.vehicleGroup', 'vehicleGroup')
      .leftJoinAndSelect('vehicle.contract', 'contract')
      .leftJoinAndSelect('reservation.reservationAccounts', 'reservationAccounts')
      .leftJoinAndSelect('reservationAccounts.account', 'reservationAccount')
      ;
    const result = await qb.getOne();
    return ReservationMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ReservationDTO>): Promise<ReservationDTO | undefined> {
    const result = await this.reservationRepository.findOne(options as FindOneOptions);
    return ReservationMapper.fromEntityToDTO(result);
  }

  async findOverdueReservations(): Promise<Reservation[] | undefined> {
    const now = formatDate(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss');

    let qb = this.reservationRepository.createQueryBuilder('reservation');

    qb = qb.where(
      `reservation.status = :status AND 
          reservation.date_devolution < :dateDevolution`,
      {
        status: ReservationStatus.IN_PROGRESS,
        dateDevolution: now
      }
    );

    qb = qb
      .leftJoinAndSelect('reservation.account', 'account')
      .leftJoinAndSelect('reservation.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.contract', 'vehicleContract')
      .leftJoinAndSelect('vehicleContract.company', 'vehicleCompany')
      .leftJoinAndSelect('account.rpushFeedback', 'rpushFeedback');

    const resultList = await qb.getMany();

    return resultList;
  }

  async findAndCountWithCharges(options: FindManyOptions<ReservationDTO>, contractID: number, search?: string,): Promise<[ReservationDTO[], number]> {
    options.where = { chargeTable: Not(IsNull()) };
    return this.findAndCount(options, contractID, { search });
  }

  async findByUserAndStatus(userID: number, reservationStatus: ReservationStatus): Promise<ReservationDTO[]> {
    const options: FindManyOptions<ReservationDTO> = { where: { account: userID, status: reservationStatus } };

    const result = await this.reservationRepository.find(options as FindManyOptions);

    return result.map((reservation) => ReservationMapper.fromEntityToDTO(reservation));
  }

  async countByUserAndStatus(userID: number, reservationStatus: ReservationStatus): Promise<number> {
    const options: FindManyOptions<ReservationDTO> = { where: { account: userID, status: reservationStatus } };

    return this.reservationRepository.count(options as FindManyOptions);
  }

  async findAndCount(
    options: FindManyOptions<ReservationDTO>,
    contractID: number,
    filter: ReservationFilterDTO,
  ): Promise<[ReservationDTO[], number]> {
    options.relations = relationshipNames;
    
    const resultList = await this.reservationRepository.findAndCountWithFilters(
      options as FindManyOptions<Reservation>,
      {
        contractID,
        search: filter.search,
        pin: filter.pin,
        licensePlate: filter.licensePlate,
        account: filter.account,
        status: filter.status,
        startReservationFrom: filter.startReservationFrom,
        startReservationTo: filter.startReservationTo,
        endReservationFrom: filter.endReservationFrom,
        endReservationTo: filter.endReservationTo,
        fields: filter.fields,
      }
    );

    const reservationDTO: ReservationDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(reservation => reservationDTO.push(ReservationMapper.fromEntityToDTO(reservation)));
    }
    return [reservationDTO, resultList[1]];
  }

  async findByDateInReservationPeriodAndVehicle (vehicleId: string, date: Date): Promise<ReservationDTO | undefined> {
    const result = await this.reservationRepository.createQueryBuilder('reservation')
      .where('vehicle.id = :vehicleId', { vehicleId })
      .andWhere('reservation.date_start <= :date', { date: new Date(date) })
      .andWhere(
        '(reservation.date_devolution >= :date OR (reservation.date_devolution is NULL AND reservation.status = :status))',
        { date: new Date(date), status: ReservationStatus.IN_PROGRESS }
      )
      .leftJoinAndSelect('reservation.vehicle', 'vehicle')
      .getOne();

    if (!result) {
      throw new NotFoundException('Reservation not found');
    }

    return ReservationMapper.fromEntityToDTO(result);
  }

  async save(reservationDTO: ReservationDTO, creator?: string): Promise<ReservationDTO | undefined> {
    const entity = ReservationMapper.fromDTOtoEntity(reservationDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.reservationRepository.save(entity);
    return ReservationMapper.fromEntityToDTO(result, true);
  }

  async report(
    options: FindManyOptions<ReservationDTO>,
    contractID: number,
    filter: ReservationReportFilterDTO,
    creator: AccountDTO
  ): Promise<void> {
    try {
      const queryBuilder = await this.reservationRepository.report(contractID, filter, options.order as OrderByCondition);
      await this.reportService.createXlsxStreamReport('reservations', creator, await queryBuilder.stream());
    } catch (error) {
      this.logger.error(error, error, 'reservations.report');
    }
  }

  private async createReservationAccount(
    accountID: number,
    reservation: ReservationDTO,
  ): Promise<ReservationAccountDTO> {
    const reservationAccount = {
      status: true,
      message: '',
      reservation,
      account: await this.accountService.findById(accountID),
    } as ReservationAccountDTO;
    return await this.reservationAccountService.save(reservationAccount);
  }

  async createOnV1AndUpdateInV2(
    reservationDTO: ReservationCreateDTO,
    creator: AccountDTO,
    loginToken: string,
    contractID: number
  ): Promise<ReservationDTO | undefined> {
    const config = await this.configService.findByContract(contractID);
    this.validateNewReservationTime(reservationDTO, config);
    this.validateReservationAccounts(reservationDTO, config);
    // curent user creating reservation to himself
    let { driver, callV1AppAPI } = await this.GetDriverAndV1API(creator, reservationDTO);

    // Verify if user can drive the vehicle
    const vehicle = await this.GetVehicleIfUserCanDrive(reservationDTO, driver);

    // Verify if the contract has payment enabled
    const { checkPayment, cardId, chargeTable, discountCoupon } = await this.GetPaymentInfoIfContractPaymentIsEnabled(contractID, driver, reservationDTO, vehicle);

    const entity = ReservationMapper.fromCreateDTOtoV1DTO(reservationDTO);
    const reservationID = await this.backofficeReservationService.createV1Reservation(entity, loginToken, callV1AppAPI);
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    const contract = await this.contractService.findById(contractID, driver);

    reservation.account = driver;

    if (reservationDTO?.reservationAccounts?.length) {
      reservation.reservationAccounts = await Promise.all(
        reservationDTO?.reservationAccounts?.map(accountId => this.createReservationAccount(accountId, reservation)),
      );
    }

    if (creator) { reservation.lastModifiedBy = `${creator.id}`; }

    const received = ReservationMapper.fromCreateDTOtoEntity(reservationDTO);
    const merged = this.reservationRepository.merge(reservation, received);
    const updatedReservation = await this.reservationRepository.save(merged);

    // #region Has payment enabled
    if (checkPayment) {
      updatedReservation.selectedCardId = cardId;
      updatedReservation.chargeTable = chargeTable;

      await this.update(ReservationMapper.fromEntityToDTO(updatedReservation));

      // #region Create order for Deposit
      await this.createDeposit(chargeTable, updatedReservation, contract, cardId, driver, creator, loginToken);
      // #endregion

      // #region Apply coupon to reservation
      if(discountCoupon){
        const { id: usedDiscountCouponId } = await this.discountCouponService.apply(discountCoupon, updatedReservation);

        if (usedDiscountCouponId) {
          const usedDiscountCoupon = await this.usedDiscountCouponAccountService.findById(usedDiscountCouponId, { relations: ['discountCoupon'] });
          updatedReservation.usedDiscountCoupons = [usedDiscountCoupon];
        }
      }
      // #endregion
    }
    // #endregion

    this.tasksService.scheduleCheckAndChangeVehicleOrCancelReservation(reservation.id, contractID);
    this.tasksService.scheduleCheckAndNotifyWithdrawalAvailable(reservation.id, contractID);
    this.tasksService.scheduleCheckAndCancelAfterWithdrawalDate(reservation.id, contractID);

    return ReservationMapper.fromEntityToDTO(updatedReservation, true);
  }

  private async createDeposit(chargeTable: ChargeTableDTO, updatedReservation: Reservation, contract: ContractDTO, cardId: string, driver: AccountDTO, creator: AccountDTO, loginToken: string) {
    if (chargeTable.depositCents > 0) {
      const item: ChargeItem = {
        description: 'Caução #' + updatedReservation.pin,
        amountInCents: chargeTable.depositCents,
        quantity: 1,
      };

      const payment: PaymentInfo = {
        description: contract.company.paymentDescriptor,
        cardId: cardId,
        customerId: driver.customerId
      };

      const paymentResponse = await this.pagarmeService.createOrderPreAuth(contract.company.id, item, payment);

      let transactionAuthorized = false;
      if (paymentResponse?.data?.charges[0]?.last_transaction) {
        // #region Save charge
        const charge = new ChargeDTO();
        charge.type = ChargeType.DEPOSIT;
        charge.description = "Deposit for #" + updatedReservation.pin;
        charge.valueCents = chargeTable.depositCents;
        charge.selectedCardId = updatedReservation.selectedCardId;
        charge.cardLastFour = paymentResponse.data.charges[0].last_transaction?.card?.last_four_digits || "";
        charge.cardBrand = paymentResponse.data.charges[0].last_transaction?.card?.brand || "";
        charge.chargeInfo = paymentResponse;
        charge.orderStatus = paymentResponse.status;
        charge.chargeStatus = paymentResponse.data.charges[0].status;
        charge.reservation = ReservationMapper.fromEntityToDTO(updatedReservation);
        charge.contract = contract;
        await this.chargeService.save(charge);
        // #endregion
        transactionAuthorized = paymentResponse.data.charges[0].status != 'failed' && paymentResponse.data.charges[0].last_transaction?.status != 'not_authorized';
      }

      if (!transactionAuthorized) {
        //cancel reservation
        await this.cancelById(updatedReservation.id, creator, contract.id, loginToken);
        throw new BadRequestException('Transaction not authorized!');
      }
    }
  }

  /**
   * Get the driver and the V1 API to call
   * * If the reservation has accountID, then the driver is the account
   * * If the reservation don't have accountID, then the driver is the creator. 
   * * * For that, the creator must have the role to drive the vehicle.
   * 
   * @param creator 
   * @param reservationDTO 
   * @returns 
   */
  private async GetDriverAndV1API(creator: AccountDTO, reservationDTO: ReservationCreateDTO): Promise<{ driver: AccountDTO, callV1AppAPI: boolean }> {
    // curent user creating reservation to himself
    let driver = creator;
    if (!reservationDTO.accountId) { reservationDTO.accountId = creator.id; }
    let callV1AppAPI = true;

    // curent user creating reservation to other user
    if (reservationDTO.accountId != creator.id) {
      if (hasRole(creator.roles, BACKOFFICE_OR_SUPPORT)) {
        callV1AppAPI = false;
        driver = await this.accountService.findById(reservationDTO.accountId);
      }
    }
    reservationDTO.accountId = driver.id;
    return { driver, callV1AppAPI };
  }

  /**
   * Get the contract by id, and verify if the contract has payment enabled.
   * * If it has, 
   * * * then the driver must have a card to pay
   * * * and the charge table must be defined
   * 
   * Throw an error if the contract has payment enabled but the driver don't have a card or the charge table is not defined
   * 
   * @param contractID 
   * @param driver 
   * @param reservationDTO 
   * @param vehicle 
   * @returns 
   */
  private async GetPaymentInfoIfContractPaymentIsEnabled(contractID: number, driver: AccountDTO, reservationDTO: ReservationCreateDTO, vehicle: VehicleDTO):
    Promise<{ checkPayment: boolean, cardId: string, chargeTable: ChargeTableDTO, discountCoupon: DiscountCouponDTO }> {
    const contract = await this.contractService.findById(contractID, driver);

    const checkPayment = contract.company.paymentEnabled;

    let cardId: string;
    let chargeTable: ChargeTableDTO;
    let discountCoupon: DiscountCouponDTO;
    if (checkPayment) {
      //Adicionar verificação: se a reserva é de Serviço ou de Cliente.
      cardId = reservationDTO.selectedCardId;
      if (!cardId) { throw new BadRequestException('Card ID is required'); }

      chargeTable = await this.chargeTableService.find(contractID, vehicle.vehicleGroup.id);
      if (!chargeTable) { throw new BadRequestException('There is no charge table for this vehicle, contact the manager'); }

      const previewChargeValueCents = this.chargeTableService.previewChargeValue(chargeTable, reservationDTO.dateWithdrawal, reservationDTO.dateDevolution);
      if(reservationDTO.coupon) {
        discountCoupon = await this.discountCouponService.getCouponIfIsValidAndCanApply(contractID, reservationDTO.coupon, +driver.id, previewChargeValueCents, reservationDTO.dateWithdrawal);
      }
    }
    return { checkPayment, cardId, chargeTable, discountCoupon };
  }

  /**
   * Get the vehicle by id, and verify if the driver has the group to drive the vehicle
   * 
   * throw an error if the driver don't have the group to drive the vehicle
   * 
   * @param reservationDTO 
   * @param driver 
   * @returns 
   */
  private async GetVehicleIfUserCanDrive(reservationDTO: ReservationCreateDTO, driver: AccountDTO): Promise<VehicleDTO> {
    const vehicle = await this.vehicleService.findById(reservationDTO.vehicleId);
    if (!vehicle) { throw new BadRequestException('Vehicle not found'); }

    const vehicleGroup = vehicle.vehicleGroup.id;
    const canDriveVehicleGroup = driver.vehicleGroups.find(driverVehicleGroup => driverVehicleGroup.id == vehicleGroup);

    if (!canDriveVehicleGroup) { throw new BadRequestException('Driver cannot drive this vehicle group'); }
    return vehicle;
  }

  async update(reservationDTO: ReservationDTO, updater?: string): Promise<ReservationDTO | undefined> {
    const entity = ReservationMapper.fromDTOtoEntity(reservationDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.reservationRepository.save(entity);
    return ReservationMapper.fromEntityToDTO(result, true);
  }

  async updateById(
    reservationID: number,
    reservationDTO: ReservationCreateDTO,
    creator: AccountDTO,
    contractID: number
  ): Promise<ReservationDTO | undefined> {
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    reservation.account = await this.accountService.findById(reservationDTO.accountId);

    if (reservationDTO?.reservationAccounts?.length) {
      reservation.reservationAccounts = await Promise.all(
        await reservationDTO?.reservationAccounts?.map(
          async accountId => await this.createReservationAccount(accountId, reservation),
        ),
      );
    }

    if (creator) { reservation.lastModifiedBy = `${creator.id}`; }

    const received = ReservationMapper.fromCreateDTOtoEntity(reservationDTO);
    const merged = this.reservationRepository.merge(reservation, received);
    const result = await this.reservationRepository.save(merged);
    return ReservationMapper.fromEntityToDTO(result, true);
  }

  async addRatings(
    reservationID: number,
    ratingDTO: RatingReservationCreateDTO,
    creator: AccountDTO,
    contractID: number
  ): Promise<ReservationDTO | undefined> {
    const reservation = await this.findByIdAndContract(reservationID, contractID);

    if (creator) {
      ratingDTO.lastModifiedBy = `${creator.id}`;
    }
    const rating = RatingMapper.fromReservationCreateDTOtoEntity(ratingDTO);
    rating.reservation = reservation;
    rating.vehicle = reservation.vehicle;
    await this.ratingService.save(rating as RatingDTO);
    return ReservationMapper.fromEntityToDTO(await this.findByIdAndContract(reservationID, contractID));
  }

  async cancelById(
    reservationID: number,
    creator: AccountDTO,
    contractID: number,
    loginToken: string
  ): Promise<ReservationDTO | undefined> {
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    const isCreatorTheDriver = reservation?.account?.id === creator?.id;
    const creatorHasRoles = hasRole(creator.roles, [RoleType.SUPPORT, ...N2_AND_HIGHER]);
    if (!isCreatorTheDriver && !creatorHasRoles) { throw new ForbiddenException('User cannot cancel this reservation'); }

    if (reservation.status === ReservationStatus.IN_PROGRESS) {
      throw new BadRequestException('User cannot cancel an IN_PROGRESS reservation');
    }
    await this.backofficeReservationService.updateResevationStatus(reservation.id, ReservationStatusNumeric.CANCELLED, loginToken);

    // #region Payment
    const contract = await this.contractService.findById(contractID, creator);
    const hasPymentEnabled = contract.company.paymentEnabled;

    if (hasPymentEnabled) {
      const chargeTable = reservation.chargeTable;
      // #region Cancell deposit charge
      if (chargeTable.depositCents > 0) {
        await this.cancelDeposit(reservationID, contract);
      }
      // #endregion
    }
    // #endregion

    try {
      await this.vehicleService.updateAfterCancelReservation(reservation);
    } catch (error) {
      this.logger.error(error, null, 'falha ao atualizar dados do veículo');
    }

    this.tasksService.cancelCheckAndChangeVehicleOrCancelReservation(reservationID);
    this.tasksService.cancelCheckAndNotifyWithdrawalAvailable(reservationID);
    this.tasksService.cancelCheckAndCancelAfterWithdrawalDate(reservationID);

    return ReservationMapper.fromEntityToDTO(await this.reservationRepository.findOne(reservationID), true);
  }

  async finishById(reservationID: number, creator: AccountDTO, contractID: number, loginToken: string, finishReservationDTO: ReservationFinishDTO): Promise<ReservationDTO | undefined> {
    const now = new Date();

    let reservation = await this.findByIdAndContract(reservationID, contractID);
    const isCreatorTheDriver = reservation?.account?.id === creator?.id;
    const creatorHasRoles = hasRole(creator.roles, [RoleType.SUPPORT, ...N2_AND_HIGHER]);
    if (!isCreatorTheDriver && !creatorHasRoles) { throw new ForbiddenException('User cannot finish this reservation'); };

    const isInProgress = reservation.status === ReservationStatus.IN_PROGRESS
      || reservation.status === ReservationStatus.OVERDUE;
    if (!isInProgress) { throw new BadRequestException('User can finish only an IN_PROGRESS reservation'); }

    reservation.status = ReservationStatus.IN_PROGRESS;

    // Update reservation info

    // #region Contingencia de Posição, Odometro e Combustível
    const contingency = this.applyContingency(reservation, finishReservationDTO);
    const vehicle = contingency.vehicle;
    reservation = contingency.reservation;
    // #endregion

    // #region Calculo do consumo da viagem
    reservation.travelledDistance = reservation.finalOdometerKm - reservation.initialOdometerKm;
    reservation.dateFinish = now;
    reservation.timeTraveled = differenceInSeconds(now, reservation.dateStart);
    // #endregion

    // #region Pagamento
    const contract = await this.contractService.findById(contractID, creator);

    // If has payment, and reservation has a valid charge table associated with charge conditions
    const hasPymentEnabled = contract.company.paymentEnabled && !!reservation.chargeTable?.chargeConditions;
    if (hasPymentEnabled) {
      this.logger.debug({ hasPayment: contract.company.paymentEnabled, descriptior: contract.company.paymentDescriptor });
      const chargeTable: ChargeTableDTO = reservation.chargeTable;
      const initialChargeCents = chargeTable.initialChargeCents;

      const detailedPaymentInfo = {
        fuel: {},
        odometer: {},
        time: {},
        discount: {},
      };

      // #region Calculate Fuel Charge
      let fuelCapacity = 100;
      if (vehicle.typeFuel !== TypeFuel.ELETRIC) { fuelCapacity = vehicle.tankFuel; }
      const fuelCharge = this.chargeTableService.calculateFuelConsumptionCharge(chargeTable, reservation.initialFuelLevel, reservation.finalFuelLevel, fuelCapacity);
      detailedPaymentInfo['fuel'] = fuelCharge;
      // #endregion

      // #region Calculate Odometer Charge
      const odometerCharge = this.chargeTableService.calculateDistanceCharge(chargeTable, reservation.initialOdometerKm, reservation.finalOdometerKm);
      detailedPaymentInfo['odometer'] = odometerCharge;
      // #endregion

      // #region Calculate Time Charge
      const timeCharge = this.chargeTableService.calculateTimeCharge(chargeTable, reservation.dateStart, reservation.dateFinish);
      detailedPaymentInfo['time'] = timeCharge;
      // #endregion

      // #region Calculate Total price before discount
      const totalPriceDiscountApplicableCents = initialChargeCents + timeCharge.totalPriceCents;
      const totalExtraCents = fuelCharge.totalPriceCents + odometerCharge.totalPriceCents;
      const totalPriceBeforeDiscountCents = totalPriceDiscountApplicableCents + totalExtraCents;
      // #endregion

      // #region Apply Discounts
      let discountCents = 0;
      const usedCouponsRelation = await this.usedDiscountCouponAccountService.findByFields({ where: { reservation: reservation.id } });
      if (usedCouponsRelation) {
        const coupon = usedCouponsRelation?.discountCoupon;
        if (totalPriceDiscountApplicableCents >= coupon.minTripValue) {

          const discountType = coupon.couponType;
          if (discountType === CouponType.PERCENTAGE) {
            // Calculate discount in percentage
            const discountPercent = coupon.value;
            let calculatedCents = totalPriceDiscountApplicableCents * (discountPercent / 100);
            if (coupon.maxDiscountValue != 0 && calculatedCents > coupon.maxDiscountValue) calculatedCents = coupon.maxDiscountValue;
            discountCents = calculatedCents;
          }

          if (discountType === CouponType.VALUE) {
            // Calculate discount in cents
            discountCents = coupon.value;
            if (coupon.value > totalPriceDiscountApplicableCents) discountCents = totalPriceDiscountApplicableCents;
          }
        }

        detailedPaymentInfo['discount'] = {
          coupon: coupon.name,
          maxDiscountCents: coupon.maxDiscountValue,
          minTripValue: coupon.minTripValue,
          couponType: coupon.couponType,
          couponValue: coupon.value,
          totalPriceDiscountApplicableCents: totalPriceDiscountApplicableCents,
          totalDiscountCents: discountCents,
        };
      }
      // #endregion

      const totalPriceCents = totalPriceBeforeDiscountCents - discountCents;
      detailedPaymentInfo['totalPriceCents'] = {
        initialCents: initialChargeCents,
        timeCents: timeCharge.totalPriceCents,
        totalPriceDiscountApplicableCents,

        fuelCents: fuelCharge.totalPriceCents,
        odometerCents: odometerCharge.totalPriceCents,
        totalExtraCents,

        totalPriceBeforeDiscountCents,
        discountCents,

        totalCents: totalPriceCents
      }
      reservation.detailedPaymentInfo = detailedPaymentInfo;
      this.reservationRepository.save(reservation);

      const item: ChargeItem = {
        description: 'Viagem #' + reservation.pin,
        amountInCents: totalPriceCents,
        quantity: 1,
      };

      const payment: PaymentInfo = {
        description: contract.company.paymentDescriptor,
        cardId: reservation.selectedCardId,
        customerId: reservation.account.customerId
      }

      if (totalPriceCents >= MIN_VALUE_TO_CHARGE_CENTS) {
        // #region Execute charge
        const paymentResponse = await this.pagarmeService.createOrderAndCapture(contract.company.id, item, payment);
        // #endregion

        // #region Save charge
        const charge = new ChargeDTO();
        charge.type = ChargeType.NORMAL;
        charge.description = "System charge for #" + reservation.pin;
        charge.valueCents = totalPriceCents;
        charge.selectedCardId = reservation.selectedCardId;
        charge.cardLastFour = paymentResponse.data.charges[0].last_transaction?.card?.last_four_digits || "";
        charge.cardBrand = paymentResponse.data.charges[0].last_transaction?.card?.brand || "";
        charge.chargeInfo = paymentResponse;
        charge.orderStatus = paymentResponse.status;
        charge.chargeStatus = paymentResponse.data.charges[0].status;
        charge.reservation = reservation;
        charge.contract = contract;
        await this.chargeService.save(charge);
        // #endregion
      }

      // if (paymentResponse.status !== 'paid' && paymentResponse.status !== 'pending') {
      //   throw new BadRequestException('Payment was not captured');
      // }

      // #region Cancell deposit charge
      if (chargeTable.depositCents > 0) {
        await this.cancelDeposit(reservationID, contract);
      }
      // #endregion 
    }
    // #endregion

    await this.backofficeReservationService.updateResevationStatus(reservation.id, ReservationStatusNumeric.FINISHED, loginToken);

    try {
      await this.vehicleService.updateAfterFinishReservation(vehicle, reservation.id);
    } catch (error) {
      this.logger.error(error, null, 'falha ao atualizar dados do veículo');
    }

      this.tasksService.cancelCheckAndNotifyNearDevolutionDate(reservationID);
      this.tasksService.cancelCheckAndNotifyDelayedDevolution(reservationID);
      const updatedReservation = await this.findByIdAndContract(reservationID, contractID);

    try {
      await this.createReservationTrakingUrl(updatedReservation);
    } catch (e) {
      this.logger.error(e, null, 'falha ao criar link de traking');
    }

    return ReservationMapper.fromEntityToDTO(updatedReservation);
  }

  /**
   * Cancels the deposit charge from a reservation
   * 
   * @param reservationID Reservation ID
   * @param contract 
   */
  private async cancelDeposit(reservationID: number, contract: ContractDTO) {
    const charges = await this.chargeService.findByReservationId(reservationID, contract.id);
    console.log(`reservationID: ${reservationID}; contractID: ${contract.id}; charges: ${charges.length}`);
    if (charges.length === 0) { return true; }

    const depositCharge = charges.find(charge => charge.type === ChargeType.DEPOSIT);
    if (!depositCharge) { return true; }

    const depositChargeId = depositCharge?.chargeInfo?.data?.charges[0]?.id;
    if (!depositChargeId) { return false; }

    try {
      await this.pagarmeService.cancellCharge(contract.company.id, depositChargeId);
      const depoistOrder = await this.pagarmeService.getOrder(contract.company.id, depositCharge.chargeInfo.data.id);
      depositCharge.chargeInfo = depoistOrder;
      depositCharge.orderStatus = OrderStatus.CANCELED;
      depositCharge.chargeStatus = ChargeStatus.CANCELED;
      await this.chargeService.save(depositCharge);
    }

    catch (error) {
      this.logger.error(error, null, 'falha ao cancelar depósito');
      return false;
    }

    return true;
  }

  private applyContingency(reservation: ReservationDTO, finishReservationDTO: ReservationFinishDTO): { vehicle: VehicleDTO, reservation: ReservationDTO } {
    const vehicle = reservation.vehicle;
    reservation.finalOdometerKm = vehicle.odometerKm;
    reservation.finalFuelLevel = vehicle.fuelLevel;

    const isEletric = vehicle.typeFuel == TypeFuel.ELETRIC;
    if (isEletric) { reservation.finalFuelLevel = vehicle.evBatteryLevel; }

    const finishOdometerKm = Number(finishReservationDTO?.odometerKm);
    if (finishOdometerKm && vehicle.odometerKm < finishOdometerKm) {
      reservation.finalOdometerKm = finishOdometerKm;
      vehicle.odometerKm = finishOdometerKm;
    }

    const finishFuelLevel = Number(finishReservationDTO?.fuelLevel);
    if (finishFuelLevel && finishFuelLevel >= 0 && finishFuelLevel <= 100) {
      reservation.finalFuelLevel = finishFuelLevel;

      if (isEletric) {
        vehicle.evBatteryLevel = finishFuelLevel;
      } else {
        vehicle.fuelLevel = finishFuelLevel;
      }
    }

    const lat = Number(finishReservationDTO?.latitude);
    const lng = Number(finishReservationDTO?.longitude);
    if (lat && lng) {
      vehicle.latitude = lat;
      vehicle.longitude = lng;
    }
    return { vehicle, reservation };
  }

  async startById(reservationID: number, creator: AccountDTO, contractID: number, loginToken: string): Promise<ReservationDTO | undefined> {
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    if (!reservation) { throw new NotFoundException(`reservation not found with id = ${reservationID}`); }

    const driver = reservation?.account?.id;
    const isStarterTheDriver = driver === creator?.id;
    const starterHasRoles = hasRole(creator.roles, [RoleType.SUPPORT, ...N2_AND_HIGHER]);
    if (!isStarterTheDriver && !starterHasRoles) { throw new ForbiddenException('User cannot start this reservation'); };

    if (reservation.status !== ReservationStatus.OPEN) { throw new BadRequestException('User can start only an OPEN reservation'); }
    await this.backofficeReservationService.updateResevationStatus(reservation.id, ReservationStatusNumeric.IN_PROGRESS, loginToken);

    try {
      reservation.status = ReservationStatus.IN_PROGRESS;
      await this.vehicleService.updateAfterStartReservation(reservation);
    } catch (error) {
      this.logger.error(error, null, 'falha ao atualizar dados do veículo');
    }

    this.tasksService.scheduleCheckAndNotifyNearDevolutionDate(reservation, contractID);
    this.tasksService.scheduleCheckAndNotifyDelayedDevolution(reservationID, contractID);
    this.tasksService.cancelCheckAndChangeVehicleOrCancelReservation(reservationID);
    this.tasksService.cancelCheckAndNotifyWithdrawalAvailable(reservationID);
    this.tasksService.cancelCheckAndCancelAfterWithdrawalDate(reservationID);

    return ReservationMapper.fromEntityToDTO(await this.reservationRepository.findOne(reservationID));
  }

  async createMaintenanceReservation(reservationDTO: MaintenanceReservationCreateDTO, creator: AccountDTO, contractID: number): Promise<any> {
    const now = new Date();
    const pin = generator({ chars: 'numeric' }).generate(8);
    const vehicle = await this.vehicleService.findById(reservationDTO.vehicleId);
    const vehicleCurrentHotspot = vehicle.currentHotspot;

    const reservation = {
      account: creator,
      dateWithdrawal: now,
      dateDevolution: null,
      devolutionLocation: vehicleCurrentHotspot,
      pin,
      originLocation: vehicleCurrentHotspot,
      qtyPeople: 1,
      status: ReservationStatus.OPEN,
      type: ReservationType.MAINTENANCE,
      vehicle
    } as unknown as ReservationDTO;

    const entity = ReservationMapper.fromDTOtoEntity(reservation);

    if (creator) {
      entity.lastModifiedBy = creator.email;
    }

    const result = await this.reservationRepository.save(entity);
    return ReservationMapper.fromEntityToDTO(result);
  }

  async startMaintenanceById(reservationID: number, user: AccountDTO, contractID: number) {
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    if (!reservation) { throw new NotFoundException(`reservation not found with id = ${reservationID}`); }

    const driver = reservation?.account?.id;
    const isUserTheDriver = driver === user?.id;
    const userHasRoles = hasRole(user.roles, [RoleType.SUPPORT, ...N2_AND_HIGHER]);
    if (!isUserTheDriver && !userHasRoles) { throw new ForbiddenException('User cannot start this reservation'); };

    if (reservation.status !== ReservationStatus.OPEN) { throw new BadRequestException('User can start only an OPEN reservation'); }

    const vehicle = await this.vehicleService.findById(reservation.vehicle.id);
    const isElectricVehicle = vehicle.typeFuel === TypeFuel.ELETRIC;

    const now = new Date();

    reservation.status = ReservationStatus.IN_PROGRESS;
    reservation.dateStart = now;
    reservation.initialOdometerKm = vehicle.odometerKm;
    reservation.initialFuelLevel = isElectricVehicle ? vehicle.evBatteryLevel : vehicle.fuelLevel;

    await this.reservationRepository.save(reservation);

    try {
      await this.vehicleService.updateAfterStartReservation(reservation);
    } catch (error) {
      this.logger.error(error, null, 'falha ao atualizar dados do veículo');
    }

    return ReservationMapper.fromEntityToDTO(await this.reservationRepository.findOne(reservationID));
  }

  async finishMaintenanceById(reservationID: number, user: AccountDTO, contractID: number, finishReservationDTO: ReservationFinishDTO): Promise<any> {
    const now = new Date();

    let reservation = await this.findByIdAndContract(reservationID, contractID);
    const isUserTheDriver = reservation?.account?.id === user?.id;
    const userHasRoles = hasRole(user.roles, [RoleType.SUPPORT, ...N2_AND_HIGHER]);
    if (!isUserTheDriver && !userHasRoles) { throw new ForbiddenException('User cannot finish this reservation'); };

    const isInProgress = reservation.status === ReservationStatus.IN_PROGRESS
      || reservation.status === ReservationStatus.OVERDUE;
    if (!isInProgress) { throw new BadRequestException('User can finish only an IN_PROGRESS reservation'); }

    reservation.status = ReservationStatus.FINISHED;

    const contingency = this.applyContingency(reservation, finishReservationDTO);
    const { vehicle } = contingency;
    reservation = contingency.reservation;

    reservation.travelledDistance = reservation.finalOdometerKm - reservation.initialOdometerKm;
    reservation.dateDevolution = now;
    reservation.dateFinish = now;
    reservation.timeTraveled = differenceInSeconds(now, reservation.dateStart);
    reservation.finishAt = now;
    reservation.finishResponsible = user.id;

    this.reservationRepository.save(reservation);

    if (reservation.travelledDistance > 0) {
      user.distanceTraveled += reservation.travelledDistance;
      await this.accountService.save(user);
    }

    try {
      await this.vehicleService.updateAfterFinishReservation(vehicle, reservation.id);
    } catch (error) {
      this.logger.error(error, null, 'falha ao atualizar dados do veículo');
    }

    const updatedReservation = await this.findByIdAndContract(reservationID, contractID);
    return ReservationMapper.fromEntityToDTO(updatedReservation);
  }

  async getAuthorizationPackage(reservationID: number, user: AccountDTO, contractID: number): Promise<string | null> {
    const reservation = await this.findByIdAndContract(reservationID, contractID);
    const { account, dateDevolution, status, vehicle } = reservation;
    const isReservationInProgress = status === ReservationStatus.IN_PROGRESS || status === ReservationStatus.OVERDUE;

    if (!isReservationInProgress) { throw new BadRequestException('Authorization package can only be generated for a in progress reservation'); }

    // The authorization package will be generated with a validity of 30 min before the current time 
    // and 2 hours after the devolution date of the reservation / current time
    const now = Date.now();
    const authPackageStart = subFromDate(now, { minutes: 30 }).toISOString();
    const finishDateToUse = (status === ReservationStatus.OVERDUE || dateDevolution == null) ? now : dateDevolution;
    const authPackageFinish = addToDate(finishDateToUse, { hours: 2 }).toISOString();

    const authPackagePermission = BlePermission.MemPub + BlePermission.CmdDoor + BlePermission.CmdLock + BlePermission.CmdPub;

    const getAuthPackageRequestBody = {
      start: authPackageStart,
      finish: authPackageFinish,
      permission: authPackagePermission,
      userUuid: account.id,
    }

    const contract = await this.contractService.findById(contractID, user);
    const authorizationHeader = this.getCoreAuthorizationHeader(contract);
    const getAuthPackageUrl = `${process.env.CORE_API_URL}/vehicles/contracts/${contract.uuid}/identifier/${vehicle.chassis}/authorize`;

    const result = await axios.post(
      getAuthPackageUrl,
      getAuthPackageRequestBody,
      { headers: { 'Authorization': authorizationHeader } }
    )
      .then(({ data }) => data)
      .catch((error) => {
        this.logger.error(error?.response?.data ?? error);
        return null;
      });

    if (result.data == null) throw new BadRequestException('Authorization package could not be generated');

    return result.data;
  }

  async createReservationTrakingUrlByPinAndContract(pin: number, contractID: number): Promise<void> {
    const reservation = await this.findByPinAndContract(pin, contractID);
    return await this.createReservationTrakingUrl(reservation);
  }

  async createReservationTrakingUrl(reservation: ReservationDTO): Promise<void> {

    const allTrackings = await this.vehicleService.listAllTrackingHistory({
      contractID: reservation?.vehicle?.contract?.id,
      user: reservation?.account,
      vehicleID: reservation?.vehicle?.id,
      fromDateAndTime: reservation?.dateStart,
      toDateAndTime: reservation?.dateFinish
    })
    reservation.csvLink = await this.sendTrackingHistoryToServerAndGetUrl(reservation?.id, allTrackings);
    await this.reservationRepository.save(reservation);
  }
  async sendTrackingHistoryToServerAndGetUrl(reservationID: number, locationPaths: VehicleLocationPathsDTO[]): Promise<string> {
    const buffer = Buffer.from(JSON.stringify(locationPaths));
    const { Location } = await this.uploadService.uploadFile(buffer, `${reservationID}-tracking-history.json`);
    return Location;
  }

  // @Cron('* * * * * *')
  // triggerCronJob() {
  //   console.log("Calling the method every second");
  // }
  //preecher distancia percorrida vai ser calculada pelo odometro (inicial - final)
  //preencher odometro a partir do veículo
  //timeTraveled é horario atual - horario inicial
  //fuelLevel pegar do veículo
  //

  //IN_PROGRESS
  // na reserva colocar o combustivel e odometro inicial
  // update vehicle  com o ID da reserva
  //EM todos os updates de reserva atualizar reservation status no veículo

  //ATRASADO
  // reserva em progresso quando já passou do tempo (devolution_date) e IN_PROGRESS
  // Atualizar no GET da Reserva

  //NÂO incluir atrasado no banco, apenas lógico (quando for mandar pro front)
}
