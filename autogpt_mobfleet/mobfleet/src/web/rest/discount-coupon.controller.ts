import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Query, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DiscountCouponDTO } from '../../service/dto/discount-coupon.dto';
import { DiscountCouponService } from '../../service/discount-coupon.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ContractGuard } from '../../security/guards/contract.guard';
import { DiscountCouponFilterDTO } from '../../service/dto/discount-coupon-filter.dto';
import { DiscountCouponValidationDTO } from '../../service/dto/discount-coupon-validation-query.dto';
import { ContractDTO } from 'src/service/dto/contract.dto';


@Controller('v2/discount-coupons')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('discount-coupons')
export class DiscountCouponController {
  logger = new Logger('DiscountCouponController');

  constructor(private readonly discountCouponService: DiscountCouponService) { }

  @PostMethod('/can-apply')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.CLIENT)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'Check if coupon can be used.',
    type: Boolean
  })
  async canApply(@Req() req: Request, @Query() query: DiscountCouponValidationDTO): Promise<DiscountCouponDTO> {
    return await this.discountCouponService.getCouponIfIsValidAndCanApply(
      +req.query.contractID,
      query.couponName,
      +req.user?.id,
      query.reservationValue,
      query.reservationDate ?? new Date().toISOString(),
    );
  }

  @Get('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DiscountCouponDTO,
  })
  async getAll(
    @Req() req: Request,
    @Query('contractID') contractID: number,
    @Query('search') search: string,
    @Query() filter: DiscountCouponFilterDTO
  ): Promise<DiscountCouponDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ?? 0,
      req.query.size ?? 20,
      req.query.sort ?? 'discountCoupon.id,ASC'
    );
    const [results, count] = await this.discountCouponService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      contractID,
      search,
      filter
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: DiscountCouponDTO,
  })
  async getOne(@Param('id') id: number): Promise<DiscountCouponDTO> {
    const coupon = await this.discountCouponService.findById(id);
    if (!coupon) { throw new BadRequestException('Coupon not found'); }

    return coupon;
  }

  @PostMethod('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Create discountCoupon' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DiscountCouponDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() discountCouponDTO: DiscountCouponDTO): Promise<DiscountCouponDTO> {
    discountCouponDTO.contract = { id: +req.query.contractID } as ContractDTO;
    const created = await this.discountCouponService.save(discountCouponDTO, req.user?.email);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'DiscountCoupon', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update discountCoupon' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DiscountCouponDTO,
  })
  async put(@Req() req: Request, @Body() discountCouponDTO: DiscountCouponDTO): Promise<DiscountCouponDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'DiscountCoupon', discountCouponDTO.id);
    return await this.discountCouponService.update(discountCouponDTO, req.user?.email);
  }

  @Put('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Update discountCoupon with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DiscountCouponDTO,
  })
  async putId(@Req() req: Request, @Body() discountCouponDTO: DiscountCouponDTO): Promise<DiscountCouponDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'DiscountCoupon', discountCouponDTO.id);
    return await this.discountCouponService.update(discountCouponDTO, req.user?.email);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(ContractGuard)
  @ApiOperation({ title: 'Delete discountCoupon' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'DiscountCoupon', id);
    return await this.discountCouponService.deleteById(id);
  }
}
