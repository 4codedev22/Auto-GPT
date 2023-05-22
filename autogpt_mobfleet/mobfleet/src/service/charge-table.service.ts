import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { startOfDay, endOfDay, parseJSON, differenceInSeconds, isBefore } from 'date-fns';

import { SecondsToUnit } from '../domain/enumeration/charge-unit';

import { ChargeTableMapper } from '../service/mapper/charge-table.mapper';

import { ChargeTableRepository } from '../repository/charge-table.repository';

import { Sort } from '../domain/base/pagination.entity';
import { ChargeTable } from '../domain/charge-table.entity';

import { ChargeTableDTO } from '../service/dto/charge-table.dto';
import { ChargeTableFilterDTO } from './dto/charge-table-filter.dto';
import { ChargeConditionDTO } from './dto/charge-condition.dto';
import { exit } from 'process';

const relationshipNames = ['vehicleGroup', 'contract', 'chargeConditions'];

@Injectable()
export class ChargeTableService {
  logger = new Logger('ChargeTableService');

  constructor(@InjectRepository(ChargeTableRepository) private chargeTableRepository: ChargeTableRepository) { }

  async find(contractID: number, groupId: number, date: Date = new Date()): Promise<ChargeTableDTO> {
    try {
      const chargeTable = await this.chargeTableRepository.createQueryBuilder('chargeTable')
        .leftJoinAndSelect('chargeTable.chargeConditions', 'chargesConditions')
        .where("chargeTable.contract_id = :contractID", { contractID })
        .andWhere("chargeTable.vehicle_group_id = :groupId", { groupId })
        .andWhere("chargeTable.start_at <= :date", { date })
        .andWhere("chargeTable.end_at >= :date", { date })
        .getOneOrFail();
      const chargeTableDTO = ChargeTableMapper.fromEntityToDTO(chargeTable);
      return chargeTableDTO;
    } catch (error) {
      throw new BadRequestException('There is no charge table for this vehicle, contact the manager');
    }
  }

  async findById(id: number): Promise<ChargeTableDTO | undefined> {
    const result = await this.chargeTableRepository.findOne(id, { relations: relationshipNames });

    if (!result) {
      throw new NotFoundException();
    }

    return ChargeTableMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChargeTableDTO>): Promise<ChargeTableDTO | undefined> {
    const result = await this.chargeTableRepository.findOne(options);
    return ChargeTableMapper.fromEntityToDTO(result);
  }

  async findManyActive(
    options: FindManyOptions<ChargeTableDTO> & { sort: Sort, contractID: number, vehicleGroupId: number },
    date: Date = new Date()
  ): Promise<[ChargeTableDTO[], number]> {
    const { contractID, vehicleGroupId, take, skip, sort } = options;
    let queryBuilder = this.chargeTableRepository.createQueryBuilder('chargeTable')
      .andWhere("chargeTable.contract_id = :contractID", { contractID })

    if (vehicleGroupId) {
      queryBuilder = queryBuilder.andWhere("chargeTable.vehicle_group_id = :vehicleGroupId", { vehicleGroupId })
    }

    const resultList = await queryBuilder
      .andWhere("chargeTable.startAt <= :date", { date })
      .andWhere("chargeTable.endAt >= :date", { date })
      .leftJoinAndSelect("chargeTable.vehicleGroup", "vehicleGroup")
      .leftJoinAndSelect("chargeTable.chargeConditions", "chargeConditions")
      .offset(skip)
      .limit(take)
      .orderBy(`chargeTable.${sort?.property}`, sort?.direction as any)
      .getManyAndCount();

    const [chargeTables, count] = resultList;

    let chargeTableDTOs: ChargeTableDTO[] = [];
    if (chargeTables) {
      chargeTableDTOs = chargeTables.map(chargeTable => ChargeTableMapper.fromEntityToDTO(chargeTable));
    }

    return [chargeTableDTOs, count];
  }

  async findAndCount(
    options: FindManyOptions<ChargeTableDTO> & { sort: Sort },
    filter: ChargeTableFilterDTO
  ): Promise<[ChargeTableDTO[], number]> {
    options.relations = relationshipNames;

    const resultList = await this.chargeTableRepository.findAndCountWithFilters(
      options,
      {
        contractID: filter.contractID,
        createdAtEnd: filter.createdAtEnd,
        createdAtStart: filter.createdAtStart,
        currentPeriodEnd: filter.currentPeriodEnd,
        currentPeriodStart: filter.currentPeriodStart,
        id: filter.id,
        name: filter.name,
        search: filter.search,
        vehicle_group_id: filter.vehicle_group_id,
      }
    );

    const [chargeTables, count] = resultList;

    let chargeTableDTOs: ChargeTableDTO[] = [];
    if (chargeTables) {
      chargeTableDTOs = chargeTables.map(chargeTable => ChargeTableMapper.fromEntityToDTO(chargeTable));
    }

    return [chargeTableDTOs, count];
  }

