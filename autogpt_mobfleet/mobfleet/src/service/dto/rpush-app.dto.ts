/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A RpushAppDTO object.
 */
export class RpushAppDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'environment field', required: false })
    environment: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'certificate field', required: false })
    certificate: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'password field', required: false })
    password: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'connections field' })
    connections: number;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'type field' })
    type: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'authKey field', required: false })
    authKey: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'clientId field', required: false })
    clientId: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'clientSecret field', required: false })
    clientSecret: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'accessToken field', required: false })
    accessToken: string;

    @ApiModelProperty({ description: 'accessTokenExpiration field', required: false })
    accessTokenExpiration: any;

    @MaxLength(255)
    @ApiModelProperty({ description: 'apnKey field', required: false })
    apnKey: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'apnKeyId field', required: false })
    apnKeyId: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'teamId field', required: false })
    teamId: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'bundleId field', required: false })
    bundleId: string;
}
