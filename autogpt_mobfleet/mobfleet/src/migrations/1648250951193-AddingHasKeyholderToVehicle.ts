import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingHasKeyholderToVehicle1648250951193 implements MigrationInterface {
    name = 'AddingHasKeyholderToVehicle1648250951193';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` ADD `has_keyholder` tinyint(1) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `has_keyholder`');
    }
}
