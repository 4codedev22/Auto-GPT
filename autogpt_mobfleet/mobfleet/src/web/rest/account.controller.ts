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
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AccountDTO } from '../../service/dto/account.dto';
import { AccountService } from '../../service/account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, N2_AND_HIGHER, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { AccountCreateDTO } from '../../service/dto/account-create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AccountBlockDTO } from '../../service/dto/account-block-reasondto';
import { AccountEditDTO } from '../../service/dto/account-edit.dto';
import { RegisterSituation } from '../../domain/enumeration/register-situation';
import { AccountFilterDTO } from '../../service/dto';

@Controller('v2/accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('accounts')
export class AccountController {
  logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountService) { }

  @Get('/')
  @UseGuards(ContractGuard)
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AccountDTO,
  })
  async getAll(@Req() req: Request, @Query() filter: AccountFilterDTO): Promise<AccountDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page,
      req.query.size,
      req.query.sort ?? 'accounts.id,DESC',
      req.query.search
    );
    const [results, count] = await this.accountsService.findAndCount(
      {
        skip: pageRequest.skip,
        take: pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      filter
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: AccountDTO,
  })
  async getOne(@Param('id') id: number, @Req() req: Request): Promise<AccountDTO> {
    return await this.accountsService.findByIdWithContracts(+id);
  }



  @Put('/updateRegistrationStatus/:userID/:newStatus')
  @ApiOperation({ title: 'update registration status' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  async updateRegistrationStatusst(
    @Req() req: Request,
    @Param('newStatus') newStatus: RegisterSituation,
    @Param('userID') userID: number
  ): Promise<AccountDTO> {
    const updated = await this.accountsService.updateRegisterStatus(
      +userID,
      +req.query.contractID,
      req.user,
      newStatus
    );
    HeaderUtil.addEntityUpdatedHeaders(req.res, 'Account', updated.id);
    return updated;
  }

  @PostMethod('/')
  @ApiOperation({ title: 'Create account' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AccountDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'cnhImage', maxCount: 1 },
    ]),
  )
  async post(
    @UploadedFiles() files: { profileImage?: Express.Multer.File[]; cnhImage?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() accountsDTO: AccountCreateDTO,
  ): Promise<AccountDTO> {
    const created = await this.accountsService.create(
      { profileImage: files?.profileImage?.[0], cnhImage: files?.cnhImage?.[0] },
      accountsDTO,
      +req.query.contractID,
      req.user,
      req.headers?.authorization?.replace('Bearer ', ''),
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
    return created;
  }

  @PostMethod('/approved')
  @ApiOperation({ title: 'Create account' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AccountDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @UseGuards(ContractGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'cnhImage', maxCount: 1 },
    ]),
  )
  async postApproved(
    @UploadedFiles() files: { profileImage?: Express.Multer.File[]; cnhImage?: Express.Multer.File[] },
    @Req() req: Request,
    @Body() accountsDTO: AccountCreateDTO,
  ): Promise<AccountDTO> {
    const createApproved = true;
    const created = await this.accountsService.create(
      { profileImage: files?.profileImage?.[0], cnhImage: files?.cnhImage?.[0] },
      accountsDTO,
      +req.query.contractID,
      req.user,
      req.headers?.authorization?.replace('Bearer ', ''),
      createApproved
    );
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
    return created;
  }


  @PostMethod('/report')
  @Roles(
    ...N2_AND_HIGHER
  )
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'Create Report',
  })
  async createReportByStream(@Req() req: Request): Promise<void> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 0,
      req.query.sort ?? 'account.id,DESC',
    );
    await this.accountsService.report(
      {
        order: pageRequest.sort.asOrder(),
      },
      +req.query.contractID,
      req.user
    );
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Update account' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AccountDTO,
  })
  async put(@Req() req: Request, @Body() accountsDTO: AccountDTO): Promise<AccountDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', accountsDTO.id);
    return await this.accountsService.update(accountsDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Update accounts with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AccountDTO,
  })
  @UseGuards(ContractGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'cnhImage', maxCount: 1 },
    ]),
  )
  async updateById(
    @UploadedFiles() files: { profileImage?: Express.Multer.File[]; cnhImage?: Express.Multer.File[] },
    @Req() req: Request,
    @Param('id') id: number,
    @Body() accountsDTO: AccountEditDTO,
  ): Promise<AccountDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', id);
    return await this.accountsService.updateWithImages(
      +id,
      { profileImage: files?.profileImage?.[0], cnhImage: files?.cnhImage?.[0] },
      accountsDTO,
      req.user,
      +req.query.contractID
    );
  }

  @Put('/:id/activate/:activate')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Update accounts with id' })
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AccountDTO,
  })
  async activeOrDeactive(
    @Req() req: Request,
    @Param('id') userID: number,
    @Param('activate') activate: boolean,
  ): Promise<AccountDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', userID);
    return await this.accountsService.activate(+userID, activate, req.user, +req.query.contractID);
  }
  @Put('/:id/block/:block')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Update accounts with id' })
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AccountDTO,
  })
  async blockOrUnblock(
    @Req() req: Request,
    @Param('id') userID: number,
    @Param('block') block: boolean,
    @Body() account: AccountBlockDTO,
  ): Promise<AccountDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', userID);
    return await this.accountsService.block(+userID, block, account?.reason, req.user, +req.query.contractID);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Delete account' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Account', id);
    return await this.accountsService.deleteById(id);
  }

  @Put('/deletion/request')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2)
  @ApiOperation({ title: 'Request account deletion' })
  @ApiResponse({
    status: 200,
    description: 'The account deletion was successfully requested.',
  })
  async requestAccountDeletion(@Req() req: Request): Promise<any> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', req.user?.id);
    await this.accountsService.sendAccountDeletionRequestEmail(req.user);
  }
}
