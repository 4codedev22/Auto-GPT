import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingChargeConditionsAndFixingChargeTable1657525804043 implements MigrationInterface {
    name = 'AddingChargeConditionsAndFixingChargeTable1657525804043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `charges_conditions` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `execute_charge_from` int NOT NULL, `execute_charge_to` int NOT NULL, `charge_value_cents` int NOT NULL, `min_charge_unit` int NOT NULL, `additional_charge_unit` int NOT NULL, `charge_table_id` bigint NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `discount_coupons` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `name` varchar(255) NOT NULL, `effective_period_from` date NOT NULL, `effective_period_to` date NOT NULL, `coupon_type` enum ('PERCENTAGE', 'VALUE') NOT NULL, `value` double NOT NULL, `quantity` int NOT NULL, `user_specific` tinyint NOT NULL, `active` tinyint NULL, `description` varchar(255) NULL, `contractId` bigint NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `discount_coupons_accounts` (`discount_coupon_id` bigint NOT NULL, `accounts_id` bigint NOT NULL, INDEX `IDX_5554c47fbf3144eeaed7c50ae4` (`discount_coupon_id`), INDEX `IDX_3f4a97a2b5d238669e2e3462e5` (`accounts_id`), PRIMARY KEY (`discount_coupon_id`, `accounts_id`)) ENGINE=InnoDB");
        
        // await queryRunner.query("ALTER TABLE `charges_conditions` DROP FOREIGN KEY `FK_0414cb26f0691082ad8f98047f8`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_b4e327f3ac02d8a6b6b2f4ec7f6`");
        // await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_bdf6d8bdf7e19ef869c805d0ce6`");
        // await queryRunner.query("ALTER TABLE `charges_conditions` CHANGE `chargeTableId` `charge_table_id` bigint NULL");
        // await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `vehicleModelId`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `contractId`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `charge_unit` enum ('MINUTES', 'HOURS', 'DAYS') NOT NULL");
        // await queryRunner.query("ALTER TABLE `charges_tables` ADD `vehicle_model_id` bigint NULL");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `contract_id` bigint NULL");
        // await queryRunner.query("ALTER TABLE `charges_conditions` ADD CONSTRAINT `FK_2df5485fef2f8b6c531a9a07413` FOREIGN KEY (`charge_table_id`) REFERENCES `charges_tables`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        // await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_0d3bb31ab2a04bedd229c36ede3` FOREIGN KEY (`vehicle_model_id`) REFERENCES `vehicle_models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_2af12b497c283e8db5ce7b4d26b` FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_2af12b497c283e8db5ce7b4d26b`");
        // await queryRunner.query("ALTER TABLE `charges_tables` DROP FOREIGN KEY `FK_0d3bb31ab2a04bedd229c36ede3`");
        // await queryRunner.query("ALTER TABLE `charges_conditions` DROP FOREIGN KEY `FK_2df5485fef2f8b6c531a9a07413`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `contract_id`");
        // await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `vehicle_model_id`");
        await queryRunner.query("ALTER TABLE `charges_tables` DROP COLUMN `charge_unit`");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD `contractId` bigint NULL");
        // await queryRunner.query("ALTER TABLE `charges_tables` ADD `vehicleModelId` bigint NULL");
        // await queryRunner.query("ALTER TABLE `charges_conditions` CHANGE `charge_table_id` `chargeTableId` bigint NULL");
        // await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_bdf6d8bdf7e19ef869c805d0ce6` FOREIGN KEY (`vehicleModelId`) REFERENCES `vehicle_models`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `charges_tables` ADD CONSTRAINT `FK_b4e327f3ac02d8a6b6b2f4ec7f6` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        // await queryRunner.query("ALTER TABLE `charges_conditions` ADD CONSTRAINT `FK_0414cb26f0691082ad8f98047f8` FOREIGN KEY (`chargeTableId`) REFERENCES `charges_tables`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
