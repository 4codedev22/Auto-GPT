import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCustomerIdToAccounts1656015216696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` ADD `costumer_id` varchar(255) NULL");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `costumer_id`");

    }
}
