import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';

export class ChargeTableFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'charge table id'})
  id: string;

  @IsOptional()
  @ApiModelProperty({ description: 'charge table name'})
  name: string;

  @IsOptional()
  @ApiModelProperty({ description: 'page'})
  page: number;

  @IsOptional()
  @ApiModelProperty({ description: 'sort'})
  sort: string;

  @IsOptional()
  @ApiModelProperty({ description: 'size' })
  size: number;

  @ApiModelProperty({ description: 'contract ID', required: true })
  contractID: number;

  @IsOptional()
  @ApiModelProperty({ description: 'search name'})
  search: string;

  @IsOptional()
  @ApiModelProperty({ description: 'vehicle group id' })
  vehicle_group_id: string;

  @IsOptional()
  @ApiModelProperty({ description: 'current period start date' })
  @Type(() => Date)
  @IsDate()
  currentPeriodStart: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'current period end date' })
  @Type(() => Date)
  @IsDate()
  currentPeriodEnd: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'creat at start date' })
  @Type(() => Date)
  @IsDate()
  createdAtStart: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'creat at end date' })
  @Type(() => Date)
  @IsDate()
  createdAtEnd: Date;
}
