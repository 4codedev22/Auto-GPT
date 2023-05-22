import { Injectable, HttpException, HttpStatus, Logger, Inject, forwardRef, NotFoundException, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Not, OrderByCondition } from 'typeorm';
import { format } from 'date-fns';
import { AccountDTO } from './dto/account.dto';
import { AccountMapper } from './mapper/accounts.mapper';
import { AccountRepository } from '../repository/account.repository';
import { RoleType, transformPassword } from '../security';
import { Account } from '../domain/account.entity';
import { AccountCreateDTO } from './dto/account-create.dto';
import { RoleService } from './role.service';
import { ContractService } from './contract.service';
import { UploadService } from '../module/shared/upload.service';
import { ContractDTO } from './dto/contract.dto';
import { VehicleGroupService } from './vehicle-group.service';
import { AccountEditDTO } from './dto/account-edit.dto';
import { BackofficeService } from '../v1/backoffice/backoffice.service';
import { PasswordChangeWithTokenDTO } from './dto/password-change-with-token.dto';
import { PasswordChangeDTO } from './dto/password-change.dto';
import { ContractStatus } from '../domain/enumeration/contract-status';
import { RegisterSituation } from '../domain/enumeration/register-situation';
import { ReportService } from './report.service';
import { MailerService } from './mailer.service'
import { I18nRequestScopeService } from 'nestjs-i18n';
import { HttpConflictError } from '../client/http-errors-protocols';
import { RoleMapper } from './mapper/role.mapper';
import { addSelectFieldsFromFilters } from '../repository/utils';
import { AccountFilterDTO } from './dto';

const relationshipNames = [];
relationshipNames.push('contracts');
relationshipNames.push('contracts.company');
relationshipNames.push('vehicleGroups');
relationshipNames.push('roles');

@Injectable()
export class AccountService {

