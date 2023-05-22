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
import { FeedbackCommentDTO } from '../../service/dto/feedback-comment.dto';
import { FeedbackCommentService } from '../../service/feedback-comment.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('v2/feedback-comments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('feedback-comments')
export class FeedbackCommentController {
    logger = new Logger('FeedbackCommentController');

    constructor(private readonly feedbackCommentService: FeedbackCommentService) {}

    @Get('/')
    @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: FeedbackCommentDTO,
    })
    async getAll(@Req() req: Request): Promise<FeedbackCommentDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.feedbackCommentService.findAndCount({
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
        type: FeedbackCommentDTO,
    })
    async getOne(@Param('id') id: number): Promise<FeedbackCommentDTO> {
        return await this.feedbackCommentService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Create feedbackComment' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: FeedbackCommentDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() feedbackCommentDTO: FeedbackCommentDTO): Promise<FeedbackCommentDTO> {
        const created = await this.feedbackCommentService.save(feedbackCommentDTO, `${req.user?.id}`);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'FeedbackComment', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update feedbackComment' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FeedbackCommentDTO,
    })
    async put(@Req() req: Request, @Body() feedbackCommentDTO: FeedbackCommentDTO): Promise<FeedbackCommentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'FeedbackComment', feedbackCommentDTO.id);
        return await this.feedbackCommentService.update(feedbackCommentDTO, `${req.user?.id}`);
    }

    @Put('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Update feedbackComment with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FeedbackCommentDTO,
    })
    async putId(@Req() req: Request, @Body() feedbackCommentDTO: FeedbackCommentDTO): Promise<FeedbackCommentDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'FeedbackComment', feedbackCommentDTO.id);
        return await this.feedbackCommentService.update(feedbackCommentDTO, `${req.user?.id}`);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMINISTRATOR)
    @ApiOperation({ title: 'Delete feedbackComment' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'FeedbackComment', id);
        return await this.feedbackCommentService.deleteById(id);
    }
}
