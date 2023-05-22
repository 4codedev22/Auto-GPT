/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AccountDTO } from './account.dto';
import { FeedbackDTO } from './feedback.dto';

/**
 * A FeedbackCommentDTO object.
 */
export class FeedbackCommentDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(500)
    @ApiModelProperty({ description: 'response field' })
    response: string;

    @ApiModelProperty({ type: AccountDTO, description: 'account relationship' })
    account: AccountDTO;

    @ApiModelProperty({ type: FeedbackDTO, description: 'feedback relationship' })
    feedback: FeedbackDTO;
}
