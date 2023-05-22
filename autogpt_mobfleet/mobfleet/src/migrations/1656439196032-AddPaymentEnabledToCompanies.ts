import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentEnabledToCompanies1656439196032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` ADD `payment_enabled` TINYINT(1) NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` DROP COLUMN `payment_enabled`");
    }

}
