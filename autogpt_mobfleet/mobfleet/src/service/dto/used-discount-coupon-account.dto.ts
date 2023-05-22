/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AccountDTO } from './account.dto';
import { BaseDTO } from './base.dto';

import { DiscountCouponDTO } from './discount-coupon.dto';
import { ReservationDTO } from './reservation.dto';

/**
 * A UsedDiscountCouponAccountDTO object.
 */
export class UsedDiscountCouponAccountDTO extends BaseDTO {

    @IsNotEmpty()
    @ApiModelProperty({ description: 'usedAt field' })
    usedAt: Date;

    @ApiModelProperty({ type: DiscountCouponDTO, description: 'discountCoupon relationship' })
    @Type(() => DiscountCouponDTO)
    discountCoupon: DiscountCouponDTO;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    @Type(() => AccountDTO)
    account: AccountDTO;

    @ApiModelProperty({ type: ReservationDTO, description: 'Rrservation relationship' })
    @Type(() => ReservationDTO)
    reservation: ReservationDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
