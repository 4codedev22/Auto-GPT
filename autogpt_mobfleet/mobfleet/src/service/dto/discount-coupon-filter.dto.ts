import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';

export class DiscountCouponFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'id'})
  id: number;

  @IsOptional()
  @ApiModelProperty({ description: 'coupon name' })
  name: string;


  @IsOptional()
  @ApiModelProperty({ description: 'coupon type' })
  couponType: string;

  @IsOptional()
  @ApiModelProperty({ description: 'Coupon status' })
  @Type(() => Number)
  active: number;

  @IsOptional()
  @ApiModelProperty({ description: 'start created date' })
  @Type(() => Date)
  @IsDate()
  createdAtStart: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'end created date' })
  @Type(() => Date)
  @IsDate()
  createdAtEnd: Date;


  @IsOptional()
  @ApiModelProperty({ description: 'start effectivePeriod field', required: false })
  @Type(() => Date)
  @IsDate()
  effectivePeriodEnd: Date;


  @IsOptional()
  @ApiModelProperty({ description: 'end effectivePeriod field', required: false })
  @Type(() => Date)
  @IsDate()
  effectivePeriodStart: Date;
}
