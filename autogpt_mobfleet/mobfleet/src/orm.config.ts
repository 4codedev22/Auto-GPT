
import dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

import { ActiveStorageAttachment } from './domain/active-storage-attachment.entity';
import { ActiveStorageBlob } from './domain/active-storage-blob.entity';
import { Alert } from './domain/alert.entity';
import { ChargeTable } from './domain/charge-table.entity';
import { Checklist } from './domain/checklist.entity';
import { CommandLog } from './domain/command-log.entity';
import { Command } from './domain/command.entity';
import { Company } from './domain/company.entity';
import { Contract } from './domain/contract.entity';
import { Damage } from './domain/damage.entity';
import { FeedbackComment } from './domain/feedback-comment.entity';
import { Feedback } from './domain/feedback.entity';
import { Maintenance } from './domain/maintenance.entity';
import { NotificationAccount } from './domain/notification-account.entity';
import { Rating } from './domain/rating.entity';
import { ReservationAccount } from './domain/reservation-account.entity';
import { Reservation } from './domain/reservation.entity';
import { Role } from './domain/role.entity';
import { RpushApp } from './domain/rpush-app.entity';
import { RpushFeedback } from './domain/rpush-feedback.entity';
import { RpushNotification } from './domain/rpush-notification.entity';
import { SmsToken } from './domain/sms-token.entity';
import { VehicleGroup } from './domain/vehicle-group.entity';
import { VehicleManufacturer } from './domain/vehicle-manufacturer.entity';
import { VehicleModel } from './domain/vehicle-model.entity';
import { VehicleStatusLog } from './domain/vehicle-status-log.entity';
import { Vehicle } from './domain/vehicle.entity';
import { Location } from './domain/location.entity';
import { Account } from './domain/account.entity';
import { Config } from './domain/config.entity';
import { Notification } from './domain/notification.entity';
import { ArInternalMetadata } from './domain/ar-internal-metadata.entity';
import { ChargeCondition } from './domain/charge-condition.entity';
import { DiscountCoupon } from './domain/discount-coupon.entity';
import { Charge } from './domain/charge.entity';
import { Report } from './domain/report.entity';
import { UsedDiscountCouponAccount } from './domain/used-discount-coupon-account.entity';

