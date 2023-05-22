import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingChargeTable1655372280658 implements MigrationInterface {
    name = 'AddingChargeTable1655372280658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `charges_tables` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `name` varchar(255) NOT NULL, `currency` varchar(10) NOT NULL, `initial_charge_cents` int NOT NULL DEFAULT '0', `deposit_cents` int NOT NULL DEFAULT '0', `fuel_price_cents` int NOT NULL DEFAULT '0', `fuel_capacity` int NOT NULL DEFAULT '0', `fuel_tolerance` int NOT NULL DEFAULT '0', `odometer_price_cents` int NOT NULL DEFAULT '0', `start_at` datetime NOT NULL, `end_at` datetime NOT NULL, `vehicleModelId` bigint NULL, `contractId` bigint NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_bdf6d8bdf7e19ef869c805d0ce6` FOREIGN KEY (`vehicleModelId`) REFERENCES `vehicle_models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_b4e327f3ac02d8a6b6b2f4ec7f6` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_b4e327f3ac02d8a6b6b2f4ec7f6`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_bdf6d8bdf7e19ef869c805d0ce6`");
        await queryRunner.query("DROP TABLE `charges_tables`");
    }

}
