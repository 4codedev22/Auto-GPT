import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangingVehicleLogStatusToEnum1652132401961 implements MigrationInterface {
    name = 'ChangingVehicleLogStatusToEnum1652132401961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `vehicle_status_log_status_index` ON `vehicle_status_log`");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` ADD `status` enum ('ACTIVE', 'INACTIVE', 'MAINTENANCE') NULL");
        await queryRunner.query("CREATE INDEX `vehicle_status_log_status_index` ON `vehicle_status_log` (`status`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `vehicle_status_log_status_index` ON `vehicle_status_log`");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `vehicle_status_log` ADD `status` int NULL");
        await queryRunner.query("CREATE INDEX `vehicle_status_log_status_index` ON `vehicle_status_log` (`status`)");
    }

}
