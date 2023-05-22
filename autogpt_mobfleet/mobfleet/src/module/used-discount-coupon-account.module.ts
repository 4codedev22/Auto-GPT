import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedDiscountCouponAccountService } from '../service/used-discount-coupon-account.service';
import { UsedDiscountCouponAccountRepository } from '../repository/used-discount-coupon-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsedDiscountCouponAccountRepository])],
  providers: [UsedDiscountCouponAccountService],
  exports: [UsedDiscountCouponAccountService],
})
export class UsedDiscountCouponAccountModule {}
