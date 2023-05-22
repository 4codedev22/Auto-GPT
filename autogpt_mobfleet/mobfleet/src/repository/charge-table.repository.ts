import { endOfDay, startOfDay } from 'date-fns';
import { EntityRepository, FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { ChargeTableFilterDTO } from '../service/dto/charge-table-filter.dto';
import { ChargeTableDTO } from '../service/dto/charge-table.dto';
import { ChargeTable } from '../domain/charge-table.entity';

@EntityRepository(ChargeTable)
export class ChargeTableRepository extends Repository<ChargeTable> {

  private filterByFields (queryBuilder: SelectQueryBuilder<ChargeTable>, filters: unknown) {
    Object.keys(filters).forEach((queryKey) => {
      const queryValue = filters[queryKey];
      if (queryValue !== undefined && queryValue !== null) {
        queryBuilder = queryBuilder.andWhere(
          `chargeTable.${queryKey} = :${queryKey}`,
          { [queryKey]:  queryValue}
        )
      }
    })

    return queryBuilder
  }

  private filterBySearch (queryBuilder: SelectQueryBuilder<ChargeTable>, search: string) {
    if (search) {
      queryBuilder = queryBuilder.andWhere('chargeTable.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder;
  }

  private filterByPeriod (queryBuilder: SelectQueryBuilder<ChargeTable>, currentPeriodStart: Date, currentPeriodEnd: Date) {
    if (currentPeriodStart && currentPeriodEnd) {
      queryBuilder = queryBuilder.andWhere(
        "chargeTable.endAt >= :currentPeriodStart",
        { currentPeriodStart: startOfDay(new Date(currentPeriodStart)) }
      )
        .andWhere(
          "chargeTable.startAt <= :currentPeriodEnd",
          { currentPeriodEnd: endOfDay(new Date(currentPeriodEnd)) }
        )
    }

    return queryBuilder;
  }

  private filterByCreatedDate (queryBuilder: SelectQueryBuilder<ChargeTable>, createdAtStart: Date, createdAtEnd: Date) {
    if (createdAtStart) {
      queryBuilder = queryBuilder.andWhere(
        "chargeTable.createdAt >= :createdAtStart",
        { createdAtStart: startOfDay(new Date(createdAtStart)) }
      )
    }

    if (createdAtEnd) {
      queryBuilder = queryBuilder.andWhere(
        "chargeTable.createdAt <= :createdAtEnd",
        { createdAtEnd: endOfDay(new Date(createdAtEnd)) }
      )
    }

    return queryBuilder;
  }

  async findAndCountWithFilters (
    options: FindManyOptions<ChargeTableDTO> & { sort: any },
    filter: Partial<ChargeTableFilterDTO>
  ): Promise<[ChargeTable[], number]> {

    let queryBuilder = this.createQueryBuilder('chargeTable')
      .andWhere("chargeTable.contract_id = :contractID", { contractID: filter.contractID })

    queryBuilder = this.filterByFields(
      queryBuilder,
      {
        id: filter.id,
        name: filter.name,
        vehicle_group_id: filter.vehicle_group_id
      }
    );

    queryBuilder = this.filterBySearch(queryBuilder, filter.search);

    queryBuilder = this.filterByPeriod(queryBuilder, filter.currentPeriodStart, filter.currentPeriodEnd);

    queryBuilder = this.filterByCreatedDate(queryBuilder, filter.createdAtStart, filter.createdAtEnd);

    const resultList = queryBuilder
      .leftJoinAndSelect("chargeTable.vehicleGroup", "vehicleGroup")
      .leftJoinAndSelect("chargeTable.chargeConditions", "chargeConditions")
      .leftJoinAndSelect("chargeTable.contract", "contract")
      .orderBy(`chargeTable.${options.sort?.property}`, options.sort?.direction as any)
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();
    
    return resultList;
  }

}
