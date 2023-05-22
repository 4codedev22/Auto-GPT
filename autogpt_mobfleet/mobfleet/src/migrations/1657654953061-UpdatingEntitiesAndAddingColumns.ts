import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatingEntitiesAndAddingColumns1657654953061 implements MigrationInterface {
    name = 'UpdatingEntitiesAndAddingColumns1657654953061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_charges_tables_vehicle_group_id`");

        await queryRunner.query("ALTER TABLE `discount_coupons` CHANGE `contractId` `contract_id` bigint NULL");

        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `fuel_capacity`");

        await queryRunner.query("ALTER TABLE `accounts` ADD `signature_image` text NULL");

        await queryRunner.query("ALTER TABLE `contracts` ADD `support_phone` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `contracts` ADD `support_email` varchar(255) NULL");

        await queryRunner.query("ALTER TABLE `vehicle_models` ADD `classification` int NOT NULL DEFAULT '0'");

        await queryRunner.query("ALTER TABLE `vehicles` ADD `ev_battery_level2` double NULL");

        await queryRunner.query("ALTER TABLE `companies` CHANGE `payment_enabled` `payment_enabled` tinyint NOT NULL DEFAULT 0");

        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `start_at`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `start_at` timestamp NOT NULL");

        await queryRunner.query("ALTER TABLE `charges_conditions` ADD CONSTRAINT `FK_2df5485fef2f8b6c531a9a07413` FOREIGN KEY (`charge_table_id`) REFERENCES `charges_tables`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_6f84de5fd84f3c7bf686e5444be` FOREIGN KEY (`vehicle_group_id`) REFERENCES `vehicle_groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        
        await queryRunner.query("ALTER TABLE `discount_coupons` ADD CONSTRAINT `FK_0ee2adf5334cccacd9b6e938e21` FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `discount_coupons_accounts` ADD CONSTRAINT `FK_5554c47fbf3144eeaed7c50ae44` FOREIGN KEY (`discount_coupon_id`) REFERENCES `discount_coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `discount_coupons_accounts` ADD CONSTRAINT `FK_3f4a97a2b5d238669e2e3462e51` FOREIGN KEY (`accounts_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discount_coupons_accounts` DROP FOREIGN KEY `FK_3f4a97a2b5d238669e2e3462e51`");
        await queryRunner.query("ALTER TABLE `discount_coupons_accounts` DROP FOREIGN KEY `FK_5554c47fbf3144eeaed7c50ae44`");
        await queryRunner.query("ALTER TABLE `discount_coupons` DROP FOREIGN KEY `FK_0ee2adf5334cccacd9b6e938e21`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_6f84de5fd84f3c7bf686e5444be`");
        await queryRunner.query("ALTER TABLE `charges_conditions` DROP FOREIGN KEY `FK_2df5485fef2f8b6c531a9a07413`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `start_at`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `start_at` datetime NOT NULL");
        await queryRunner.query("ALTER TABLE `companies` CHANGE `payment_enabled` `payment_enabled` tinyint(1) NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `vehicles` DROP COLUMN `ev_battery_level2`");
        await queryRunner.query("ALTER TABLE `vehicle_models` DROP COLUMN `classification`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `support_email`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `support_phone`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `signature_image`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `fuel_capacity` int NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `discount_coupons` CHANGE `contract_id` `contractId` bigint NULL");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_charges_tables_vehicle_group_id` FOREIGN KEY (`vehicle_group_id`) REFERENCES `vehicle_groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
