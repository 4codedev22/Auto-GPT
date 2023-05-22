import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsEmptyToReport1657525804040 implements MigrationInterface {
    name = 'AddIsEmptyToReport1657525804040'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("ALTER TABLE `reports` ADD `is_empty` tinyint(1) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `is_empty`");
    }

}
