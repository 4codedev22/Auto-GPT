import {
  ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, UseGuards, Req, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { Request } from '../../client/request';
import { AuthGuard, CompanyGuard, Roles, RolesGuard, RoleType } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

import { CardDTO } from '../../service/dto/card.dto';
import { CardService } from '../../service/card.service';

@Controller('v2/cards')
@UseGuards(AuthGuard, RolesGuard, CompanyGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('cards')
export class CardController {
  logger = new Logger('AlertController');

  constructor(private readonly cardService: CardService) { }

  @Get('/token')
  @Roles(RoleType.ADMINISTRATOR, RoleType.CLIENT)
  @ApiOperation({ title: 'Get public token.' })
  @ApiResponse({ status: 201, description: 'The token has been successfully fetched.', type: '{ publicToken: string; }' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getToken(@Req() req: Request): Promise<{ publicToken: string }> {
    const companyID = +req.query.companyID;
    const token = await this.cardService.getToken(companyID);
    return { publicToken: token };
  }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.CLIENT)
  @ApiOperation({ title: 'List current user cards' })
  @ApiResponse({ status: 200, description: 'List current user cards', type: `CardDTO[]`, })
  async getAll(@Req() req: Request): Promise<CardDTO[]> {
    const companyID = +req.query.companyID;
    const user = req.user;

    return this.cardService.list(companyID, user);
  }

  @Get('/account/:accountId')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'List user cards by account id' })
  @ApiResponse({ status: 200, description: 'List current user cards', type: `CardDTO[]`, })
  async getAllByAccountId(@Req() req: Request, @Param('accountId') accountId: number): Promise<CardDTO[]> {
    return this.cardService.listByAccountId(+accountId, +req.query.companyID);
  }

  @PostMethod('/:token')
  @Roles(RoleType.ADMINISTRATOR, RoleType.CLIENT)
  @ApiOperation({ title: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'The card has been successfully created.', type: CardDTO })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Param('token') cardToken: string): Promise<CardDTO> {
    const companyID = +req.query.companyID;
    const user = req.user;
    return this.cardService.create(companyID, user, cardToken);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.CLIENT)
  @ApiOperation({ title: 'Delete card' })
  @ApiResponse({ status: 204, description: 'The card has been successfully deleted.', type: CardDTO })
  async deleteByToken(@Req() req: Request, @Param('id') cardId: string): Promise<CardDTO> {
    const companyID = +req.query.companyID;
    const user = req.user;
    return this.cardService.delete(companyID, user, cardId);
  }
}

