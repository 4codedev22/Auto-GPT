import { RoleType } from "../security";
import { AccountDTO } from "../service/dto";

const getAccountRoles = (user: AccountDTO): string[] => {
  return user?.roles?.map(r => r?.name);
}

export const accountHasRole = (user: AccountDTO, role: RoleType): boolean => {
  return getAccountRoles(user)?.includes(role);
}
