import { Injectable, HttpException, HttpStatus, Logger, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DiscountCouponDTO }  from '../service/dto/discount-coupon.dto';
import { DiscountCouponMapper }  from '../service/mapper/discount-coupon.mapper';
import { DiscountCouponRepository } from '../repository/discount-coupon.repository';
import { DiscountCouponFilterDTO } from './dto/discount-coupon-filter.dto';
import { UsedDiscountCouponAccountService } from './used-discount-coupon-account.service';
import { startOfDay, parseISO } from 'date-fns';
import { ReservationDTO } from './dto/reservation.dto';
import { UsedDiscountCouponAccountDTO } from './dto/used-discount-coupon-account.dto';
import { Reservation } from 'src/domain/reservation.entity';
import { ReservationMapper } from './mapper/reservation.mapper';

const relationshipNames = ['accounts'];

@Injectable()
export class DiscountCouponService {
  logger = new Logger('DiscountCouponService');

  constructor(
    @InjectRepository(DiscountCouponRepository) private discountCouponRepository: DiscountCouponRepository,
    @Inject(UsedDiscountCouponAccountService) private usedDiscountCouponAccountService: UsedDiscountCouponAccountService,
  ) {}

    private async checkIfhasAvailableQuantity(coupon: DiscountCouponDTO, accountId: number): Promise<void> {
      const [, quantityUsed] = await this.usedDiscountCouponAccountService.findAndCount({
        where: { discountCoupon: coupon.id }
      });

      if (quantityUsed >= coupon.quantity) {
        throw new BadRequestException('There is no coupon amount to use.');
      }

      const [, quantityUsedByUser] = await this.usedDiscountCouponAccountService.findAndCount({
        where: { account: accountId, discountCoupon: coupon.id }
      });

      if (quantityUsedByUser >= coupon.quantityCouponPerUser) {
        throw new BadRequestException('User has reached the maximum amount of usage.');
      }
    }

    private async checkResevationIsValid(coupon: DiscountCouponDTO, reservationValueCents: number): Promise<boolean> {
      if (reservationValueCents < coupon.minTripValue) {
        throw new BadRequestException('Minimum reservation value not reached');
      }

      return true;
    }

    private async checkAccountIsValid(coupon: DiscountCouponDTO, accountId: number): Promise<void> {
      if (coupon.userSpecific && !coupon.accounts?.find(account => Number(account.id) === accountId)) {
        throw new BadRequestException('Coupon cannot be applied to this account');
      }
    }

    private async getCouponIfIsValid(contractID: number, couponName: string, date: string): Promise<DiscountCouponDTO> {
      const processedDate = startOfDay(parseISO(date));

      const coupon = await this.discountCouponRepository.createQueryBuilder('discountCoupon')
        .andWhere("discountCoupon.contract_id = :contractID", { contractID })
        .andWhere("discountCoupon.name = :couponName", { couponName })
        .andWhere("discountCoupon.effectivePeriodFrom <= :date", { date: processedDate })
        .andWhere("discountCoupon.effectivePeriodTo >= :date", { date: processedDate })
        .leftJoinAndSelect('discountCoupon.accounts', 'accounts')
        .getOne();

      if (!coupon) {
        throw new BadRequestException('Coupon is invalid');
      }

      return DiscountCouponMapper.fromEntityToDTO(coupon);;
    }

    async findById(id: number): Promise<DiscountCouponDTO | undefined> {
      const options = { relations: relationshipNames };
      const result = await this.discountCouponRepository.findOne(id, options);
      return DiscountCouponMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<Omit<DiscountCouponDTO, 'quantityUsed'>>): Promise<DiscountCouponDTO | undefined> {
      const result = await this.discountCouponRepository.findOne(options);
      return DiscountCouponMapper.fromEntityToDTO(result);
    }

    async findAndCount(
      options: FindManyOptions<DiscountCouponDTO>,
      contractID: number,
      search: string,
      filter: DiscountCouponFilterDTO,
    ): Promise<[DiscountCouponDTO[], number]> {
      const resultList = await this.discountCouponRepository.findAndCountWithFilters(
        options,
        contractID,
        search,
        {
          couponType: filter.couponType,
          createdAtEnd: filter.createdAtEnd,
          createdAtStart: filter.createdAtStart,
          effectivePeriodEnd: filter.effectivePeriodEnd,
          effectivePeriodStart: filter.effectivePeriodStart,
          id: filter.id,
          name: filter.name,
          active: filter.active
        }
      )

      const discountCouponDTO: DiscountCouponDTO[] = [];
      if (resultList && resultList[0]) {
          resultList[0].forEach(discountCoupon => discountCouponDTO.push(DiscountCouponMapper.fromEntityToDTO(discountCoupon)));
      }
      return [discountCouponDTO, resultList[1]];
    }

    async save(discountCouponDTO: DiscountCouponDTO, creator?: string): Promise<DiscountCouponDTO | undefined> {
      const entity = DiscountCouponMapper.fromDTOtoEntity(discountCouponDTO);
      if (creator) {
          entity.lastModifiedBy = creator;
      }
      const result = await this.discountCouponRepository.savePreventDuplicateName(entity);
      return DiscountCouponMapper.fromEntityToDTO(result);
    }

    async update(discountCouponDTO: DiscountCouponDTO, updater?: string): Promise<DiscountCouponDTO | undefined> {
      const entity = DiscountCouponMapper.fromDTOtoEntity(discountCouponDTO);
      if (updater) {
          entity.lastModifiedBy = updater;
      }
      const result = await this.discountCouponRepository.savePreventDuplicateName(entity);
      return DiscountCouponMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
      await this.discountCouponRepository.delete(id);
      const entityFind = await this.findById(id);
      if (entityFind) {
        throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
      }
      
      return;
    }

    async getCouponIfIsValidAndCanApply(contractId: number, couponName: string, accountId: number, reservationValue: number, date: string): Promise<DiscountCouponDTO> {
      const coupon = await this.getCouponIfIsValid(contractId, couponName, date);
      await this.checkIfhasAvailableQuantity(coupon, accountId);
      await this.checkResevationIsValid(coupon, reservationValue);
      await this.checkAccountIsValid(coupon, accountId);
      return coupon;
    }

    async apply(discountCoupon: DiscountCouponDTO, reservation: Reservation): Promise<UsedDiscountCouponAccountDTO> {
      const reservationDTO = ReservationMapper.fromEntityToDTO(reservation);
      const useCouponDTO: UsedDiscountCouponAccountDTO = {
        usedAt: new Date(),
        discountCoupon: discountCoupon,
        account: reservationDTO.account,
        reservation: reservationDTO,
      }
      const usedDiscountCoupon = await this.usedDiscountCouponAccountService.save(useCouponDTO, reservation.account?.id?.toString());
      return usedDiscountCoupon;
    }

}
