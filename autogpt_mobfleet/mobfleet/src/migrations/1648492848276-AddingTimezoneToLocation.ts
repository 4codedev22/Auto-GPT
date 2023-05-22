import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingTimezoneToLocation1648492848276 implements MigrationInterface {
    name = 'AddingTimezoneToLocation1648492848276';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `locations` ADD `timezone` text NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `timezone`');
    }
}
