import { BaseMapper } from './base.mapper';
import { UsedDiscountCouponAccount } from '../../domain/used-discount-coupon-account.entity';
import { UsedDiscountCouponAccountDTO } from '../dto/used-discount-coupon-account.dto';


/**
 * A UsedDiscountCouponAccount mapper object.
 */
export class UsedDiscountCouponAccountMapper {

  static fromDTOtoEntity(dto: UsedDiscountCouponAccountDTO): UsedDiscountCouponAccount {
    if (!dto) { return; }

    const entity = new UsedDiscountCouponAccount();
    const fields = Object.getOwnPropertyNames(dto);

    fields.forEach(field => { entity[field] = dto[field]; });
    return entity;
  }

  static fromEntityToDTO(entity: UsedDiscountCouponAccount): UsedDiscountCouponAccountDTO {
    if (!entity) { return; }

    const dto = new UsedDiscountCouponAccountDTO();
    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => { dto[field] = entity[field]; });
    return dto;
  }

  static fromEntities(entities: UsedDiscountCouponAccount[] = []): UsedDiscountCouponAccountDTO[] {
    return BaseMapper.fromEntities(entities, UsedDiscountCouponAccountMapper.fromEntityToDTO);
  }

  static fromDTOs(dtos: UsedDiscountCouponAccountDTO[] = []): UsedDiscountCouponAccount[] {
    return BaseMapper.fromDTOs(dtos, UsedDiscountCouponAccountMapper.fromDTOtoEntity);
  }

  static fromEntitiesWithCount(entities: [UsedDiscountCouponAccount[], number]): [UsedDiscountCouponAccountDTO[], number] {
    return BaseMapper.fromEntitiesWithCount(entities, UsedDiscountCouponAccountMapper.fromEntityToDTO);
  }

  static fromDTOsWithCount(dtos: [UsedDiscountCouponAccountDTO[], number]): [UsedDiscountCouponAccount[], number] {
    return BaseMapper.fromDTOsWithCount(dtos, UsedDiscountCouponAccountMapper.fromDTOtoEntity);
  }

}
