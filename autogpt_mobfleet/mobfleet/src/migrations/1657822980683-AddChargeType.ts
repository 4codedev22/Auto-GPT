import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChargeType1657822980683 implements MigrationInterface {
    name = 'AddChargeType1657822980683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` ADD `type` enum ('DEPOSIT', 'NORMAL', 'MANUAL') NOT NULL DEFAULT 'NORMAL'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` DROP COLUMN `type`");
    }

}
