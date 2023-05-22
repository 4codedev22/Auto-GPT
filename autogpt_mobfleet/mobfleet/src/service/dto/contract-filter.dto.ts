import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ContractStatus } from '../../domain/enumeration/contract-status';

export class ContractFilterDTO {
  @IsOptional()
  @ApiModelProperty({ description: 'id field'})
  id: string;

  @IsOptional()
  @ApiModelProperty({ description: 'name field'})
  name: string;

  @IsOptional()
  @ApiModelProperty({ description: 'status field', enum: ContractStatus })
  status: ContractStatus;

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
  @ApiModelProperty({ description: 'company id' })
  company: string;

}
