import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPaymentMethodFieldToCHarge1662416750467 implements MigrationInterface {
    name = 'AddPaymentMethodFieldToCHarge1662416750467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` ADD `payment_method` varchar(50) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` DROP COLUMN `payment_method`");
    }

}