import { UpdateDatabase1645733625038 } from './migrations/1645733625038-update_database';
import { addingContractIdToVehicle1645797399359 } from './migrations/1645797399359-adding_contract_id_to_vehicle';
import { changingContractUUIDSize1646327172186 } from './migrations/1646327172186-changingContractUUIDSize';
import { changingRpushNotificationNotificationsSize1646415290047 } from './migrations/1646415290047-changingRpushNotificationNotificationsSize';
import { changingRpushColumnTypes1646417112758 } from './migrations/1646417112758-changingRpushColumnTypes';
import { changingRpushNotificationBooleanColumnTypes1646779485945 } from './migrations/1646779485945-changingRpushNotificationBooleanColumnTypes';
import { changingDamageActiveToDamegeSolved1646930146864 } from './migrations/1646930146864-changingDamageActiveToDamegeSolved';
import { changingRpushNotificationBooleanColumnTypesAgain1646936969263 } from './migrations/1646936969263-changingRpushNotificationBooleanColumnTypesAgain';
import { AddingHotspotsToVehicle1647642145003 } from './migrations/1647642145003-AddingHotspotsToVehicle';
import { AddingDestinyLocationToReservation1647644216617 } from './migrations/1647644216617-AddingDestinyLocationToReservation';
import { AddingStatusToContract1648242903722 } from './migrations/1648242903722-AddingStatusToContract';
import { FixingDefaultUUIDContractAndCompany1648249932125 } from './migrations/1648249932125-FixingDefaultUUIDContractAndCompany';
import { AddingHasKeyholderToVehicle1648250951193 } from './migrations/1648250951193-AddingHasKeyholderToVehicle';
import { AddingOpeningHoursToLocation1648482731621 } from './migrations/1648482731621-AddingOpeningHoursToLocation';
import { AddingTimezoneToLocation1648492848276 } from './migrations/1648492848276-AddingTimezoneToLocation';
import { AddingInProgressReservationAsFK1648664330907 } from './migrations/1648664330907-AddingInProgressReservationAsFK';
import { UpdationgSystemInRoles1648735119824 } from './migrations/1648735119824-UpdationgSystemInRoles';
import { AddingTypeToDamage1649348238284 } from './migrations/1649348238284-AddingTypeToDamage';
import { IncreseColumnsLengthOnVehicle1649789538831 } from './migrations/1649789538831-IncreseColumnsLengthOnVehicle';
import { AddingAddressToAccount1649881031551 } from './migrations/1649881031551-AddingAddressToAccount';
import { AddingImagesToAccount1649885141524 } from './migrations/1649885141524-AddingImagesToAccount';
import { AddingVehicleGroupsToAccount1650309192719 } from './migrations/1650309192719-AddingVehicleGroupsToAccount';
import { FixingBooleanTypeToAllEntities1650405836423 } from './migrations/1650405836423-FixingBooleanTypeToAllEntities';
import { ChangingCommandsAndCommandLogsTables1650511511192 } from './migrations/1650511511192-ChangingCommandsAndCommandLogsTables';
import { ChangingCommandsNameAndAddTtl1650645322382 } from './migrations/1650645322382-ChangingCommandsNameAndAddTtl';
import { AddingAllDefaultCommands1650664565177 } from './migrations/1650664565177-AddingAllDefaultCommands';
import { AddingImagesAndSolutionToDamage1650822922030 } from './migrations/1650822922030-AddingImagesAndSolutionToDamage';
import { ChangingContractsToContractInDamage1650837116697 } from './migrations/1650837116697-ChangingContractsToContractInDamage';
import { AddingAccountNewFields1651007782195 } from './migrations/1651007782195-AddingAccountNewFields';
import { ChangingCnhSituation1651120243623 } from './migrations/1651120243623-ChangingCnhSituation';
import { AddingDeletedAtToAllEntities1651358752393 } from './migrations/1651358752393-AddingDeletedAtToAllEntities';
import { AddingDataToVehicleManufacturerAndVehicleModel1651523301737 } from './migrations/1651523301737-AddingDataToVehicleManufacturerAndVehicleModel';
import { ChangingVehicleLogStatusToEnum1652132401961 } from './migrations/1652132401961-ChangingVehicleLogStatusToEnum';
import { ChangingReservationStatusInVehicleEntity1652147048647 } from './migrations/1652147048647-ChangingReservationStatusInVehicleEntity';
import { AddingChargeTable1655372280658 } from './migrations/1655372280658-AddingChargeTable';
import { AddingCustomerIdToAccounts1656015216696 } from './migrations/1656015216696-AddingCustomerIdToAccounts';
import { AddPaymentConfigurationToCompanies1656026596303 } from './migrations/1656026596303-AddPaymentConfigurationToCompanies';
import { RenameCostumerIDToCustomerID1656092172973 } from './migrations/1656092172973-RenameCostumerIDToCustomerID';
import { AddPaymentEnabledToCompanies1656439196032 } from './migrations/1656439196032-AddPaymentEnabledToCompanies';
import { AddReportEntity1657230455297 } from './migrations/1657230455297-AddReportEntity';
import { AddGeneratedToUUIDOnReports1657231598307 } from './migrations/1657231598307-AddGeneratedToUUIDOnReports';
import { ChangeVehicleModeltoVehicleGroupAtChargeTable1657250385050 } from './migrations/1657250385050-ChangeVehicleModeltoVehicleGroupAtChargeTable';
import { AddPaymentInfoToReservations1657525804042 } from './migrations/1657525804042-AddPaymentInfoToReservations';
import { AddingChargeConditionsAndFixingChargeTable1657525804043 } from './migrations/1657525804043-AddingChargeConditionsAndFixingChargeTable';
import { UpdatingReportEntity1657502940860 } from './migrations/1657502940860-UpdatingReportEntity';
import { AddIsEmptyToReport1657525804040 } from './migrations/1657525804040-AddIsEmptyToReport';
import { AddPaymentDescriptorToCompanies1657525804041 } from './migrations/1657525804041-AddPaymentDescriptorToCompanies';
import { AddDetailedPaymentInfoToReservation1657525804044 } from './migrations/1657525804044-AddDetailedPaymentInfoToReservation';
import { UpdatingEntitiesAndAddingColumns1657654953061 } from './migrations/1657654953061-UpdatingEntitiesAndAddingColumns';
import { RemovingUndesiredTables1657655597195 } from './migrations/1657655597195-RemovingUndesiredTables';
import { CreateChargesTable1657749331644 } from './migrations/1657749331644-CreateChargesTable';
import { AddChargeType1657822980683 } from './migrations/1657822980683-AddChargeType';
import { AddWhatsAppNumberToContract1659534292462 } from './migrations/1659534292462-AddWhatsAppNumberToContract';
import { AddFieldsToDiscountCouponAndAddUsedDiscountCoupon1659287465936 } from './migrations/1659287465936-AddFieldsToDiscountCouponAndAddUsedDiscountCoupon';
import { parse } from './json-util';
import { UpdateCommandNamesEnum1660248894796 } from './migrations/1660248894796-UpdateCommandNamesEnum';
import { InsertOpenTrunkToCommands1660251281622 } from './migrations/1660251281622-InsertOpenTrunkToCommands';
import { ChangeChargeOrderStatusEnum1661279019928 } from './migrations/1661279019928-ChangeChargeOrderStatusEnum';
import { AddPaymentMethodFieldToCHarge1662416750467 } from './migrations/1662416750467-AddPaymentMethodFieldToCHarge';
import { AddProofOfResidenceImageFieldToAccount1666877193221 } from './migrations/1666877193221-AddProofOfResidenceImageFieldToAccount';
import { UpdatingAlerts1669087399875 } from './migrations/1669087399875-UpdatingAlerts';
import { UpdatingVehicle1669339858560 } from './migrations/1669339858560-UpdatingVehicle';
import { AddReceiverFieldToSmsToken1669835053281 } from './migrations/1669835053281-AddReceiverFieldToSmsToken';
import { UpdateAlertSchemeAndCreateIndex1672172471561 } from './migrations/1672172471561-UpdateAlertSchemeAndCreateIndex';
import { ChangeAlertIndex1672178780749 } from './migrations/1672178780749-ChangeAlertIndex';
import { RemoveAlertQtyFromVehicle1672199098799 } from './migrations/1672199098799-RemoveAlertQtyFromVehicle';
import { AddHasDoorStatusToVehicle1679487050642 } from './migrations/1679487050642-AddHasDoorStatusToVehicle';

