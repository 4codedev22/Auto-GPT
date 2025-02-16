import { Body, Controller, Logger, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('v2')
@UseInterceptors(LoggingInterceptor)
@ApiUseTags('user-jwt-controller')
export class UserJWTController {
    logger = new Logger('UserJWTController');

    constructor(private readonly authService: AuthService) { }

    @Post('/authenticate')
    @ApiOperation({ title: 'Authorization api retrieving token' })
    @ApiResponse({
        status: 201,
        description: 'Authorized',
    })
    async authorize(@Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.login(user);
        res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
        return res.json(jwt);
    }
}
