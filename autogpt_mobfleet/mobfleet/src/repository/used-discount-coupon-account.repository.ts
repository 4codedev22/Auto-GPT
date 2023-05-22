import { EntityRepository, Repository } from 'typeorm';
import { UsedDiscountCouponAccount } from '../domain/used-discount-coupon-account.entity';

@EntityRepository(UsedDiscountCouponAccount)
export class UsedDiscountCouponAccountRepository extends Repository<UsedDiscountCouponAccount> {}
