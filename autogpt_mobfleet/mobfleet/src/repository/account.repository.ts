import { EntityRepository, OrderByCondition, Repository, SelectQueryBuilder } from 'typeorm';
import { Account } from '../domain/account.entity';
import { Logger } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {


    logger = new Logger('AccountRepository');

    public static readonly reportCols = (alias = 'account') => [
        `${alias}.id as '${alias}.id'`,
        `${alias}.name as '${alias}.name'`,
        `${alias}.email as '${alias}.email'`,
        `${alias}.admissionDate as '${alias}.admissionDate'`,
        `${alias}.createdAt as '${alias}.createdAt'`,
        `${alias}.updatedAt as '${alias}.updatedAt'`,
        `${alias}.active as '${alias}.active'`,
        `${alias}.cellPhone as '${alias}.cellPhone'`,
        `${alias}.execCommands as '${alias}.execCommands'`,
        `${alias}.blocked as '${alias}.blocked'`,
        `${alias}.employer as '${alias}.employer'`,
        `${alias}.pushConfiguration as '${alias}.pushConfiguration'`,
        `${alias}.distanceTraveled as '${alias}.distanceTraveled'`,
        `${alias}.displayLanguage as '${alias}.displayLanguage'`,
        `${alias}.blockedReason as '${alias}.blockedReason'`,
        `${alias}.blockedBy as '${alias}.blockedBy'`,
        `${alias}.blockedAt as '${alias}.blockedAt'`,
        `${alias}.deletedReason as '${alias}.deletedReason'`,
        `${alias}.deletedAt as '${alias}.deletedAt'`,
        `${alias}.deletedBy as '${alias}.deletedBy'`,
        `${alias}.lastModifiedBy as '${alias}.lastModifiedBy'`,
        `${alias}.registration as '${alias}.registration'`,
        `${alias}.hint as '${alias}.hint'`,
        `${alias}.featureFlags as '${alias}.featureFlags'`,
        `${alias}.addressZipCode as '${alias}.addressZipCode'`,
        `${alias}.addressPublicPlace as '${alias}.addressPublicPlace'`,
        `${alias}.addressNumber as '${alias}.addressNumber'`,
        `${alias}.addressStreet as '${alias}.addressStreet'`,
        `${alias}.addressComplement as '${alias}.addressComplement'`,
        `${alias}.addressCity as '${alias}.addressCity'`,
        `${alias}.addressState as '${alias}.addressState'`,
        `${alias}.cnhImage as '${alias}.cnhImage'`,
        `${alias}.profileImage as '${alias}.profileImage'`,
        `${alias}.cnhExpirationDate as '${alias}.cnhExpirationDate'`,
        `${alias}.cnhSituation as '${alias}.cnhSituation'`,
        `${alias}.registerSituation as '${alias}.registerSituation'`,
        `${alias}.analizedBy as '${alias}.analizedBy'`,
        `${alias}.analizedAt as '${alias}.analizedAt'`,
        `${alias}.customerId as '${alias}.customerId'`,
        `GROUP_CONCAT(IFNULL(vehicleGroups.name,'')) as '${alias}.vehicleGroups'`];

    public static readonly descriptiveCols = (alias = 'account') => [
        `${alias}.id as '${alias}.id'`,
        `${alias}.name as '${alias}.name'`,
        `${alias}.email as '${alias}.email'`,
        `${alias}.registration as '${alias}.registration'`];

    public static readonly minimalDescriptiveCols = (alias = 'account') => [
        `${alias}.name as '${alias}.name'`,
        `${alias}.email as '${alias}.email'`];

    async reportByStream(
        contractID: number,
        order: OrderByCondition,
        i18n?: I18nRequestScopeService): Promise<SelectQueryBuilder<Account>> {
        let qb = this.createQueryBuilder('account').withDeleted();
        return await qb.innerJoin('account.contracts', 'contracts', 'contracts.id = :contractID', { contractID })
            .leftJoin('account.vehicleGroups', 'vehicleGroups')
            .orderBy(order)
            .groupBy('account.id')
            .select(AccountRepository.reportCols('account'));
    }
}