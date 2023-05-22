import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingRpushColumnTypes1646417112758 implements MigrationInterface {
    name = 'changingRpushColumnTypes1646417112758';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `rpush_apps` DROP COLUMN `certificate`');
        await queryRunner.query('ALTER TABLE `rpush_apps` ADD `certificate` text NULL');
        await queryRunner.query('ALTER TABLE `rpush_apps` DROP COLUMN `apn_key`');
        await queryRunner.query('ALTER TABLE `rpush_apps` ADD `apn_key` text NULL');
        await queryRunner.query('ALTER TABLE `rpush_notifications` DROP COLUMN `registration_ids`');
        await queryRunner.query('ALTER TABLE `rpush_notifications` ADD `registration_ids` mediumtext NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `rpush_notifications` DROP COLUMN `registration_ids`');
        await queryRunner.query('ALTER TABLE `rpush_notifications` ADD `registration_ids` blob NULL');
        await queryRunner.query('ALTER TABLE `rpush_apps` DROP COLUMN `apn_key`');
        await queryRunner.query(
            'ALTER TABLE `rpush_apps` ADD `apn_key` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `rpush_apps` DROP COLUMN `certificate`');
        await queryRunner.query(
            'ALTER TABLE `rpush_apps` ADD `certificate` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
    }
}
