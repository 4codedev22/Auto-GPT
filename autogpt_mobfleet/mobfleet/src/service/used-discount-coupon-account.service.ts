import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UsedDiscountCouponAccountDTO } from '../service/dto/used-discount-coupon-account.dto';
import { UsedDiscountCouponAccountMapper } from '../service/mapper/used-discount-coupon-account.mapper';
import { UsedDiscountCouponAccountRepository } from '../repository/used-discount-coupon-account.repository';

const relationshipNames = ['account', 'reservation', 'discountCoupon'];

@Injectable()
export class UsedDiscountCouponAccountService {
  logger = new Logger('UsedDiscountCouponAccountService');

  constructor(@InjectRepository(UsedDiscountCouponAccountRepository) private usedDiscountCouponAccountRepository: UsedDiscountCouponAccountRepository) { }

  async findById(id: number, options: FindOneOptions<UsedDiscountCouponAccountDTO> = { relations: relationshipNames }): Promise<UsedDiscountCouponAccountDTO | undefined> {
    const result = await this.usedDiscountCouponAccountRepository.findOne(id, options);
    return UsedDiscountCouponAccountMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<UsedDiscountCouponAccountDTO>): Promise<UsedDiscountCouponAccountDTO | undefined> {
    options.relations = relationshipNames;
    const result = await this.usedDiscountCouponAccountRepository.findOne(options);
    return UsedDiscountCouponAccountMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<UsedDiscountCouponAccountDTO>): Promise<[UsedDiscountCouponAccountDTO[], number]> {
    options.relations = relationshipNames;
    const entitiesWithCount = await this.usedDiscountCouponAccountRepository.findAndCount(options);
    return UsedDiscountCouponAccountMapper.fromEntitiesWithCount(entitiesWithCount);
  }

  async save(usedDiscountCouponAccountDTO: UsedDiscountCouponAccountDTO, creator?: string): Promise<UsedDiscountCouponAccountDTO | undefined> {
    const entity = UsedDiscountCouponAccountMapper.fromDTOtoEntity(usedDiscountCouponAccountDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.usedDiscountCouponAccountRepository.save(entity);
    return UsedDiscountCouponAccountMapper.fromEntityToDTO(result);
  }

  async update(usedDiscountCouponAccountDTO: UsedDiscountCouponAccountDTO, updater?: string): Promise<UsedDiscountCouponAccountDTO | undefined> {
    const entity = UsedDiscountCouponAccountMapper.fromDTOtoEntity(usedDiscountCouponAccountDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.usedDiscountCouponAccountRepository.save(entity);
    return UsedDiscountCouponAccountMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.usedDiscountCouponAccountRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }

}
