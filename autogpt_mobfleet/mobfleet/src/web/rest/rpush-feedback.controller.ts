import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RpushFeedbackDTO } from '../../service/dto/rpush-feedback.dto';
import { RpushFeedbackService } from '../../service/rpush-feedback.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/rpush-feedbacks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('rpush-feedbacks')
export class RpushFeedbackController {
    logger = new Logger('RpushFeedbackController');

    constructor(private readonly rpushFeedbackService: RpushFeedbackService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: RpushFeedbackDTO,
    })
    async getAll(@Req() req: Request): Promise<RpushFeedbackDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.rpushFeedbackService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: RpushFeedbackDTO,
    })
    async getOne(@Param('id') id: number): Promise<RpushFeedbackDTO> {
        return await this.rpushFeedbackService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create rpushFeedback' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: RpushFeedbackDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() rpushFeedbackDTO: RpushFeedbackDTO): Promise<RpushFeedbackDTO> {
        const created = await this.rpushFeedbackService.save(rpushFeedbackDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushFeedback', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushFeedback' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushFeedbackDTO,
    })
    async put(@Req() req: Request, @Body() rpushFeedbackDTO: RpushFeedbackDTO): Promise<RpushFeedbackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushFeedback', rpushFeedbackDTO.id);
        return await this.rpushFeedbackService.update(rpushFeedbackDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update rpushFeedback with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: RpushFeedbackDTO,
    })
    async putId(@Req() req: Request, @Body() rpushFeedbackDTO: RpushFeedbackDTO): Promise<RpushFeedbackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'RpushFeedback', rpushFeedbackDTO.id);
        return await this.rpushFeedbackService.update(rpushFeedbackDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete rpushFeedback' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'RpushFeedback', id);
        return await this.rpushFeedbackService.deleteById(id);
    }
}
