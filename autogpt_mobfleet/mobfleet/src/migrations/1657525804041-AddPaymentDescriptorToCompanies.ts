import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentDescriptorToCompanies1657525804041 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` ADD `payment_descriptor` VARCHAR(22) null");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `companies` DROP COLUMN `payment_descriptor`");
    }

}
