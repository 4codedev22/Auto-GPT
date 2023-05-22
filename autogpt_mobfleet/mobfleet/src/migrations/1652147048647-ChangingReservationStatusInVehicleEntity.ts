import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangingReservationStatusInVehicleEntity1652147048647 implements MigrationInterface {
    name = 'ChangingReservationStatusInVehicleEntity1652147048647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `reservation_status`");
        await queryRunner.query("ALTER TABLE `vehicles` ADD `reservation_status` enum ('OPEN', 'IN_PROGRESS', 'FINISHED', 'CANCELLED', 'OVERDUE') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `reservation_status`");
        await queryRunner.query("ALTER TABLE `vehicles` ADD `reservation_status` int NULL");
    }

}
