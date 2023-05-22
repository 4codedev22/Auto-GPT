import { Body, ClassSerializerInterceptor, Controller, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, NotImplementedException } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChargeDTO } from '../../service/dto/charge.dto';
import { ChargeService } from '../../service/charge.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';


@Controller('v2/charges')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('charges')
export class ChargeController {
  logger = new Logger('ChargeController');
  constructor(private readonly chargeService: ChargeService) { }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiResponse({ status: 200, description: 'List all records', type: ChargeDTO, })
  async getAll(@Req() req: Request): Promise<ChargeDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,DESC');
    const [results, count] = await this.chargeService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiResponse({ status: 200, description: 'The found record', type: ChargeDTO, })
  async getOne(@Param('id') id: number): Promise<ChargeDTO> {
    return await this.chargeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Create charge' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: ChargeDTO, })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() chargeDTO: ChargeDTO): Promise<ChargeDTO> {
    throw new NotImplementedException();
    const created = await this.chargeService.save(chargeDTO, `${req.user?.id}`);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Charge', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Update charge' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ChargeDTO, })
  async put(@Req() req: Request, @Body() chargeDTO: ChargeDTO): Promise<ChargeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Charge', chargeDTO.id);
    return await this.chargeService.update(chargeDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @ApiOperation({ title: 'Update charge with id' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ChargeDTO, })
  async putId(@Req() req: Request, @Body() chargeDTO: ChargeDTO): Promise<ChargeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Charge', chargeDTO.id);
    return await this.chargeService.update(chargeDTO, `${req.user?.id}`);
  }
}
