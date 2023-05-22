import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingAddressToAccount1649881031551 implements MigrationInterface {
    name = 'AddingAddressToAccount1649881031551';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_zip_code` varchar(20) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_public_place` varchar(255) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_number` varchar(20) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_street` varchar(255) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_complement` varchar(255) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_city` varchar(255) NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `address_state` varchar(20) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_state`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_city`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_complement`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_street`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_number`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_public_place`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `address_zip_code`');
    }
}
