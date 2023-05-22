import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * A DTO representing a password change required data - current and new password.
 */
export class PasswordChangeWithTokenDTO {
    @ApiModelProperty({ description: 'the forgot password token' })
    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @ApiModelProperty({ description: 'New password' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
