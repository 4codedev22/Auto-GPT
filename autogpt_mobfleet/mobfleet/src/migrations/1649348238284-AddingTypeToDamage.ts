import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingTypeToDamage1649348238284 implements MigrationInterface {
    name = 'AddingTypeToDamage1649348238284';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `damages` ADD `type` enum ('START', 'FINISH') NULL");
        await queryRunner.query('ALTER TABLE `damages` CHANGE `active` `active` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `damages` CHANGE `impeditive` `impeditive` tinyint(1) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` CHANGE `impeditive` `impeditive` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `damages` CHANGE `active` `active` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `type`');
    }
}
