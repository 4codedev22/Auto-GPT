import { Injectable, Logger, Inject, forwardRef, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition, SelectQueryBuilder } from 'typeorm';
import { ContractDTO } from './dto/contract.dto';
import { ContractMapper } from './mapper/contract.mapper';
import { ContractRepository } from '../repository/contract.repository';
import { ContractCreateDTO } from './dto/contract-create.dto';
import { CompanyService } from './company.service';
import { AccountDTO } from './dto/account.dto';
import { AccountService } from './account.service';
import { Contract } from '../domain/contract.entity';
import { ContractStatus } from '../domain/enumeration/contract-status';
import { ContractCreateWithCompanyAndVehicleGroupsDTO } from './dto/contract-create-with-company-and-vehicle-groups.dto';
import { VehicleGroupService } from './vehicle-group.service';
import { VehicleGroupDTO } from './dto/vehicle-group.dto';
import { CompanyDTO } from './dto/company.dto';
import { ContractFilterDTO } from './dto/contract-filter.dto';
import { AccountMapper } from './mapper/accounts.mapper';

const relationshipNames = [];
relationshipNames.push('company');
relationshipNames.push('vehicleGroups');
relationshipNames.push('accounts');

@Injectable()
export class ContractService {
  logger = new Logger('ContractService');

  constructor(
    @InjectRepository(ContractRepository) private contractRepository: ContractRepository,
    private companyService: CompanyService,
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
    @Inject(forwardRef(() => VehicleGroupService))
    private vehicleGroupService: VehicleGroupService
  ) { }

  private filterByFields(queryBuilder: SelectQueryBuilder<Contract>, filters: unknown) {
    Object.keys(filters).forEach((queryKey) => {
      const queryValue = filters[queryKey];
      if (queryValue !== undefined && queryValue !== null) {
        queryBuilder = queryBuilder.andWhere(
          `contract.${queryKey} = :${queryKey}`,
          { [queryKey]: queryValue }
        )
      }
    })

    return queryBuilder
  }

  async findById(id: number, account: AccountDTO): Promise<ContractDTO | undefined> {
    let qb = this.contractRepository.createQueryBuilder('contract');
    if (this.accountService.isAdmin(account)) {
      qb = qb.where('contract.id = :id', { id });
    } else {
      qb = qb.where('contract.id = :id and accounts.id = :accountID', { accountID: account.id, id });
    }
    qb = qb
      .leftJoin('contract.accounts', 'accounts')
      .leftJoinAndSelect('contract.company', 'company')
      .leftJoinAndSelect('contract.vehicleGroups', 'vehicleGroups');
    const result = await qb.getOne();
    if (!result?.id) {
      throw new NotFoundException('Contract not found');
    }
    return ContractMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ContractDTO>): Promise<ContractDTO | undefined> {
    const result = await this.contractRepository.findOne(options);
    return ContractMapper.fromEntityToDTO(result);
  }

  async listByAccount(accountID: number): Promise<ContractDTO[]> {
    const resultList = await this.contractRepository.find({
      where: {
        status: ContractStatus.ACTIVE,
        accounts: [
          {
            id: accountID,
          },
        ],
      },
      relations: relationshipNames,
    });

    return resultList.map(contract => ContractMapper.fromEntityToDTO(contract));
  }

  async findAndCountByCompany(companyID: number | string): Promise<ContractDTO[]> {
    const options: FindManyOptions<ContractDTO> = {};
    options.where = { company: companyID, status: ContractStatus.ACTIVE };
    options.relations = ['company'];

    const [entities] = await this.contractRepository.findAndCount(options);
    return ContractMapper.fromEntities(entities);
  }

  async findAndCount(options: FindManyOptions<ContractDTO>): Promise<[ContractDTO[], number]> {
    options.relations = relationshipNames;
    options.where = { status: ContractStatus.ACTIVE, };
    const resultList = await this.contractRepository.findAndCount(options);
    return ContractMapper.fromEntitiesWithCount(resultList);
  }

