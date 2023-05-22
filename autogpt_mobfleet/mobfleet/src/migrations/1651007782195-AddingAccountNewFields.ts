import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingAccountNewFields1651007782195 implements MigrationInterface {
    name = 'AddingAccountNewFields1651007782195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` ADD `cnh_expiration_date` date NULL");
        await queryRunner.query("ALTER TABLE `accounts` ADD `cnh_situation` enum ('ACTIVE', 'INACTIVE') NULL");
        await queryRunner.query("ALTER TABLE `accounts` ADD `register_situation` enum ('PRE_REGISTRATION', 'UNDER_ANALISYS', 'APPROVED', 'DISAPPROVED') NULL");
        await queryRunner.query("ALTER TABLE `accounts` ADD `analized_by` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `accounts` ADD `analized_at` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `analized_at`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `analized_by`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `register_situation`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `cnh_situation`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `cnh_expiration_date`");
    }

}