const ormConfig = (): TypeOrmModuleOptions => {
  const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [
      Account,
      ActiveStorageAttachment,
      ActiveStorageBlob,
      ArInternalMetadata,
      Alert,
      ChargeTable,
      ChargeCondition,
      Checklist,
      CommandLog,
      Command,
      Company,
      Config,
      Contract,
      Damage,
      FeedbackComment,
      Feedback,
      Location,
      Maintenance,
      NotificationAccount,
      Notification,
      Rating,
      ReservationAccount,
      Reservation,
      Role,
      RpushApp,
      RpushFeedback,
      RpushNotification,
      SmsToken,
      VehicleGroup,
      VehicleManufacturer,
      VehicleModel,
      VehicleStatusLog,
      Vehicle,
      DiscountCoupon,
      Report,
      Charge,
      UsedDiscountCouponAccount
    ],
    MIGRATIONS: [
      UpdateDatabase1645733625038,
      addingContractIdToVehicle1645797399359,
      changingContractUUIDSize1646327172186,
      changingRpushNotificationNotificationsSize1646415290047,
      changingRpushColumnTypes1646417112758,
      changingRpushNotificationBooleanColumnTypes1646779485945,
      changingDamageActiveToDamegeSolved1646930146864,
      changingRpushNotificationBooleanColumnTypesAgain1646936969263,
      AddingHotspotsToVehicle1647642145003,
      AddingDestinyLocationToReservation1647644216617,
      AddingStatusToContract1648242903722,
      FixingDefaultUUIDContractAndCompany1648249932125,
      AddingHasKeyholderToVehicle1648250951193,
      AddingOpeningHoursToLocation1648482731621,
      AddingTimezoneToLocation1648492848276,
      AddingInProgressReservationAsFK1648664330907,
      UpdationgSystemInRoles1648735119824,
      AddingTypeToDamage1649348238284,
      IncreseColumnsLengthOnVehicle1649789538831,
      AddingAddressToAccount1649881031551,
      AddingImagesToAccount1649885141524,
      AddingVehicleGroupsToAccount1650309192719,
      FixingBooleanTypeToAllEntities1650405836423,
      ChangingCommandsAndCommandLogsTables1650511511192,
      ChangingCommandsNameAndAddTtl1650645322382,
      AddingAllDefaultCommands1650664565177,
      AddingImagesAndSolutionToDamage1650822922030,
      ChangingContractsToContractInDamage1650837116697,
      AddingAccountNewFields1651007782195,
      ChangingCnhSituation1651120243623,
      AddingDeletedAtToAllEntities1651358752393,
      AddingDataToVehicleManufacturerAndVehicleModel1651523301737,
      ChangingVehicleLogStatusToEnum1652132401961,
      ChangingReservationStatusInVehicleEntity1652147048647,
      AddingChargeTable1655372280658,
      AddingCustomerIdToAccounts1656015216696,
      AddPaymentConfigurationToCompanies1656026596303,
      RenameCostumerIDToCustomerID1656092172973,
      AddPaymentEnabledToCompanies1656439196032,
      AddReportEntity1657230455297,
      AddGeneratedToUUIDOnReports1657231598307,
      ChangeVehicleModeltoVehicleGroupAtChargeTable1657250385050,
      UpdatingReportEntity1657502940860,
      AddIsEmptyToReport1657525804040,
      AddPaymentDescriptorToCompanies1657525804041,
      AddPaymentInfoToReservations1657525804042,
      AddingChargeConditionsAndFixingChargeTable1657525804043,
      AddDetailedPaymentInfoToReservation1657525804044,
      UpdatingEntitiesAndAddingColumns1657654953061,
      RemovingUndesiredTables1657655597195,
      CreateChargesTable1657749331644,
      AddChargeType1657822980683,
      AddFieldsToDiscountCouponAndAddUsedDiscountCoupon1659287465936,
      AddWhatsAppNumberToContract1659534292462,
      UpdateCommandNamesEnum1660248894796,
      InsertOpenTrunkToCommands1660251281622,
      ChangeChargeOrderStatusEnum1661279019928,
      AddPaymentMethodFieldToCHarge1662416750467,
      AddProofOfResidenceImageFieldToAccount1666877193221,
      UpdatingAlerts1669087399875,
      UpdatingVehicle1669339858560,
      AddReceiverFieldToSmsToken1669835053281,
      UpdateAlertSchemeAndCreateIndex1672172471561,
      ChangeAlertIndex1672178780749,
      RemoveAlertQtyFromVehicle1672199098799,
      AddHasDoorStatusToVehicle1679487050642,
    ],
    CLI: {
      migrationsDir: 'src/migrations',
    },
    MIGRATIONS_RUN: false,
  };

  const valueOrFalse = (value: string) => !!parse(value ? value : 'false', () => false);
  const getLogging = () => {
    const envValue = process.env.DB_LOGGING ?? 'error,warn';
    const envSplit = envValue?.split(',');
    try {
      return envSplit as LoggerOptions;
    } catch (e) {
      console.error({ error: e, env_db_logging: process.env.DB_LOGGING });
      return ['error', 'warn'] as LoggerOptions;
    }
  }
  let ormconfig: TypeOrmModuleOptions = {
    name: 'default',
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_SCHEMA,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: getLogging(),
    synchronize: false,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    migrationsRun: valueOrFalse(process.env.DB_SYNCRONIZE)
  };
  return ormconfig;
}
export default ormConfig();