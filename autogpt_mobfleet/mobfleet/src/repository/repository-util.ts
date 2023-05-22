import { Brackets, SelectQueryBuilder } from "typeorm";
import { format } from 'date-fns';
import { firstHour, lastHour, DB_DATETIME_FORMAT } from './date-utils';


export type ReportExtensionType = 'xlsx' | 'pdf';
export const dateFormattedForDb = value => format(value, DB_DATETIME_FORMAT);
export const getLike = value => `%${value}%`;
export const withBrackets = (expression: string) => new Brackets(b => b.where(expression));
export const restrictContract = <T>(qb: SelectQueryBuilder<T>, contractID: number, expression: string) => qb.where(expression, { contractID });
export const filterLicensePlate = <T>(qb: SelectQueryBuilder<T>, licensePlate: string) => qb.andWhere(withBrackets('vehicle.licensePlate LIKE :licensePlate'), { licensePlate: getLike(licensePlate) });
export const filterUserEmail = <T>(qb: SelectQueryBuilder<T>, userEmail: string) => qb.andWhere(withBrackets('account.email LIKE :userEmail'), { userEmail: getLike(userEmail) });
export const restrictInitialDate = <T>(qb: SelectQueryBuilder<T>, initialDate: Date, expression: string) => qb.andWhere(withBrackets(expression), { initialDate: dateFormattedForDb(firstHour(initialDate)) });
export const restrictFinalDate = <T>(qb: SelectQueryBuilder<T>, finalDate: Date, expression: string) => qb.andWhere(withBrackets(expression), { finalDate: dateFormattedForDb(lastHour(finalDate)) });
