/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional, IsDate } from 'class-validator';

import { CnhSituation } from '../../domain/enumeration/cnh-situation';
import { RegisterSituation } from '../../domain/enumeration/register-situation';
import { Type } from 'class-transformer';
import { OnlyNumbers, Trim } from './dto-utils';

/**
 * A AccountsDTO object.
 */
export class AccountCreateDTO {
  @MaxLength(320)
  @ApiModelProperty({ description: 'name field', required: false })
  @Trim()
  name: string;

  @MaxLength(320)
  @ApiModelProperty({ description: 'email field', required: false })
  @Trim()
  email: string;

  @IsOptional()
  @MaxLength(320)
  @ApiModelProperty({ description: 'registration field', required: false })
  @Trim()
  registration: string;

  @IsOptional()
  @ApiModelProperty({ description: 'admissionDate field', required: false })
  admissionDate: any;

  @OnlyNumbers({ toClassOnly: true })
  @Trim()
  @ApiModelProperty({ description: 'cellPhone field', required: false })
  @MaxLength(20)
  cellPhone: string;

  @MaxLength(10)
  @ApiModelProperty({ description: 'displayLanguage field', required: false })
  @Trim()
  displayLanguage: string;

  @ApiModelProperty({ description: 'user roles field', required: false })
  roles: string[];

  @ApiModelProperty({ description: 'contracts field', required: false })
  contracts: number[];

  @ApiModelProperty({ description: 'vehicleGroups field', required: false })
  vehicleGroups: number[];

  @ApiModelProperty({ description: 'address_zip_code field', required: false })
  @Trim()
  addressZipCode: string;
  @ApiModelProperty({ description: 'address_public_place field', required: false })
  @Trim()
  addressPublicPlace: string;
  @ApiModelProperty({ description: 'address_number field', required: false })
  @Trim()
  addressNumber: string;
  @ApiModelProperty({ description: 'address_street field', required: false })
  @Trim()
  addressStreet: string;
  @ApiModelProperty({ description: 'address_complement field', required: false })
  @Trim()
  addressComplement: string;
  @ApiModelProperty({ description: 'address_city field', required: false })
  @Trim()
  addressCity: string;
  @ApiModelProperty({ description: 'address_state field', required: false })
  @Trim()
  addressState: string;

  @ApiModelProperty({ description: 'cnhExpirationDate field' })
  cnhExpirationDate: any;

  @ApiModelProperty({ type: CnhSituation, description: 'cnhSituation field' })
  cnhSituation: CnhSituation;


  @ApiModelProperty({ description: 'registerSituation field', type: RegisterSituation })
  registerSituation: RegisterSituation;

  @ApiModelProperty({ description: 'analizedBy field' })
  @Trim()
  analizedBy: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiModelProperty({ description: 'analizedAt field', required: false })
  analizedAt: Date;

  @ApiModelProperty({ description: 'password field', required: false })
  @Trim()
  password: string;

  @ApiModelProperty({ description: 'password field', required: false })
  @Trim()
  signatureBase64: string;
}
