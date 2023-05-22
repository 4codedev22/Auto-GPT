import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AccountFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'search name'})
  search?: string;

  @IsOptional()
  @ApiModelProperty({ description: 'select fields. Ex: id, name'})
  fields?: string;
}
