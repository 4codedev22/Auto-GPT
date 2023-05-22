'use strict';

import { RoleDTO } from "../service/dto/role.dto";

export enum RoleType {
  CLIENT = 'client',
  ADMINISTRATOR = 'admin',
  SUPPORT = 'support',
  BACKOFFICE_N1 = 'backoffice_n1',
  BACKOFFICE_N2 = 'backoffice_n2',
  MANAGER = 'manager',
}

export const ALL_ROLES: ReadonlyArray<RoleType> = [RoleType.CLIENT, RoleType.ADMINISTRATOR, RoleType.SUPPORT, RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2, RoleType.MANAGER];
export const ALL_BACKOFFICE: ReadonlyArray<RoleType> = [RoleType.BACKOFFICE_N1, RoleType.BACKOFFICE_N2, RoleType.MANAGER, RoleType.ADMINISTRATOR];
export const N2_AND_HIGHER: ReadonlyArray<RoleType> = [RoleType.BACKOFFICE_N2, RoleType.MANAGER, RoleType.ADMINISTRATOR];
export const MANAGER_AND_HIGHER: ReadonlyArray<RoleType> = [RoleType.MANAGER, RoleType.ADMINISTRATOR];
export const BACKOFFICE_OR_SUPPORT = [...ALL_BACKOFFICE, RoleType.SUPPORT];

const _hasRole = (userRoles: string[], roles: RoleType[] | ReadonlyArray<RoleType>): boolean => {
  if (!userRoles) return false;
  if (!roles) return false;

  return roles.some(role => userRoles.includes(role));
}

export const hasRole = (userRoles: RoleDTO[], roles: RoleType[] | ReadonlyArray<RoleType>): boolean => {
  const userRolesStr = userRoles.map(role => role.name.toLowerCase())
  return _hasRole(userRolesStr, roles);
}
