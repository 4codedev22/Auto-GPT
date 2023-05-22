/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { DiscountCoupon } from './discount-coupon.entity';
import { Account } from './account.entity';
import { Reservation } from './reservation.entity';

/**
 * A UsedDiscountCouponAccount.
 */
@Entity('used_discount_coupon_accounts')
export class UsedDiscountCouponAccount extends BaseEntity {


    @Column({ type: 'timestamp', name: "used_at" })
    usedAt: any;

    @ManyToOne(type => DiscountCoupon)
    @JoinColumn({ name: 'discount_coupon_id' })
    discountCoupon: DiscountCoupon;

    @ManyToOne(type => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(type => Reservation)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;
}
