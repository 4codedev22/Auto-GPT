import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';

import { CompanyDTO } from './dto/company.dto';
import { CompanyNoAuthDTO } from './dto/company-no-auth.dto';

import { CompanyMapper } from './mapper/company.mapper';
import { CompanyNoAuthMapper } from './mapper/company-no-auth.mapper';

import { CompanyRepository } from '../repository/company.repository';

const relationshipNames = [];

@Injectable()
export class CompanyService {
  logger = new Logger('CompanyService');

  constructor(@InjectRepository(CompanyRepository) private companyRepository: CompanyRepository) { }

  async findById(id: number): Promise<CompanyDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.companyRepository.findOne(id, options);
    return CompanyMapper.fromEntityToDTO(result);
  }

  async findByName(name: string): Promise<CompanyDTO | undefined> {
    const options = { relations: relationshipNames, where: { name } };
    const result = await this.companyRepository.findOne(options);
    return CompanyMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<CompanyDTO>): Promise<CompanyDTO | undefined> {
    const result = await this.companyRepository.findOne(options);
    return CompanyMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<CompanyDTO>, search: string): Promise<[CompanyDTO[], number]> {
    options.relations = relationshipNames;
    let qb = this.companyRepository.createQueryBuilder('company');
    if (search) {
      qb = qb.where('company.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    qb = qb
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    return CompanyMapper.fromEntitiesWithCount(resultList);
  }

  async save(companyDTO: CompanyDTO, creator?: string): Promise<CompanyDTO | undefined> {
    const entity = CompanyMapper.fromDTOtoEntity(companyDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.companyRepository.save(entity);
    return CompanyMapper.fromEntityToDTO(result);
  }

  async update(companyDTO: CompanyDTO, updater?: string): Promise<CompanyDTO | undefined> {
    const entity = CompanyMapper.fromDTOtoEntity(companyDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.companyRepository.save(entity);
    return CompanyMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.companyRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async getContracts(companyId: number): Promise<CompanyNoAuthDTO> {
    const company = await this.companyRepository.findOne(companyId, { relations: ['contracts'] });
    if (!company) { throw new HttpException('Company not found', HttpStatus.NOT_FOUND); }
    
    return CompanyNoAuthMapper.fromEntity(company);
  }

}
