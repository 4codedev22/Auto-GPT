import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCouponController } from '../web/rest/discount-coupon.controller';
import { DiscountCouponRepository } from '../repository/discount-coupon.repository';
import { DiscountCouponService } from '../service/discount-coupon.service';
import { UsedDiscountCouponAccountModule } from './used-discount-coupon-account.module';
import { AccountModule } from './account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountCouponRepository]),
    UsedDiscountCouponAccountModule,
    AccountModule
  ],
  controllers: [DiscountCouponController],
  providers: [DiscountCouponService],
  exports: [DiscountCouponService],
})
export class DiscountCouponModule {}
