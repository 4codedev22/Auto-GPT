/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { FeedbackCommentDTO } from './feedback-comment.dto';
import { AccountDTO } from './account.dto';

/**
 * A FeedbackDTO object.
 */
export class FeedbackDTO extends BaseDTO {
    @MaxLength(255)
    @ApiModelProperty({ description: 'deviceModel field', required: false })
    deviceModel: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'osVersion field', required: false })
    osVersion: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'appVersion field', required: false })
    appVersion: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'message field', required: false })
    message: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'pin field' })
    pin: string;

    @ApiModelProperty({ type: FeedbackCommentDTO, isArray: true, description: 'feedbackComments relationship' })
    feedbackComments: FeedbackCommentDTO[];

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;
}
