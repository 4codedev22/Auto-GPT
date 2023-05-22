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
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CommandDTO } from '../../service/dto/command.dto';
import { CommandService } from '../../service/command.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { AvailableCommands } from '../../domain/enumeration/available-commands';
import { DeviceCommandService } from '../../service/device-command.service';
import { ContractGuard } from '../../security/guards/contract.guard';
import { CommandLogDTO } from '../../service/dto/command-log.dto';
import { CommandLogSimpleDTO } from '../../service/dto/command-log.simple.dto';

@Controller('v2/commands')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('commands')
export class CommandController {
  logger = new Logger('CommandController');

  constructor(
    private readonly commandService: CommandService,
    private readonly deviceCommandService: DeviceCommandService,
  ) { }

  @Get('/')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CommandDTO,
  })
  async getAll(@Req() req: Request): Promise<CommandDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.commandService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CommandDTO,
  })
  async getOne(@Param('id') id: number): Promise<CommandDTO> {
    return await this.commandService.findById(id);
  }

  @PostMethod('/')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'Create command' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CommandDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() commandDTO: CommandDTO): Promise<CommandDTO> {
    const created = await this.commandService.save(commandDTO, `${req.user?.id}`);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Command', created.id);
    return created;
  }

  @PostMethod('/command/:vehicleId/:command/:urgent?')
  @UseGuards(ContractGuard)
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'send command to device' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CommandDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async postCommand(
    @Req() req: Request,
    @Param('command') command: string,
    @Param('vehicleId') vehicleId: number,
    @Param('urgent') urgent: boolean = true,
  ): Promise<CommandLogDTO> {
    const contractID = +req.query.contractID;
    const receivedCommand = AvailableCommands[command];
    if (!receivedCommand) {
      throw new BadRequestException(receivedCommand, 'Command is invalid');
    }
    return await this.commandService.sendCommand(contractID, req.user, +vehicleId, receivedCommand, urgent);
  }

  @Get('/command/:vehicleId')
  @UseGuards(ContractGuard)
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'send command to device' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CommandDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getCommand(@Req() req: Request, @Param('vehicleId') vehicleId: number): Promise<CommandLogDTO[]> {
    const contractID = +req.query.contractID;
    const size = +(req?.query?.size ?? 5);
    return await this.commandService.loadCommandStatus(contractID, req.user, +vehicleId, +size);
  }

  @Get('/command/simple/:vehicleId')
  @UseGuards(ContractGuard)
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.CLIENT,
    RoleType.BACKOFFICE_N1,
    RoleType.BACKOFFICE_N2,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'list command from device' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CommandLogSimpleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getSimpleCommand(@Req() req: Request, @Param('vehicleId') vehicleId: number): Promise<CommandLogSimpleDTO[]> {
    const contractID = +req.query.contractID;
    const size = +(req?.query?.size ?? 5);
    return await this.commandService.loadSimpleCommandStatus(contractID, req.user, +vehicleId, size);
  }

  @Put('/')
  @Roles(
    RoleType.ADMINISTRATOR,

    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'Update command' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CommandDTO,
  })
  async put(@Req() req: Request, @Body() commandDTO: CommandDTO): Promise<CommandDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Command', commandDTO.id);
    return await this.commandService.update(commandDTO, `${req.user?.id}`);
  }

  @Put('/:id')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'Update command with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CommandDTO,
  })
  async putId(@Req() req: Request, @Body() commandDTO: CommandDTO): Promise<CommandDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Command', commandDTO.id);
    return await this.commandService.update(commandDTO, `${req.user?.id}`);
  }

  @Delete('/:id')
  @Roles(
    RoleType.ADMINISTRATOR,
    RoleType.MANAGER,
    RoleType.SUPPORT
  )
  @ApiOperation({ title: 'Delete command' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Command', id);
    return await this.commandService.deleteById(id);
  }
}
