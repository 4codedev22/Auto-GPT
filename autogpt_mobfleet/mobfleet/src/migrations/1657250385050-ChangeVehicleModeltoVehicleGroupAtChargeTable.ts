import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVehicleModeltoVehicleGroupAtChargeTable1657250385050 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_bdf6d8bdf7e19ef869c805d0ce6`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `vehicle_model_id`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `vehicle_group_id` bigint NULL");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_charges_tables_vehicle_group_id` FOREIGN KEY (`vehicle_group_id`) REFERENCES `vehicle_groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_charges_tables_vehicle_group_id`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `vehicle_group_id`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `vehicle_model_id` bigint NULL");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_bdf6d8bdf7e19ef869c805d0ce6` FOREIGN KEY (`vehicle_model_id`) REFERENCES `vehicle_models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }
}
