import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatingVehicle1669339858560 implements MigrationInterface {
    name = 'UpdatingVehicle1669339858560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` ADD `date_reset_alerts_quantity` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `date_reset_alerts_quantity`");
    }

}
