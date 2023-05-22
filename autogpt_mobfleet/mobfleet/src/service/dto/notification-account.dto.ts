/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AccountDTO } from './account.dto';
import { NotificationDTO } from './notification.dto';

/**
 * A NotificationAccountDTO object.
 */
export class NotificationAccountDTO extends BaseDTO {
    @ApiModelProperty({ description: 'readed field', required: false })
    readed: boolean;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: NotificationDTO, description: 'notification relationship' })
    notification: NotificationDTO;
}
