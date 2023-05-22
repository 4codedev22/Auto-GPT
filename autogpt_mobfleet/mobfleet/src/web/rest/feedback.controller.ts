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
import { FeedbackDTO } from '../../service/dto/feedback.dto';
import { FeedbackService } from '../../service/feedback.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/feedbacks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('feedbacks')
export class FeedbackController {
    logger = new Logger('FeedbackController');

    constructor(private readonly feedbackService: FeedbackService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: FeedbackDTO,
    })
    async getAll(@Req() req: Request): Promise<FeedbackDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.feedbackService.findAndCount({
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
        type: FeedbackDTO,
    })
    async getOne(@Param('id') id: number): Promise<FeedbackDTO> {
        return await this.feedbackService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create feedback' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: FeedbackDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() feedbackDTO: FeedbackDTO): Promise<FeedbackDTO> {
        const created = await this.feedbackService.save(feedbackDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Feedback', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update feedback' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FeedbackDTO,
    })
    async put(@Req() req: Request, @Body() feedbackDTO: FeedbackDTO): Promise<FeedbackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Feedback', feedbackDTO.id);
        return await this.feedbackService.update(feedbackDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update feedback with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FeedbackDTO,
    })
    async putId(@Req() req: Request, @Body() feedbackDTO: FeedbackDTO): Promise<FeedbackDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Feedback', feedbackDTO.id);
        return await this.feedbackService.update(feedbackDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete feedback' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Feedback', id);
        return await this.feedbackService.deleteById(id);
    }
}
