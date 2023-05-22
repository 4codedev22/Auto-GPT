import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * A DTO representing a phone validation required data - phone number.
 */
export class PhoneValidationDTO {
    @ApiModelProperty({ description: 'the user phone number' })
    @IsString()
    @IsNotEmpty()
    readonly phoneNumber: string;
}
