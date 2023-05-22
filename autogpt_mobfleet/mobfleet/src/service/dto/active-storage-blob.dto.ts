/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ActiveStorageAttachmentDTO } from './active-storage-attachment.dto';

/**
 * A ActiveStorageBlobDTO object.
 */
export class ActiveStorageBlobDTO extends BaseDTO {
    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'key field' })
    key: string;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'filename field' })
    filename: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'contentType field', required: false })
    contentType: string;

    @MaxLength(255)
    @ApiModelProperty({ description: 'metadata field', required: false })
    metadata: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'byteSize field' })
    byteSize: number;

    @IsNotEmpty()
    @MaxLength(255)
    @ApiModelProperty({ description: 'checksum field' })
    checksum: string;

    @ApiModelProperty({
        type: ActiveStorageAttachmentDTO,
        isArray: true,
        description: 'activeStorageAttachments relationship',
    })
    activeStorageAttachments: ActiveStorageAttachmentDTO[];
}
