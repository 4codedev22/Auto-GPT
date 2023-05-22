import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";

type QueryBuilderByContractParams = {
  alias?: string,
  queryRunner?: QueryRunner,
  contractID?: number,
  aliasContract?: string,
  isAdmin?: boolean
}

export class ContractProtectedBaseRepository<T> extends Repository<T> {
  createQueryBuilderByContract({
    alias,
    queryRunner,
    contractID,
    aliasContract = 'contract.id',
    isAdmin = false
  }: QueryBuilderByContractParams): SelectQueryBuilder<T> {
    let qb = this.createQueryBuilder(alias, queryRunner);

    if (isAdmin) {
      return qb;
    }

    return qb.andWhere(`${aliasContract} = :contractID`, { contractID });
  }
}
