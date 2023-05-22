import { SelectQueryBuilder } from "typeorm";

export const addSelectFieldsFromFilters = (
  query: SelectQueryBuilder<any>,
  basicSelectFields: string[] = [],
  filter: any = {},
  excludes: string[] = []
) => {
  if (!filter?.fields) return query;

  let selectFields: string[] = filter.fields?.split?.(',') || [];
  selectFields = [...new Set([...selectFields, ...basicSelectFields])];

  selectFields = selectFields.filter((field: string) => !excludes.includes(field) && field);

  const parsedFields = selectFields.map((field: string) => {
    const pathWay = field.split('.');
    return pathWay?.length > 1
      ? pathWay.slice(-2).join('.')
      :`${query.alias}.${field}`;
  });

  return query.select(parsedFields);
}
