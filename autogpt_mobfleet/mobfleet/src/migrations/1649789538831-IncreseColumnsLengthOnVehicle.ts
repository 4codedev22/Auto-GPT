import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreseColumnsLengthOnVehicle1649789538831 implements MigrationInterface {
    name = 'IncreseColumnsLengthOnVehicle1649789538831';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_serial`');
        await queryRunner.query('ALTER TABLE `vehicles` ADD `device_serial` varchar(36) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_iccid`');
        await queryRunner.query('ALTER TABLE `vehicles` ADD `device_iccid` varchar(36) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_iccid`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `device_iccid` varchar(30) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_serial`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `device_serial` varchar(30) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
    }
}
