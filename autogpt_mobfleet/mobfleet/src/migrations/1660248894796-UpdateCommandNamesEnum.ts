import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCommandNamesEnum1660248894796 implements MigrationInterface {
    name = 'UpdateCommandNamesEnum1660248894796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("DROP INDEX `FK_charges_tables_vehicle_group_id` ON `charges_tables`");
        await queryRunner.query("ALTER TABLE `commands` CHANGE `name` `name` enum ('OPEN_DOOR', 'CLOSE_DOOR', 'BLOCK', 'UNDO_BLOCK', 'RESET', 'OPEN_TRUNK') NOT NULL");
        // await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` ADD CONSTRAINT `FK_0cba6dfe353e7961b64fb0b734e` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` DROP FOREIGN KEY `FK_0cba6dfe353e7961b64fb0b734e`");
        // await queryRunner.query("ALTER TABLE `commands` CHANGE `name` `name` enum ('OPEN_DOOR', 'CLOSE_DOOR', 'BLOCK', 'UNDO_BLOCK', 'RESET') CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NOT NULL");
        // await queryRunner.query("CREATE INDEX `FK_charges_tables_vehicle_group_id` ON `charges_tables` (`vehicle_group_id`)");
    }

}
