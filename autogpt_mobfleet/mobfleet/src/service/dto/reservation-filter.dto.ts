import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { ReservationStatus } from '../../domain/enumeration/reservation-status';

export class ReservationFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'reservation pin'})
  pin?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'licensePlate car'})
  licensePlate?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'page'})
  page?: number;

  @IsOptional()
  @ApiModelProperty({ description: 'sort'})
  sort?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'size' })
  size?: number;

  @ApiModelProperty({ description: 'contract ID', required: true })
  contractID?: number;

  @IsOptional()
  @ApiModelProperty({ description: 'search name'})
  search?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'vehicle group id' })
  account?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'reservation status', enum: ReservationStatus })
  status?: ReservationStatus;
  
  @IsOptional()
  @ApiModelProperty({ description: 'start date from' })
  @Type(() => Date)
  @IsDate()
  startReservationFrom?: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'start date to' })
  @Type(() => Date)
  @IsDate()
  startReservationTo?: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'end reservation date from' })
  @Type(() => Date)
  @IsDate()
  endReservationFrom?: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'end reservation date to' })
  @Type(() => Date)
  @IsDate()
  endReservationTo?: Date;

  @IsOptional()
  @ApiModelProperty({ description: 'select fields. Some fields are fixed. Ex: id, pin'})
  fields?: string;
}
