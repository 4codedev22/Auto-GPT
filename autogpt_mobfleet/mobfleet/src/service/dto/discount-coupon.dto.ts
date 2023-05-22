/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';


import { AccountDTO } from './account.dto';
import { UsedDiscountCouponAccountDTO } from './used-discount-coupon-account.dto';
import { ContractDTO } from './contract.dto';
import { CouponType } from '../../domain/enumeration/coupon-type';
import { Type } from 'class-transformer';


/**
 * A DiscountCouponDTO object.
 */
export class DiscountCouponDTO extends BaseDTO {

    @IsNotEmpty()
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'effectivePeriodFrom field' })
    effectivePeriodFrom: any;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'effectivePeriodTo field' })
    effectivePeriodTo: any;

    @IsNotEmpty()
    @ApiModelProperty({ enum: CouponType, description: 'couponType enum field' })
    couponType: CouponType;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'value field' })
    value: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'Quantity field' })
    quantity: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'userSpecific field' })
    userSpecific: boolean;

    @ApiModelProperty({ description: 'active field', required: false })
    active: boolean;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'quantityCouponPerUser field' })
    quantityCouponPerUser: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'minTripValue field' })
    minTripValue: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'maxDiscountValue field' })
    maxDiscountValue: number;

    @IsOptional()
    @ApiModelProperty({ description: 'quantityUsed field' })
    quantityUsed?: number;

    @ApiModelProperty({ type: AccountDTO, isArray: true, description: 'accounts relationship' })
    @Type(() => AccountDTO)
    accounts: AccountDTO[];

    @ApiModelProperty({ type: ContractDTO, description: 'contract relationship' })
    @Type(() => ContractDTO)
    contract: ContractDTO;

    @ApiModelProperty({ type: UsedDiscountCouponAccountDTO, description: 'usedDiscountCouponAccounts relationship' })
    @Type(() => UsedDiscountCouponAccountDTO)
    usedDiscountCouponAccounts: UsedDiscountCouponAccountDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
