/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { MaxLength, IsDate, IsOptional } from 'class-validator';

import { RoleDTO } from './role.dto';
import { CnhSituation } from '../../domain/enumeration/cnh-situation';
import { RegisterSituation } from '../../domain/enumeration/register-situation';
import { Type } from 'class-transformer';

/**
 * A AccountsDTO object.
 */
export class AccountListDTO {
    @ApiModelProperty({ description: 'id field', required: false })
    id?: number;

    @ApiModelProperty({ description: 'name field', required: false })
    name: string;

    @ApiModelProperty({ description: 'email field', required: false })
    email: string;

    @ApiModelProperty({ description: 'cellPhone field', required: false })
    cellPhone: string;

    @ApiModelProperty({ description: 'active field', required: false })
    active: boolean;

    @ApiModelProperty({ description: 'admissionDate field', required: false })
    admissionDate: any;

    @ApiModelProperty({ description: 'blocked field', required: false })
    blocked: boolean;

    @ApiModelProperty({ description: 'blockedBy field', required: false })
    blockedBy: number;

    @ApiModelProperty({ description: 'blockedAt field', required: false })
    blockedAt: any;
    @MaxLength(255)
    @ApiModelProperty({ description: 'blockedReason field', required: false })
    blockedReason: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'deletedReason field', required: false })
    deletedReason: string;

    @ApiModelProperty({ description: 'deletedAt field', required: false })
    deletedAt: any;

    @ApiModelProperty({ description: 'deletedBy field', required: false })
    deletedBy: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'registration field', required: false })
    registration: string;

    @ApiModelProperty({ type: RoleDTO, isArray: true, description: 'roles relationship' })
    roles: RoleDTO[];


    @ApiModelProperty({ description: 'cnhExpirationDate field' })
    cnhExpirationDate: any;

    @ApiModelProperty({ type: CnhSituation, description: 'cnhSituation field' })
    cnhSituation: CnhSituation;

    @ApiModelProperty({ description: 'registerSituation field', type: RegisterSituation })
    registerSituation: RegisterSituation;

    @ApiModelProperty({ description: 'analizedBy field' })
    analizedBy: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @ApiModelProperty({ description: 'analizedAt field', required: false })
    analizedAt: Date;



  @ApiModelProperty({ description: 'address_zip_code field', required: false })
  addressZipCode: string;
  @ApiModelProperty({ description: 'address_public_place field', required: false })
  addressPublicPlace: string;
  @ApiModelProperty({ description: 'address_number field', required: false })
  addressNumber: string;
  @ApiModelProperty({ description: 'address_street field', required: false })
  addressStreet: string;
  @ApiModelProperty({ description: 'address_complement field', required: false })
  addressComplement: string;
  @ApiModelProperty({ description: 'address_city field', required: false })
  addressCity: string;
  @ApiModelProperty({ description: 'address_state field', required: false })
  addressState: string;

}
