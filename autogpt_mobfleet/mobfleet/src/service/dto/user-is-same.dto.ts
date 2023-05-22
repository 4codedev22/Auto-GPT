import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserLoginDTO } from './user-login.dto';

/**
 * A DTO representing a login user.
 */
export class UserIsSameDTO extends UserLoginDTO {
    @ApiModelProperty({ description: 'User CurrentContract' })
    @IsString()
    readonly currentContract: string;
}
