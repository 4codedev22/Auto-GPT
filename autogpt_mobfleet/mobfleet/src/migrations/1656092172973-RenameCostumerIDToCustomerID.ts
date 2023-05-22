import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCostumerIDToCustomerID1656092172973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `costumer_id`");
        await queryRunner.query("ALTER TABLE `accounts` ADD `customer_id` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `customer_id`");
        await queryRunner.query("ALTER TABLE `accounts` ADD `costumer_id` varchar(255) NULL");
    }

}
