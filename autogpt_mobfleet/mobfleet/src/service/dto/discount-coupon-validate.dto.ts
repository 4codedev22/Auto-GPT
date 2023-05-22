import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DiscountCouponValidateDTO {

  @IsNotEmpty()
  @ApiModelProperty({ description: 'contract ID', required: true })
  @Type(() => Number)
  contractID: number;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'Coupon name', required: true })
  couponName: string;

  @IsNotEmpty()
  @ApiModelProperty({ description: 'reservation Value', required: true })
  @Type(() => Number)
  reservationValue: number;
  
}
