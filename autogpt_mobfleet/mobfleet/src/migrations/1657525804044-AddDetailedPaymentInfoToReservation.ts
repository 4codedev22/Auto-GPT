import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDetailedPaymentInfoToReservation1657525804044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reservations` ADD `detailed_payment_info` JSON NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reservations` DROP COLUMN `detailed_payment_info`");
    }

}
