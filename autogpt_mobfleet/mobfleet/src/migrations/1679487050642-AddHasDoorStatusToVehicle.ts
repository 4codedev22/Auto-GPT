import {MigrationInterface, QueryRunner} from "typeorm";

export class AddHasDoorStatusToVehicle1679487050642 implements MigrationInterface {
    name = 'AddHasDoorStatusToVehicle1679487050642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` ADD `has_door_status` tinyint(1) NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `has_door_status`");
    }

}