  async findAndCountByAccount(
    options: FindManyOptions<ContractDTO>,
    account: AccountDTO,
    filter: ContractFilterDTO,
  ): Promise<[ContractDTO[], number]> {
    let qb = this.contractRepository.createQueryBuilder('contract');

    if (!this.accountService.isAdmin(account)) {
      qb = qb.where('accounts.id = :accountID', { accountID: account.id });
    }

    qb = this.filterByFields(qb, {
      id: filter.id,
      name: filter.name,
      status: filter.status,
      company_id: filter.company
    });

    if (filter.search) {
      qb = qb.andWhere('(contract.id like :search OR contract.name LIKE :search)', {
        search: `%${filter.search}%`,
      });
    }
    qb = qb
      .skip(options.skip)
      .take(options.take)
      .leftJoin('contract.accounts', 'accounts')
      .leftJoinAndSelect('contract.company', 'company')
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    return ContractMapper.fromEntitiesWithCount(resultList);
  }

  async findAndCountByAccountActive(
    options: FindManyOptions<ContractDTO>,
    account: AccountDTO,
    search?: string,
  ): Promise<[ContractDTO[], number]> {
    let qb = this.contractRepository.createQueryBuilder('contract')
      .where("contract.status = 'ACTIVE'");

    if (!this.accountService.isAdmin(account)) {
      qb = qb.andWhere('accounts.id = :accountID', { accountID: account.id });
    }

    if (search) {
      qb = qb.andWhere('contract.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    qb = qb
      .skip(options.skip)
      .take(options.take)
      .leftJoin('contract.accounts', 'accounts')
      .leftJoinAndSelect('contract.company', 'company')
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    return ContractMapper.fromEntitiesWithCount(resultList);
  }

  async save(contractDTO: ContractDTO, creator?: string): Promise<ContractDTO | undefined> {
    const entity = ContractMapper.fromDTOtoEntity(contractDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.contractRepository.save(entity);
    return ContractMapper.fromEntityToDTO(result);
  }

  async create(contractDTO: ContractCreateDTO, creator?: AccountDTO): Promise<ContractDTO | undefined> {
    const contract = ContractMapper.fromCreateDTOtoEntity(contractDTO);
    const company = await this.companyService.findById(contractDTO.company);
    contract.accounts = [await this.accountService.findEntityById(creator.id)];
    contract.company = company;
    if (creator) {
      contract.lastModifiedBy = creator.email;
    }
    const result = await this.contractRepository.save(contract);
    return ContractMapper.fromEntityToDTO(result);
  }

  async createWithCompanyAndVehicleGroups(contractDTO: ContractCreateWithCompanyAndVehicleGroupsDTO, creator?: AccountDTO): Promise<ContractDTO | undefined> {

    try {
      let company = await this.companyService.findByName(contractDTO.company);
      if (!company?.id) {
        try {
          company = await this.companyService.save({ name: contractDTO.company } as CompanyDTO, creator.email);
        } catch (ex) {
          this.logger.error('falha ao criar contrato', ex, 'ContractService.createWithCompanyAndVehicleGroups');
          throw new BadRequestException("Could not create company");
        }
      }

      const accounts = [await this.accountService.findEntityById(creator.id)];
      const vehicleGroupsFound: VehicleGroupDTO[] = [];
      const namesNotFound: string[] = [];
      if (contractDTO.vehicleGroups?.length) {
        for (let i in contractDTO.vehicleGroups) {
          const name = contractDTO.vehicleGroups[i];
          const fVg = await this.vehicleGroupService.findByFields({ where: { name } });
          if (fVg) {
            vehicleGroupsFound.push(fVg);
          } else {
            namesNotFound.push(name);
          }
        }
      }
      const contractCreateDTO = ContractMapper.fromDTOWithCompanyAndVehicleGroupstoDTO(contractDTO);
      if (creator) {
        contractCreateDTO.lastModifiedBy = creator.email;
      }
      let contract: ContractDTO;
      try {
        contract = await this.create(contractCreateDTO, creator);
      } catch (ex) {
        this.logger.error(ex, ex, 'Falha ao criar contrato');
        throw new BadRequestException(ex, 'contract create fail');
      }
      let newVehicleGroups: VehicleGroupDTO[] = [];
      if (namesNotFound?.length) {
        newVehicleGroups = await Promise.all(await namesNotFound.map(async n => await this.vehicleGroupService.create({ name: n }, creator, contract.id)));
      }
      const all = newVehicleGroups.concat(vehicleGroupsFound);
      contract.vehicleGroups = Array.from(new Set(all));
      contract.accounts = accounts.map(AccountMapper.fromEntityToDTO);
      contract.company = company;
      const savedEntity = await this.contractRepository.save(contract);
      return ContractMapper.fromEntityToDTO(savedEntity);
    } catch (ex) {
      this.logger.error(ex, ex, 'ContractService.createWithCompanyAndVehicleGroups');
      throw new BadRequestException(ex, 'falha ao criar contrato');
    }
  }

  async updateWithCompanyAndVehicleGroups(contractID: number, contractDTO: ContractCreateWithCompanyAndVehicleGroupsDTO, creator?: AccountDTO): Promise<ContractDTO | undefined> {

    try {
      let company = await this.companyService.findByName(contractDTO.company);
      if (!company?.id) {
        try {
          company = await this.companyService.save({ name: contractDTO.company } as CompanyDTO, creator.email);
        } catch (ex) {
          this.logger.error('falha ao criar contrato', ex, 'ContractService.createWithCompanyAndVehicleGroups');
          throw new BadRequestException("Could not create company");
        }
      }

      const vehicleGroupsFound: VehicleGroupDTO[] = [];
      const namesNotFound: string[] = [];
      if (contractDTO.vehicleGroups?.length) {
        for (let i in contractDTO.vehicleGroups) {
          const name = contractDTO.vehicleGroups[i];
          const fVg = await this.vehicleGroupService.findByFields({ where: { name } });
          if (fVg) {
            vehicleGroupsFound.push(fVg);
          } else {
            namesNotFound.push(name);
          }
        }
      }
      const contractCreateDTO = ContractMapper.fromDTOWithCompanyAndVehicleGroupstoDTO(contractDTO);
      if (creator) {
        contractCreateDTO.lastModifiedBy = creator.email;
      }
      let contract: ContractDTO;
      try {
        contract = await this.updateById(contractID, contractCreateDTO, creator);
      } catch (ex) {
        this.logger.error(ex, ex, 'Falha ao atualizar contrato');
        throw new BadRequestException(ex, 'contract update fail');
      }
      let newVehicleGroups: VehicleGroupDTO[] = [];
      if (namesNotFound?.length) {
        newVehicleGroups = await Promise.all(await namesNotFound.map(async n => await this.vehicleGroupService.create({ name: n }, creator, contract.id)));
      }
      const all = newVehicleGroups.concat(vehicleGroupsFound);
      contract.vehicleGroups = Array.from(new Set(all));
      contract.company = company;
      const savedEntity = await this.contractRepository.save(contract);
      return ContractMapper.fromEntityToDTO(savedEntity);
    } catch (ex) {
      this.logger.error(ex, ex, 'ContractService.createWithCompanyAndVehicleGroups');
      throw new BadRequestException(ex, 'falha ao atualizar contrato');
    }
  }

  async updateById(
    id: number,
    contractDTO: ContractCreateDTO,
    updater: AccountDTO,
  ): Promise<ContractDTO | undefined> {
    const entity = ContractMapper.fromCreateDTOtoEntity(contractDTO);
    const contract = await this.findById(id, updater);
    if (updater) {
      contract.lastModifiedBy = updater.email;
    }
    const result = this.contractRepository.merge(contract as Contract, entity);
    const savedEntity = await this.contractRepository.save(result);
    return ContractMapper.fromEntityToDTO(savedEntity);
  }

  async update(contractDTO: ContractDTO, updater?: string): Promise<ContractDTO | undefined> {
    const entity = ContractMapper.fromDTOtoEntity(contractDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.contractRepository.save(entity);
    return ContractMapper.fromEntityToDTO(result);
  }
}
