import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveAlertQtyFromVehicle1672199098799 implements MigrationInterface {
    name = 'RemoveAlertQtyFromVehicle1672199098799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `vehicles_active_alerts_qty_index` ON `vehicles`");
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `active_alerts_qty`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vehicles` ADD `active_alerts_qty` int NULL");
        await queryRunner.query("CREATE INDEX `vehicles_active_alerts_qty_index` ON `vehicles` (`active_alerts_qty`)");
    }

}
