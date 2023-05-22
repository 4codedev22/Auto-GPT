/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Account } from './account.entity';
import { UsedDiscountCouponAccount } from './used-discount-coupon-account.entity';
import { Contract } from './contract.entity';
import { CouponType } from './enumeration/coupon-type';

/**
 * A DiscountCoupon.
 */
@Entity('discount_coupons')
export class DiscountCoupon extends BaseEntity {

    @Column({ name: "name" })
    name: string;

    @Column({ type: 'date', name: "effective_period_from" })
    effectivePeriodFrom: any;

    @Column({ type: 'date', name: "effective_period_to" })
    effectivePeriodTo: any;

    @Column({ type: 'enum', name: 'coupon_type', enum: CouponType })
    couponType: CouponType;

    @Column({ type: 'double', name: "value" })
    value: number;

    @Column({ type: 'integer', name: "quantity" })
    quantity: number;

    @Column({ type: 'boolean', name: "user_specific" })
    userSpecific: boolean;

    @Column({ type: 'boolean', name: "active", nullable: true })
    active: boolean;

    @Column({ name: "description", nullable: true })
    description: string;

    @Column({type: 'integer' ,name: "quantity_coupon_per_user" })
    quantityCouponPerUser: number;

    @Column({type: 'integer' ,name: "min_trip_value" })
    minTripValue: number;

    @Column({type: 'integer' ,name: "max_discount_value" })
    maxDiscountValue: number;

    @ManyToMany(type => Account )
    @JoinTable({
        name: 'discount_coupons_accounts',
        joinColumn: { name: 'discount_coupon_id', referencedColumnName: "id" },
        inverseJoinColumn: { name: 'accounts_id', referencedColumnName: "id" }
    })
    accounts: Account[];

    @OneToMany(type => UsedDiscountCouponAccount, other => other.discountCoupon)
    usedDiscountCouponAccounts: UsedDiscountCouponAccount[];

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
