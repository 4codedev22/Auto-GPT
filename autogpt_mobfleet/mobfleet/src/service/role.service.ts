import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleDTO } from './dto/role.dto';
import { RoleMapper } from './mapper/role.mapper';
import { RoleRepository } from '../repository/role.repository';
import { Role } from '../domain/role.entity';
import { ContractDTO } from './dto/contract.dto';
import { AccountDTO } from './dto/account.dto';
import { Contract } from '../domain/contract.entity';

const relationshipNames = [];

@Injectable()
export class RoleService {
  logger = new Logger('RoleService');

  constructor(@InjectRepository(RoleRepository) private roleRepository: RoleRepository) { }

  async findById(id: number): Promise<RoleDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.roleRepository.findOne(id, options);
    return RoleMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RoleDTO>): Promise<RoleDTO | undefined> {
    const result = await this.roleRepository.findOne(options);
    return RoleMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RoleDTO>): Promise<[RoleDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.roleRepository.findAndCount(options);
    return RoleMapper.fromEntitiesWithCount(resultList);
  }

  async save(roleDTO: RoleDTO, creator?: string): Promise<RoleDTO | undefined> {
    try {
      const entity = RoleMapper.fromDTOtoEntity(roleDTO);
      if (creator) {
        entity.lastModifiedBy = creator;
      }
      const result = await this.roleRepository.save(entity);
      return RoleMapper.fromEntityToDTO(result);
    } catch (e) {
      this.logger.error(e, 'role save');
      throw e;
    }
  }

  async createAndGetByName(name: string): Promise<Role | undefined> {
    const entity = {
      name,
    } as Role;
    return await this.roleRepository.save(entity);
  }

  async update(roleDTO: RoleDTO, updater?: string): Promise<RoleDTO | undefined> {
    const entity = RoleMapper.fromDTOtoEntity(roleDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.roleRepository.save(entity);
    return RoleMapper.fromEntityToDTO(result);
  }



  async findByRoleAndContract(name: string, contractID: number): Promise<Role | undefined> {
    const result = await this.roleRepository.findOne({
      where: {
        name,
        authorizableType: 'Contract',
        authorizableId: contractID
      }
    });
    return result;
  }

  async findByRoleWithNulls(name: string): Promise<Role | undefined> {
    const result = await this.roleRepository.findOne({
      where: {
        name,
        authorizableType: null,
        authorizableId: null
      }
    });
    return result;
  }



  async createRolesForUser(roles: string[], contracts: Contract[], account?: AccountDTO, ): Promise<Role[] | undefined> {
    try {
      this.logger.debug(JSON.stringify({ account, roles, contracts }));
      const uniqueRoles = Array.from(new Set(roles));
      const rolesLoaded: Role[] = [];
      for (let i = 0; i < uniqueRoles?.length; i++) {
        this.logger.debug(i, 'role');
        const role = uniqueRoles[i];
        const nullRole = await this.findByRoleWithNulls(role);
        if (nullRole?.id) {
          rolesLoaded.push(nullRole);
        } else {
          const response = await this.save({
            name: role,
            authorizableId: null,
            authorizableType: null
          } as RoleDTO, account?.email ?? 'system');
          rolesLoaded.push(response);
        }


        const uniqueContractsId = Array.from(new Set(contracts?.map(c => c.id)));
        for (let k = 0; k < uniqueContractsId?.length; k++) {
          this.logger.debug(k, 'contract');
          const contractID = uniqueContractsId[k];
          const roleByContract = await this.findByRoleAndContract(role, contractID);
          if (roleByContract?.id) {
            rolesLoaded.push(roleByContract);
          } else {
            const response = await this.save({
              name: role,
              authorizableId: contractID,
              authorizableType: 'Contract'
            } as RoleDTO, account?.email ?? 'system');
            rolesLoaded.push(response);
          }
        }

      }
      return rolesLoaded;
    } catch (e) {
      this.logger.error(e, e);
      throw e;
    }
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.roleRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
