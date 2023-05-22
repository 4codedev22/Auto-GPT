import { endOfDay, startOfDay } from 'date-fns';
import { DiscountCouponFilterDTO } from '../service/dto/discount-coupon-filter.dto';
import { DiscountCouponDTO } from '../service/dto/discount-coupon.dto';
import { EntityRepository, FindManyOptions, OrderByCondition, Repository, SaveOptions, SelectQueryBuilder } from 'typeorm';
import { DiscountCoupon } from '../domain/discount-coupon.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(DiscountCoupon)
export class DiscountCouponRepository extends Repository<DiscountCoupon> {
  private filterActivesByEffectivePeriod (
    queryBuilder: SelectQueryBuilder<DiscountCoupon>,
    effectivePeriodStart: Date,
    effectivePeriodEnd: Date
  ) {
    return queryBuilder.andWhere(
            "discountCoupon.effective_period_to >= :effectivePeriodStart",
            { effectivePeriodStart: startOfDay(new Date(effectivePeriodStart)) }
          )
          .andWhere(
            "discountCoupon.effective_period_from <= :effectivePeriodEnd",
              { effectivePeriodEnd: endOfDay(new Date(effectivePeriodEnd)) }
          )
  }

  private filterByFields (queryBuilder: SelectQueryBuilder<DiscountCoupon>, filters: unknown) {
    Object.keys(filters).forEach((queryKey) => {
      const queryValue = filters[queryKey];
      if (queryValue !== undefined && queryValue !== null) {
        queryBuilder = queryBuilder.andWhere(
          `discountCoupon.${queryKey} = :${queryKey}`,
          { [queryKey]:  queryValue}
        )
      }
    })

    return queryBuilder
  }

  private filterByCreatedAtFromDate = (queryBuilder: SelectQueryBuilder<DiscountCoupon>, date: Date) =>
    queryBuilder.andWhere("discountCoupon.createdAt >= :date",  { date: startOfDay(date) })

  private filterByCreatedAtToDate = (queryBuilder: SelectQueryBuilder<DiscountCoupon>, date: Date) =>
    queryBuilder.andWhere("discountCoupon.createdAt <= :date",  { date: endOfDay(date) })

  private filterBySearch = (queryBuilder: SelectQueryBuilder<DiscountCoupon>, search: string) =>
    queryBuilder.andWhere('discountCoupon.name LIKE :search', {
      search: `%${search}%`,
    });

  private async checkIfCouponNameIsAvailable (coupon: DiscountCoupon) {
    let queryBuilder = this.createQueryBuilder('discountCoupon')
      .andWhere("discountCoupon.contract_id = :contractID", { contractID: coupon.contract })
      .andWhere("discountCoupon.name = :name", { name: coupon.name })

    if (coupon.id) {
      queryBuilder = queryBuilder.andWhere("discountCoupon.id != :id", { id: coupon.id })
    }

    const findedCoupon = await this.filterActivesByEffectivePeriod(
      queryBuilder,
      coupon.effectivePeriodFrom,
      coupon.effectivePeriodTo
    ).getOne();

    if (findedCoupon) {
      throw new HttpException('There is a coupon with the same name in the same period.', HttpStatus.CONFLICT)
    }
  }

  async findAndCountWithFilters (
    options: FindManyOptions<DiscountCouponDTO>,
    contractID: number,
    search: string,
    filter: DiscountCouponFilterDTO,
  ): Promise<[DiscountCoupon[], number]> {

    const {
      createdAtEnd,
      createdAtStart,
      effectivePeriodEnd,
      effectivePeriodStart,
      ...restFilters
    } = filter;

    let queryBuilder = this.createQueryBuilder('discountCoupon')
      .andWhere("discountCoupon.contract_id = :contractID", { contractID })

    queryBuilder = this.filterByFields(queryBuilder, restFilters);

    if (search) {
      queryBuilder = this.filterBySearch(queryBuilder, search);
    }

    if (effectivePeriodStart && effectivePeriodEnd) {
      queryBuilder = this.filterActivesByEffectivePeriod(queryBuilder, effectivePeriodStart, effectivePeriodEnd);
    }

    if (createdAtStart) {
      queryBuilder = this.filterByCreatedAtFromDate(queryBuilder, createdAtStart);
    }

    if (createdAtEnd) {
      queryBuilder = this.filterByCreatedAtToDate(queryBuilder, createdAtEnd);
    }

    return queryBuilder
      .leftJoinAndSelect("discountCoupon.accounts", "accounts")
      .leftJoinAndSelect("discountCoupon.contract", "contract")
      .leftJoinAndSelect("discountCoupon.usedDiscountCouponAccounts", "usedDiscountCouponAccounts")
      .orderBy(options.order as OrderByCondition)
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();
  }

  async savePreventDuplicateName (coupon: DiscountCoupon, options?: SaveOptions) {
    await this.checkIfCouponNameIsAvailable(coupon);

    return this.save(coupon, options);
  }
}
