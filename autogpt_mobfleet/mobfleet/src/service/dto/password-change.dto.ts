import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * A DTO representing a password change required data - current and new password.
 */
export class PasswordChangeDTO {
    @ApiModelProperty({ description: 'Current password' })
    @IsString()
    @IsNotEmpty()
    readonly old_password: string;

    @ApiModelProperty({ description: 'New password' })
    @IsString()
    @IsNotEmpty()
    readonly new_password: string;

    @ApiModelProperty({ description: 'new hint' })
    @IsString()
    @IsOptional()
    readonly new_hint: string;
}
