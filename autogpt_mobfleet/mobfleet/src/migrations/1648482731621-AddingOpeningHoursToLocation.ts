import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingOpeningHoursToLocation1648482731621 implements MigrationInterface {
    name = 'AddingOpeningHoursToLocation1648482731621';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursMonday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursTuesday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursWednesday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursThursday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursFriday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursSaturday` json NULL');
        await queryRunner.query('ALTER TABLE `locations` ADD `openingHoursSunday` json NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursSunday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursSaturday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursFriday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursThursday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursWednesday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursTuesday`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `openingHoursMonday`');
    }
}
