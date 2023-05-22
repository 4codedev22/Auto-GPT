import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

/**
 * A DTO representing a login user.
 */
export class UserLoginDTO {
    @ApiModelProperty({ description: 'User password' })
    @IsString()
    readonly password: string;
    @ApiModelProperty({ description: 'User login name' })
    @IsEmail()
    readonly username: string;
}
