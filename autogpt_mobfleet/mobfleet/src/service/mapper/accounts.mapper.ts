import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Account } from '../../domain/account.entity';
import { AccountCreateDTO } from '../dto/account-create.dto';
import { AccountEditDTO } from '../dto/account-edit.dto';
import { AccountListDTO } from '../dto/account-list.dto';
import { AccountV1DTO } from '../dto/account-v1.dto';
import { AccountDTO } from '../dto/account.dto';
import { MapperUtils } from './mapper.utils';

/**
 * A Accounts mapper object.
 */

export class AccountMapper {


  static fromRawEntityToDTO(entity: any): AccountDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new AccountDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields
      .filter(f => /^account_/gm.test(f))
      .map(f => [f, MapperUtils.toCamel(f.replace('account_', ''))])
      .forEach(fields => {
        const field = fields[0];
        const accountField = fields[1];
        entityDTO[accountField] = entity[field];
      });

    return entityDTO;
  }


  static async toReportLine(i18n: I18nRequestScopeService, dbLineData: any, buildHeaders = false): Promise<any> {
    if (!dbLineData) {
      return;
    }
    const entity = {} as any;
    const dto = AccountMapper.fromRawEntityToDTO(dbLineData);
    if (!buildHeaders) return dto;
    const fields = Object.getOwnPropertyNames(dto);
    const headers = [];
    const result = await Promise.all(await fields.map(async field => {
      entity[field] = dto[field];
      const header = await i18n.translate(`mobfleet.accounts.${field}`);
      headers.push({ header, key: field });
      return { field: header }
    }));
    console.log({ entity, result });
    return entity;
  }
  static fromDTOtoEntity(entityDTO: AccountDTO | AccountEditDTO): Account {
    if (!entityDTO) {
      return;
    }
    const entity = new Account();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static removeNull(entityDTO: AccountCreateDTO | AccountEditDTO): Account {
    if (!entityDTO) {
      return;
    }

    const entity = new Account();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields
      .filter(field => !!entityDTO[field])
      .forEach(field => {
        entity[field] = entityDTO[field];
      });
    return entity;
  }
  static fromCreateDTOtoEntity(entityDTO: AccountCreateDTO): Account {
    if (!entityDTO) {
      return;
    }
    const fieldsRemove = ['roles'];
    const entity = new Account();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields
      .filter(field => !fieldsRemove.includes(field))
      .forEach(field => {
        entity[field] = entityDTO[field];
      });
    return entity;
  }

  static fromCreateDTOtoV1(entityDTO: AccountCreateDTO): AccountV1DTO {
    if (!entityDTO) {
      return;
    }
    const entity: AccountV1DTO = {
      name: entityDTO.name,
      email: entityDTO.email,
      registration: entityDTO.registration,
      admission_date: entityDTO.admissionDate,
      cell_phone: entityDTO.cellPhone,
      roles: entityDTO.roles,
      contracts: entityDTO.contracts,
      displayLanguage: entityDTO.displayLanguage
    };
    return entity;
  }

  static fromEntityToDTO(entity: Account): AccountDTO {
    if (!entity) {
      return;
    }
    return plainToClass(AccountDTO, entity, { enableCircularCheck: true });
  }

  static fromDTOToListDTO(entity: AccountDTO): AccountListDTO | undefined {
    if (!entity) {
      return;
    }
    const accountList = new AccountListDTO();
    const fields = Object.getOwnPropertyNames(accountList);
    fields.forEach(field => {
      accountList[field] = entity[field];
    });
    return accountList;
  }
}
