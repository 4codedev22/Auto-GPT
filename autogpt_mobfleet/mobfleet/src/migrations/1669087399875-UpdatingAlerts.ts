import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatingAlerts1669087399875 implements MigrationInterface {
    name = 'UpdatingAlerts1669087399875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `alerts` DROP FOREIGN KEY `FK_74dd85f46da0c401a52b82aa8f5`");
        await queryRunner.query("ALTER TABLE `alerts` DROP FOREIGN KEY `FK_769d355822d405f61cd0842b1e5`");
        await queryRunner.query("DROP INDEX `alerts_alert_id_index` ON `alerts`");
        await queryRunner.query("DROP INDEX `alerts_created_by_index` ON `alerts`");
        await queryRunner.query("DROP INDEX `alerts_status_index` ON `alerts`");
        await queryRunner.query("DROP INDEX `alerts_updated_by_index` ON `alerts`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `alert_id`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `created_by`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `reservation_id`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `updated_by`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `vehicle_id`");
        await queryRunner.query("ALTER TABLE `alerts` ADD `hw_timestamp` datetime NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `wb_timestamp` datetime NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `extra_info_value` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `lat` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `lng` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `retry` tinyint NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `received_at` datetime NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `vehicle_identifier` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `group_id` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `imei` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `type_id` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `uuid` text NULL");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `alerts` ADD `status` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `alerts` ADD `status` int NULL");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `type_id`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `imei`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `group_id`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `vehicle_identifier`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `received_at`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `retry`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `lng`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `lat`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `extra_info_value`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `wb_timestamp`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `hw_timestamp`");
        await queryRunner.query("ALTER TABLE `alerts` ADD `vehicle_id` bigint NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `updated_by` bigint NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `reservation_id` bigint NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `created_by` bigint NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `alert_id` int NULL");
        await queryRunner.query("CREATE INDEX `alerts_updated_by_index` ON `alerts` (`updated_by`)");
        await queryRunner.query("CREATE INDEX `alerts_status_index` ON `alerts` (`status`)");
        await queryRunner.query("CREATE INDEX `alerts_created_by_index` ON `alerts` (`created_by`)");
        await queryRunner.query("CREATE INDEX `alerts_alert_id_index` ON `alerts` (`alert_id`)");
        await queryRunner.query("ALTER TABLE `alerts` ADD CONSTRAINT `FK_769d355822d405f61cd0842b1e5` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `alerts` ADD CONSTRAINT `FK_74dd85f46da0c401a52b82aa8f5` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
