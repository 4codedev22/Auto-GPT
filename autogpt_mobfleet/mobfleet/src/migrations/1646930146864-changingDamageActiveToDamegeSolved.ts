import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingDamageActiveToDamegeSolved1646930146864 implements MigrationInterface {
    name = 'changingDamageActiveToDamegeSolved1646930146864';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `active`');
        await queryRunner.query('ALTER TABLE `damages` ADD `solved` tinyint(1) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `configs` DROP COLUMN `solved`');
        await queryRunner.query('ALTER TABLE `configs` ADD `active` tinyint(4) NOT NULL');
    }
}
