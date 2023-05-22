/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A AlertDTO object.
 */
export class AlertDTO extends BaseDTO {

    @IsOptional()
    @ApiModelProperty({ type: 'datetime', description: 'hw_timestamp', required: false })
    hwTimestamp: any;

    @IsOptional()
    @ApiModelProperty({ type: 'datetime', description: 'wb_timestamp', required: false })
    wbTimestamp: any;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'extra_info_value', required: false })
    extraInfoValue: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'lat', required: false })
    lat: string;
    
    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'lng', required: false })
    lng: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'status', required: false })
    status: string;

    @IsOptional()
    @ApiModelProperty({ type: 'datetime', description: 'received_at', required: false })
    receivedAt: any;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'vehicle_identifier', required: false })
    vehicleIdentifier: string;

    @IsOptional()
    @ApiModelProperty({ type: 'boolean', description: 'retry', required: false })
    retry: any;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'group_id', required: false })
    groupId: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'imei', required: false })
    imei: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'type_id', required: false })
    typeId: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'uuid', required: false })
    uuid: string;

    @IsOptional()
    @ApiModelProperty({ type: 'string', description: 'lastModifiedBy', required: false })
    lastModifiedBy: string;

}
