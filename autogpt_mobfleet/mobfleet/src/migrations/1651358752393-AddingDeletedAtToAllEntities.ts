import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingDeletedAtToAllEntities1651358752393 implements MigrationInterface {
    name = 'AddingDeletedAtToAllEntities1651358752393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `vehicle_manufacturers` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `vehicle_models` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `checklists` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `ratings` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `reservation_accounts` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `locations` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `reservations` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `alerts` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `commands` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `command_logs` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `maintenances` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `vehicles` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `vehicle_groups` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `contracts` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `feedbacks` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `feedback_comments` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `roles` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `notifications` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `notification_accounts` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `sms_tokens` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `active_storage_blobs` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `active_storage_attachments` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `configs` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `rpush_apps` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `rpush_feedback` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `rpush_notifications` ADD `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `damages` CHANGE `deleted_at` `deleted_at` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `accounts` CHANGE `deleted_at` `deleted_at` datetime(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` CHANGE `deleted_at` `deleted_at` datetime(0) NULL");
        await queryRunner.query("ALTER TABLE `damages` CHANGE `deleted_at` `deleted_at` datetime(0) NULL");
        await queryRunner.query("ALTER TABLE `rpush_notifications` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `rpush_feedback` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `rpush_apps` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `configs` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `active_storage_attachments` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `active_storage_blobs` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `sms_tokens` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `notification_accounts` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `notifications` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `roles` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `feedback_comments` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `feedbacks` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `vehicle_groups` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `maintenances` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `command_logs` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `commands` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `alerts` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `reservations` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `locations` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `reservation_accounts` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `ratings` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `checklists` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `vehicle_models` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `vehicle_manufacturers` DROP COLUMN `deleted_at`");
        await queryRunner.query("ALTER TABLE `companies` DROP COLUMN `deleted_at`");
    }

}
