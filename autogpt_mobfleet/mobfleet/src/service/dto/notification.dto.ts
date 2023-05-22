/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { NotificationAccountDTO } from './notification-account.dto';

/**
 * A NotificationDTO object.
 */
export class NotificationDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'group field' })
    group: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'title field' })
    title: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'message field' })
    message: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'image field', required: false })
    image: string;

    @ApiModelProperty({ description: 'readed field', required: false })
    readed: boolean;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'data field' })
    data: string;

    @ApiModelProperty({ type: NotificationAccountDTO, isArray: true, description: 'notificationAccounts relationship' })
    notificationAccounts: NotificationAccountDTO[];
}