  logger = new Logger('AccountsService', true);
  basicSelectFields = ['id', 'name']

  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountsRepository: AccountRepository,
    private readonly roleService: RoleService,
    private readonly uploadService: UploadService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    @Inject(forwardRef(() => VehicleGroupService))
    private readonly vehicleGroupService: VehicleGroupService,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => BackofficeService))
    private readonly backofficeService: BackofficeService,
    @Inject(forwardRef(() => ReportService))
    private readonly reportService: ReportService,
    private readonly i18n: I18nRequestScopeService
  ) { }

  private async validateRegistrationField(registration: string, currentUserId?: string | number): Promise<void> {
    const findedUser = await this.accountsRepository.findOne({
      where: { active: true, registration, ...(currentUserId && { id: Not(+currentUserId) }) },
    });

    if (findedUser) {
      throw new ConflictException({
        fieldName: 'registration',
        value: registration,
        message: `Registration field with value ${registration} is already registered on another account.`
      } as HttpConflictError);
    }
  }

  async findById(id: number): Promise<AccountDTO | undefined> {
    const result = await this.findEntityById(id);
    return AccountMapper.fromEntityToDTO(result);
  }
  async findByIdAndContract(id: number, contractID: number): Promise<AccountDTO | undefined> {
    let qb = this.accountsRepository.createQueryBuilder('account')
      .where('account.id = :id and contracts.id = :contractID', { contractID, id })
      .leftJoinAndSelect('account.contracts', 'contracts')
      .leftJoinAndSelect('account.vehicleGroups', 'vehicleGroups')
      .leftJoinAndSelect('account.roles', 'roles');
    return await this.returnSingleValue(qb);
  }

  private async returnSingleValue(qb): Promise<AccountDTO | undefined> {
    const result = await qb.getOne();
    return AccountMapper.fromEntityToDTO(result);
  }

  async findByUsernameAndContractWithPassword(email: string, contractID: string): Promise<AccountDTO | undefined> {
    let qb = this.accountsRepository.createQueryBuilder('account');
    qb = qb.where('account.email = :email and contracts.id = :contractID', { contractID, email });
    qb = qb
      .leftJoinAndSelect('account.contracts', 'contracts')
      .leftJoinAndSelect('account.vehicleGroups', 'vehicleGroups')
      .leftJoinAndSelect('account.roles', 'roles')
      .addSelect('account.passwordDigest');
    return await this.returnSingleValue(qb);
  }

  async findByIdWithContracts(id: number): Promise<AccountDTO | undefined> {
    let qb = this.accountsRepository.createQueryBuilder('account');
    qb = qb.where('account.id = :id', { id });
    qb = qb
      .leftJoinAndSelect('account.contracts', 'contracts')
      .leftJoinAndSelect('account.vehicleGroups', 'vehicleGroups')
      .leftJoinAndSelect('account.roles', 'roles');
    const result = await qb.getOne();
    return AccountMapper.fromEntityToDTO(result);
  }

  async findEntityById(id: number): Promise<Account | undefined> {
    const options = { relations: relationshipNames };
    return await this.accountsRepository.findOne(id, options);
  }

  async findByFields(options: FindOneOptions<AccountDTO>): Promise<AccountDTO | undefined> {
    const result = await this.accountsRepository.findOne(options);
    return AccountMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    options: FindManyOptions<AccountDTO>,
    contractID: number,
    filter?: AccountFilterDTO,
  ): Promise<[AccountDTO[], number]> {
    options.relations = relationshipNames;
    let qb = this.accountsRepository.createQueryBuilder('accounts')
      .where('contracts.id = :contractID', { contractID });

    if (filter?.search) {
      qb = qb.andWhere('(accounts.email LIKE :search OR accounts.name LIKE :search OR accounts.cellPhone LIKE :search OR accounts.id = :cleanSearch)', { search: `%${filter.search}%`, cleanSearch: filter.search });
    }
    qb = qb
      .skip(options.skip)
      .take(options.take)
      .leftJoinAndSelect('accounts.contracts', 'contracts')
      .leftJoinAndSelect('accounts.roles', 'roles')
      .orderBy(options.order as OrderByCondition);

      qb = addSelectFieldsFromFilters(qb, this.basicSelectFields, filter);

    const [entityList, count] = await qb.getManyAndCount();

    const accountsDTO: AccountDTO[] = [];
    if (entityList) {
      entityList.forEach(accounts => accountsDTO.push(AccountMapper.fromEntityToDTO(accounts)));
    }
    return [accountsDTO, count];
  }


  async report(
    options: FindManyOptions<AccountDTO>,
    contractID: number,
    creator: AccountDTO
  ): Promise<void> {
    try {
      const queryBuilder = await this.accountsRepository.reportByStream(contractID, options.order as OrderByCondition, this.i18n);
      await this.reportService.createXlsxStreamReport('accounts', creator, await queryBuilder.stream());
    } catch (error) {
      this.logger.error(error, error, 'accounts.report');
    }
  }

  async save(accountsDTO: AccountDTO, creator?: string, updatePassword = false): Promise<AccountDTO | undefined> {
    const entity = AccountMapper.fromDTOtoEntity(accountsDTO);

    if (updatePassword) {
      await transformPassword(entity);
    }
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.accountsRepository.save(entity);
    return AccountMapper.fromEntityToDTO(result);
  }

  async updateRegisterStatus(
    userID: number,
    contractID: number,
    user: AccountDTO,
    newStatus: RegisterSituation
  ): Promise<AccountDTO | undefined> {
    const entity = await this.findByIdAndContract(userID, contractID);
    
    if (!entity) {
      throw new BadRequestException("Account not found.")
    }

    if (user) {
      entity.lastModifiedBy = user.email;
    }

    switch (newStatus) {
      case RegisterSituation.DISAPPROVED:
      case RegisterSituation.PRE_REGISTRATION:
      case RegisterSituation.UNDER_ANALISYS:
        entity.active = false;
      case RegisterSituation.APPROVED:
        entity.analizedBy = user?.email;
        entity.analizedAt = new Date();
        entity.active = true;
    }

    await this.accountsRepository.update(
      userID,
      {
        active: entity.active,
        lastModifiedBy: entity.lastModifiedBy,
        analizedBy: entity.analizedBy,
        analizedAt: entity.analizedAt as any,
        registerSituation: newStatus
      },
    );

    const updatedAccount = await this.findById(entity?.id);

    const shouldSendApprovalEmail =
        entity.registerSituation === RegisterSituation.UNDER_ANALISYS && newStatus === RegisterSituation.APPROVED;

    if (shouldSendApprovalEmail) await this.sendUserApprovalEmail(updatedAccount);

    return updatedAccount;
  }


  createUserOnV1(): boolean {
    const valueOrFalse = (value: string) => !!JSON.parse(value ? value : 'false');
    return valueOrFalse(process.env.CREATE_USER_ON_V1);
  }

  async checkAndUploadFile(fileKey: string, fileOrBase64?: Express.Multer.File | string): Promise<string | null> {
    if (fileOrBase64 == null) return null;

    try {
      const isBase64 = typeof fileOrBase64 === 'string';
      const fileBuffer = isBase64 ? Buffer.from(fileOrBase64, 'base64') : fileOrBase64.buffer;
      const fileName = isBase64 ? fileKey : fileOrBase64.originalname;
      const fileData = await this.uploadService.uploadFile(fileBuffer, fileName);

      return fileData.Location;
    } catch(error) {
      this.logger.debug(error, `create-${fileKey}`);
      return null;
    }
  }

  async appCreate(
    files: { profileImage: Express.Multer.File, cnhImage: Express.Multer.File, proofOfResidenceImage: Express.Multer.File },
    accountDTO: AccountCreateDTO,
    companyID?: number,
    contractID?: number,
  ): Promise<AccountDTO | undefined> {
    let entity = AccountMapper.fromCreateDTOtoEntity(accountDTO);

    entity.cnhImage = await this.checkAndUploadFile('cnhImage', files.cnhImage);
    entity.profileImage = await this.checkAndUploadFile('profileImage', files.profileImage);
    entity.proofOfResidenceImage = await this.checkAndUploadFile('proofOfResidenceImage', files.proofOfResidenceImage);

    if (accountDTO.signatureBase64) {
      entity.signatureImage = await this.checkAndUploadFile('signatureImage', accountDTO.signatureBase64);
      accountDTO.signatureBase64 = null;
    }

    let userContract: ContractDTO;

    if (contractID) {
      const contract = await this.contractService.findByFields(
                        { where: { id: contractID, status: ContractStatus.ACTIVE } }
                      );
      userContract = contract;
    }

    if (companyID) {
      const contract = await this.contractService.findByFields(
                        { where: { company: companyID, status: ContractStatus.ACTIVE } }
                      );
      userContract = contract;
    }

    entity.contracts = [userContract];
    accountDTO.contracts = null;

    entity.roles = await this.roleService.createRolesForUser(['client'], [userContract]);
    accountDTO.roles = null;

    const [vehicleGroupList] = await this.vehicleGroupService.findAndCount({}, userContract.id);
    const [userVehicleGroup] = vehicleGroupList;

    entity.vehicleGroups = [userVehicleGroup];
    accountDTO.vehicleGroups = null;

    entity.active = false;
    entity.blocked = false;
    entity.distanceTraveled = 0;
    entity.pushConfiguration = 0;
    entity.admissionDate = format(new Date(), 'yyyy-MM-dd');
    entity.registerSituation = RegisterSituation.UNDER_ANALISYS;

    entity.passwordDigest = accountDTO.password;
    await transformPassword(entity);

    const received = AccountMapper.removeNull(accountDTO);
    const merged = this.accountsRepository.merge(entity, received);
    const created = await this.accountsRepository.save(merged);
    return AccountMapper.fromEntityToDTO(created);
  }

  async create(
    files: { profileImage: Express.Multer.File; cnhImage: Express.Multer.File },
    accountsDTO: AccountCreateDTO,
    contractID: number,
    creator: AccountDTO,
    loginToken: string,
    isApproved = false
  ): Promise<AccountDTO | undefined> {

    await this.validateRegistrationField(accountsDTO.registration);

    let entity: AccountDTO;
    if (this.createUserOnV1()) {
      const accountV1 = AccountMapper.fromCreateDTOtoV1(accountsDTO);
      const accountID = await this.backofficeService.createV1Account(accountV1, loginToken);
      entity = await this.findById(accountID);
    } else {
      entity = AccountMapper.fromEntityToDTO(AccountMapper.fromCreateDTOtoEntity(accountsDTO));
    }

    entity.cnhImage = await this.checkAndUploadFile('cnhImage', files.cnhImage);
    entity.profileImage = await this.checkAndUploadFile('profileImage', files.profileImage);

    const contractsToAdd = [] as ContractDTO[];
    if (accountsDTO.contracts) {
      accountsDTO.contracts = Array.from(new Set([+contractID, ...accountsDTO.contracts.map(c => +c)]));
      const loaded = await Promise.all(
        await accountsDTO.contracts?.map(
          async contract => await this.contractService.findById(contract, creator)
        ),
      );
      contractsToAdd.push(...loaded.filter(a => !!a));
      accountsDTO.contracts = null;
    }

    entity.contracts = contractsToAdd;


    if (accountsDTO.roles) {
      const roles = await this.roleService.createRolesForUser(accountsDTO.roles, contractsToAdd, creator);
      entity.roles = RoleMapper.fromEntities(roles);
      accountsDTO.roles = null;
    }

    if (accountsDTO.vehicleGroups) {
      entity.vehicleGroups = await Promise.all(
        await accountsDTO.vehicleGroups?.map(async vg => await this.vehicleGroupService.findById(vg))
      );
      entity.vehicleGroups = entity.vehicleGroups.filter(v => !!v);
      accountsDTO.vehicleGroups = null;
    }
    if (creator) {
      entity.lastModifiedBy = creator.email;
    }
    entity.active = false;
    entity.blocked = false;
    entity.distanceTraveled = 0;
    entity.admissionDate = accountsDTO.admissionDate;
    entity.registerSituation = RegisterSituation.UNDER_ANALISYS;
    if (isApproved) {
      entity.active = true;
      entity.registerSituation = RegisterSituation.APPROVED;
      entity.analizedBy = creator.email;
      entity.analizedAt = new Date();
    }

    const received = AccountMapper.removeNull(accountsDTO);
    const merged = this.accountsRepository.merge(entity, received);
    await this.accountsRepository.save({ ...merged, id: entity.id });
    return await this.findById(merged.id);
  }

  async activate(
    userID: number,
    activate: boolean,
    creator: AccountDTO,
    contractID: number
  ): Promise<AccountDTO | undefined> {
    const entity = await this.findByIdAndContract(userID, contractID);
    if (!entity) {
      throw new NotFoundException(`user ${userID} not found for contract ${contractID}`);
    }
    entity.active = activate;

    if (creator) {
      entity.lastModifiedBy = creator?.email;
    }
    const result = await this.accountsRepository.save(entity);
    return AccountMapper.fromEntityToDTO(result);
  }

  async block(
    userID: number,
    block: boolean,
    reason: string,
    creator: AccountDTO,
    contractID: number,
  ): Promise<AccountDTO | undefined> {
    const entity = await this.findByIdAndContract(userID, contractID);
    if (!entity) {
      throw new NotFoundException(`user ${userID} not found for contract ${contractID}`);
    }
    await this.accountsRepository.update(userID, {
      blocked: block,
      blockedReason: reason,
      blockedBy: creator.id,
      blockedAt: new Date() as any,
      lastModifiedBy: creator?.email
    });

    return await this.findById(userID);
  }

  async updateWithImages(
    userUpdateID: number,
    files: { profileImage: Express.Multer.File; cnhImage: Express.Multer.File },
    accountsDTO: AccountCreateDTO | AccountEditDTO,
    updater: AccountDTO,
    contractID: number
  ): Promise<AccountDTO | undefined> {
    const loaded = await this.findByIdAndContract(userUpdateID, contractID);

    if (!loaded?.id) {
      throw new NotFoundException(`user ${userUpdateID} not found for contract ${contractID}`);
    }

    await this.validateRegistrationField(accountsDTO.registration, userUpdateID);

    if (files?.cnhImage) {
      try {
        const cnhFile = files.cnhImage;
        const cnhData = await this.uploadService.uploadFile(cnhFile.buffer, cnhFile.originalname);
        loaded.cnhImage = cnhData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-cnhImage');
      }
    }

    if (files?.profileImage) {
      try {
        const profileFile = files.profileImage;
        const profileData = await this.uploadService.uploadFile(profileFile.buffer, profileFile.originalname);
        loaded.profileImage = profileData.Location;
      } catch (error) {
        this.logger.debug(error, 'create-profileImage');
      }
    }

    const contractsToAdd = [] as ContractDTO[];
    if (accountsDTO.contracts) {
      accountsDTO.contracts = Array.from(new Set(accountsDTO.contracts.map(c => +c)));
      const contractLoaded = await Promise.all(
        await accountsDTO.contracts?.map(
          async contract => await this.contractService.findById(contract, updater),
        ),
      );
      contractsToAdd.push(...contractLoaded);
      accountsDTO.contracts = null;
    }
    loaded.contracts = contractsToAdd;
    if (accountsDTO.roles) {
      const roles = await this.roleService.createRolesForUser(accountsDTO.roles, contractsToAdd, updater);
      loaded.roles = RoleMapper.fromEntities(roles);
      accountsDTO.roles = null;
    }
    if (accountsDTO.vehicleGroups) {
      loaded.vehicleGroups = await Promise.all(
        await accountsDTO.vehicleGroups?.map(async vg => await this.vehicleGroupService.findById(vg))
      );
      accountsDTO.vehicleGroups = null;
    }
    loaded.active = loaded.registerSituation === RegisterSituation.APPROVED;
    if (updater) {
      loaded.lastModifiedBy = updater.email;
    }


    const received = AccountMapper.removeNull(accountsDTO);
    const merged = this.accountsRepository.merge(loaded, received);
    const entity = await this.accountsRepository.save(merged);
    return AccountMapper.fromEntityToDTO(entity);
  }

  async update(accountsDTO: AccountDTO | AccountEditDTO, updater?: string): Promise<AccountDTO | undefined> {
    const entity = AccountMapper.fromDTOtoEntity(accountsDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.accountsRepository.update(entity?.id, entity);
    return await this.findById(entity?.id);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.accountsRepository.softDelete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async forgotPassword(email: string): Promise<void> {
    const account = await this.findByFields({
      where: {
        email,
      },
    });
    if (!account?.id) {
      throw new NotFoundException(`user ${email} not found`);
    }
    await this.backofficeService.forgotPasswordV1(account);
  }

  async changePassword(passwordChange: PasswordChangeDTO, loginToken: string): Promise<void> {
    await this.backofficeService.changeProfilePasswordV1(passwordChange, loginToken);
  }

  async changePasswordWithToken(passwordChange: PasswordChangeWithTokenDTO): Promise<void> {
    await this.backofficeService.changePasswordWithTokenV1(passwordChange);
  }

  async sendAccountDeletionRequestEmail(user: AccountDTO): Promise<void> {
    const result = await this.mailerService.sendAccountDeletionRequest(user);

    if (result) await this.mailerService.sendAccountDeletionRequestConfirmation(user.email);
    else throw new InternalServerErrorException('It was not possible to send a request for your account deletion, please try again');
  }

  async sendUserApprovalEmail(account: AccountDTO): Promise<void> {
    const result = await this.mailerService.sendAccountApproval(account);

    if (!result) throw new InternalServerErrorException('It was not possible to send the account activation email');
  }

  private getRoles(user: AccountDTO): string[] {
    return user?.roles?.map(r => r?.name);
  }

  private hasRole(user, role: RoleType): boolean {
    return this.getRoles(user)?.includes(role);
  }

  isAdmin(user: AccountDTO): boolean {
    return this.hasRole(user, RoleType.ADMINISTRATOR);
  }

  isManager(user: AccountDTO): boolean {
    return this.hasRole(user, RoleType.MANAGER);
  }


  isSupport(user: AccountDTO): boolean {
    return this.hasRole(user, RoleType.SUPPORT);
  }


  isBackofficeN2(user: AccountDTO): boolean {
    return this.hasRole(user, RoleType.BACKOFFICE_N2);
  }
}
