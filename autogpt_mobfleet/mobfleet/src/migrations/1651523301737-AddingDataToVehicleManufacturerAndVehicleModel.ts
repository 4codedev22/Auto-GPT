import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingDataToVehicleManufacturerAndVehicleModel1651523301737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

      //I am going to add IF NOT EXISTS logic
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','2','FIAT', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','3','RENAULT', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','4','TOYOTA', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','5','VOLKSWAGEM', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','6','NISSAN', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','7','CHEVROLET', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','9','FORD', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','10','BMW', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','11','MERCEDES-BENZ', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','12','AUDI', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','13','HONDA', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','14','JEEP', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','15','KEYCAR', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','16','HYUNDAI', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','17','JAC MOTORS', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','18','CAOA CHERY', sysdate())");
      // await queryRunner.query("INSERT INTO `vehicle_manufacturers` (`last_modified_by`, `id`, `name`, `created_at`) VALUES ('francisco.cabral@moblab.digital','19','SUPER SOCO', sysdate())");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
