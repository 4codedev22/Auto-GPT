import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiUseTags, ApiResponse, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import {name, version} from '../../../package.json';
@Controller('v2/management')
@UseInterceptors(LoggingInterceptor)
@ApiUseTags('management-controller')
export class ManagementController {
    logger = new Logger('ManagementController');

    @ApiExcludeEndpoint()
    @Get('/info')
    @ApiOperation({ title: 'Microservice Info' })
    @ApiResponse({
        status: 200,
        description: 'Check if the microservice is up',
    })
    info(): any {
        return {
            name, 
            version,
            activeProfiles: 'dev',
            'display-ribbon-on-profiles': 'dev',
        };
    }
}
