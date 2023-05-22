import { DiscountCoupon } from '../../domain/discount-coupon.entity';
import { DiscountCouponDTO } from '../dto/discount-coupon.dto';


/**
 * A DiscountCoupon mapper object.
 */
export class DiscountCouponMapper {

  static fromDTOtoEntity (entityDTO: DiscountCouponDTO): DiscountCoupon {
    if (!entityDTO) {
      return;
    }
    let entity = new DiscountCoupon();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: DiscountCoupon): DiscountCouponDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new DiscountCouponDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    entityDTO['quantityUsed'] = entityDTO.usedDiscountCouponAccounts?.length;
    delete entityDTO['usedDiscountCouponAccounts'];

    return entityDTO;
  }
}
