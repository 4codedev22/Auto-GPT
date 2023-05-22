import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentConfigurationToCompanies1656026596303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` ADD `payment_public_key` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `companies` ADD `payment_secret_key` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` DROP COLUMN `payment_secret_key`");
        await queryRunner.query("ALTER TABLE `companies` DROP COLUMN `payment_public_key`");
    }

}
