/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ActiveStorageBlobDTO } from './active-storage-blob.dto';

/**
 * A ActiveStorageAttachmentDTO object.
 */
export class ActiveStorageAttachmentDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'name field' })
    name: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'recordType field' })
    recordType: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'recordId field' })
    recordId: number;

    @ApiModelProperty({ type: ActiveStorageBlobDTO, description: 'blobs relationship' })
    blobs: ActiveStorageBlobDTO;
}
