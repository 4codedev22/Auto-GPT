/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A RpushNotificationDTO object.
 */
export class RpushNotificationDTO extends BaseDTO {
    @ApiModelProperty({ description: 'badge field', required: false })
    badge: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'deviceToken field', required: false })
    deviceToken: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'sound field', required: false })
    sound: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'alert field', required: false })
    alert: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'data field', required: false })
    data: string;

    @ApiModelProperty({ description: 'expiry field', required: false })
    expiry: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'delivered field', type: 'tinyint(1)', default: '0', nullable: false })
    delivered: boolean;

    @ApiModelProperty({ description: 'deliveredAt field', required: false })
    deliveredAt: any;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'failed field', type: 'tinyint(1)', default: '0', nullable: false })
    failed: boolean;

    @ApiModelProperty({ description: 'failedAt field', required: false })
    failedAt: any;

    @ApiModelProperty({ description: 'errorCode field', required: false })
    errorCode: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'errorDescription field', required: false })
    errorDescription: string;

    @ApiModelProperty({ description: 'deliverAfter field', required: false })
    deliverAfter: any;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'alertIsJson field', type: 'tinyint(1)', default: '0', nullable: false })
    alertIsJson: boolean;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'type field' })
    type: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'collapseKey field', required: false })
    collapseKey: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'delayWhileIdle field' })
    delayWhileIdle: boolean;

    @ApiModelProperty({ description: 'registrationIds field', required: false })
    registrationIds: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'appId field' })
    appId: number;

    @ApiModelProperty({ description: 'retries field', required: false })
    retries: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'uri field', required: false })
    uri: string;

    @ApiModelProperty({ description: 'failAfter field', required: false })
    failAfter: any;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'processing field', type: 'tinyint(1)', default: '0', nullable: false })
    processing: boolean;

    @ApiModelProperty({ description: 'priority field', required: false })
    priority: number;

    @MaxLength(255)
    @ApiModelProperty({ description: 'urlArgs field', required: false })
    urlArgs: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'category field', required: false })
    category: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'contentAvailable field', type: 'tinyint(1)', default: '0', nullable: false })
    contentAvailable: boolean;

    @MaxLength(255)
    @ApiModelProperty({ description: 'notification field', required: false })
    notification: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'mutableContent field', type: 'tinyint(1)', default: '0', nullable: false })
    mutableContent: boolean;

    @MaxLength(255)
    @ApiModelProperty({ description: 'externalDeviceId field', required: false })
    externalDeviceId: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'threadId field', required: false })
    threadId: string;
}
