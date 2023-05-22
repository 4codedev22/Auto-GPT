/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

/**
 * A ContractNoAuthDTO object.
 */
export class ContractNoAuthDTO {
  id?: number;

  @ApiModelProperty({ description: 'uuid field' })
  uuid: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({ description: 'name field' })
  name: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportPhone field' })
  supportPhone: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportEmail field' })
  supportEmail: string;

  @IsOptional()
  @MaxLength(255)
  @ApiModelProperty({ description: 'supportWhatsappNumber field' })
  supportWhatsappNumber: string;

}