  async save(chargeTableDTO: ChargeTableDTO, creator?: string): Promise<ChargeTableDTO | undefined> {
    const entity = ChargeTableMapper.fromDTOtoEntity(chargeTableDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }

    await this.checkIfEntityPeriodIsValid(entity);

    const result = await this.chargeTableRepository.save(entity);
    return ChargeTableMapper.fromEntityToDTO(result);
  }

  async update(chargeTableDTO: ChargeTableDTO, updater?: string): Promise<ChargeTableDTO | undefined> {
    const entity = ChargeTableMapper.fromDTOtoEntity(chargeTableDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }

    await this.checkIfEntityPeriodIsValid(entity);

    const result = await this.chargeTableRepository.save(entity);
    return ChargeTableMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.chargeTableRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new NotFoundException('Error, entity not deleted!');
    }
    return;
  }

  async getOneByContractVehicleGroupAndPeriod({ contract, vehicleGroup, startAt, endAt, id }: Partial<ChargeTable | ChargeTableDTO>) {
    let queryBuilder = this.chargeTableRepository.createQueryBuilder('chargeTable')
      .andWhere("chargeTable.contract_id = :contractID", { contractID: contract })
      .andWhere("chargeTable.vehicle_group_id = :vehicleGroup", { vehicleGroup })
      .andWhere(
        "chargeTable.endAt >= :currentPeriodStart",
        { currentPeriodStart: startOfDay(new Date(startAt)) }
      )
      .andWhere(
        "chargeTable.startAt <= :currentPeriodEnd",
        { currentPeriodEnd: endOfDay(new Date(endAt)) }
      )

    if (id) {
      queryBuilder = queryBuilder.andWhere("chargeTable.id != :id", { id })
    }

    const chargeTable = await queryBuilder.getOne();

    return ChargeTableMapper.fromEntityToDTO(chargeTable);
  }

  async checkIfEntityPeriodIsValid(entity: ChargeTable) {
    if (isBefore(parseJSON(entity.endAt), parseJSON(entity.startAt))) {
      throw new BadRequestException('Date of start should be before date of end');
    }
    const entityFound = await this.getOneByContractVehicleGroupAndPeriod(entity);
    if (entityFound) {
      throw new BadRequestException('Unable to create a charge table with another open in the same period.');
    }
  }

  /**
   * Calculate the charge for a vehicle, this does not take into account the kilometers traveled, fuel consumption, etc.
   * DO NOT use this method to calculate the final charge of a vehicle
   * 
   * @param chargeTable The charge table that will be used to calculate the charge
   * @param initialDate The initial date of the charge
   * @param finalDate The final date of the charge
   * @returns 
   */
  previewChargeValue(chargeTable: ChargeTableDTO, initialDate: Date, finalDate: Date): number {
    const initialValue = chargeTable.initialChargeCents;
    const timeCharge = this.calculateTimeCharge(chargeTable, initialDate, finalDate);

    return initialValue + timeCharge.totalPriceCents;
  }

  /**
   * Calculate the charge for a preiod of time.
   * 
   * @param chargeTable The charge table that will be used to calculate the charge
   * @param initialDate The initial date of the period
   * @param finalDate The final date of the period
   * @returns 
   */
  calculateTimeCharge(chargeTable: ChargeTableDTO, initialDate: Date, finalDate: Date): { chargeCondition: ChargeConditionDTO; timeConsumedInUnits: number; aditionalSteps: number; totalChargableUnits: number; totalPriceCents: number; } {
    const timeConsumedSeconds = (new Date(finalDate).getTime() - new Date(initialDate).getTime()) / 1000;
    
    const unit = chargeTable.chargeUnit;
    const timeConditions = chargeTable.chargeConditions;

    if (timeConsumedSeconds <= 0) {
      return {
        chargeCondition: null,
        timeConsumedInUnits: 0,
        aditionalSteps: 0,
        totalChargableUnits: 0,
        totalPriceCents: 0,
      };
    }

    const timeConsumedInUnits = SecondsToUnit(timeConsumedSeconds, unit);
    let selectedChargeCondition: ChargeConditionDTO = null;
    let lastCondition: ChargeConditionDTO = null;
    const sortedConditions = timeConditions.sort((a, b) => a.executeChargeFrom - b.executeChargeFrom)
    for (const condition of sortedConditions) {
      if (!selectedChargeCondition) {
        selectedChargeCondition = condition;
      }

      // If there is a condition that the time consumed is between the executeChargeFrom and executeChargeTo
      if (timeConsumedInUnits >= condition.executeChargeFrom && timeConsumedInUnits <= condition.executeChargeTo) {
        selectedChargeCondition = condition;
        break;
      }

      // If the current checked condition has a executeChargeFrom greater than the time consumed 
      // and the last condition has a executeChargeTo less than the time consumed
      if (condition.executeChargeFrom > timeConsumedInUnits && lastCondition?.executeChargeTo < timeConsumedInUnits) {
        selectedChargeCondition = lastCondition;
        break;
      }

      lastCondition = condition;
    }

    // const chargeCondition = timeConditions.find(condition => {
    //   return timeConsumedInUnits >= condition.executeChargeFrom && timeConsumedInUnits <= condition.executeChargeTo;
    // });

    const chargeCondition = selectedChargeCondition;
    const pricePerUnitCents = chargeCondition.chargeValueCents;
    const minChargableUnits = chargeCondition.minChargeUnit;
    const aditionalChageUnits = chargeCondition.additionalChargeUnit;

    let totalChargableUnits = minChargableUnits;
    const aditionalSteps = Math.ceil((timeConsumedInUnits - minChargableUnits) / aditionalChageUnits);
    if (aditionalSteps >= 1) totalChargableUnits += aditionalSteps * aditionalChageUnits;
    const timeTotalPriceCents = totalChargableUnits * pricePerUnitCents;

    return {
      chargeCondition: chargeCondition,
      timeConsumedInUnits,
      aditionalSteps,
      totalChargableUnits,
      totalPriceCents: timeTotalPriceCents,
    };
  }

  /**
   * Calculate the charge for the kilometers traveled by a vehicle.
   * 
   * @param chargeTable The charge table that will be used to calculate the charge
   * @param initialKM The initial kilometers of the vehicle
   * @param finalKM The final kilometers of the vehicle
   * @returns 
   */
  calculateDistanceCharge(chargeTable: ChargeTableDTO, initialKM: number, finalKM: number): { initialKM: number; finalKM: number; priceCents: number; totalPriceCents: number; } {
    let distanceTraveled = finalKM - initialKM;
    if (distanceTraveled <= 0) { distanceTraveled = 0; }

    const priceCents = chargeTable.odometerPriceCents;
    const totalPriceCents = distanceTraveled * priceCents;

    return {
      initialKM,
      finalKM,
      priceCents,
      totalPriceCents,
    };
  }

  /**
   * Calculate the charge for the fuel consumed by a vehicle.
   * 
   * @param chargeTable The charge table that will be used to calculate the charge
   * @param initialPercent The initial percent of fuel in the vehicle
   * @param finalPercent The final percent of fuel in the vehicle
   * @param capacity The capacity of the vehicle
   * @returns 
   */
  calculateFuelConsumptionCharge(chargeTable: ChargeTableDTO, initialPercent: number, finalPercent: number, capacity: number = 100): { capacity: number; initialPercent: number; finalPercent: number; consumed: number; priceCents: number; totalPriceCents: number; } {

    const fuelConsumedPecent = (finalPercent - initialPercent) / 100;
    const fuelTolerancePercent = chargeTable.fuelTolerance / 100;
    const chargeFuel = (fuelConsumedPecent + fuelTolerancePercent) <= 0;

    if (!chargeFuel) {
      return {
        capacity,
        initialPercent: initialPercent,
        finalPercent: finalPercent,
        consumed: 0,
        priceCents: 0,
        totalPriceCents: 0
      };
    }

    const fuelPriceCents = chargeTable.fuelPriceCents;
    const fuelConsumed = capacity * Math.abs(fuelConsumedPecent);
    const fuelTotalPriceCents = fuelConsumed * fuelPriceCents;
    return {
      capacity,
      initialPercent: initialPercent,
      finalPercent: finalPercent,
      consumed: fuelConsumed,
      priceCents: fuelPriceCents,
      totalPriceCents: fuelTotalPriceCents
    };
  }

}
