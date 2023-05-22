import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * A DTO representing an email validation required data - email.
 */
export class EmailValidationDTO {
    @ApiModelProperty({ description: 'the user email' })
    @IsString()
    @IsNotEmpty()
    readonly email: string;
}
