import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentInfoToReservations1657525804042 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reservations` ADD `charge_table` JSON NULL");
        await queryRunner.query("ALTER TABLE `reservations` ADD `selected_card_id` VARCHAR(100) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reservations` DROP COLUMN `charge_table`");
        await queryRunner.query("ALTER TABLE `reservations` DROP COLUMN `selected_card_id`");
    }

}
