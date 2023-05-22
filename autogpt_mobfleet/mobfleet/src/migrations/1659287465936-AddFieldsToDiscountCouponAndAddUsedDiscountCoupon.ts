import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFieldsToDiscountCouponAndAddUsedDiscountCoupon1659287465936 implements MigrationInterface {
    name = 'AddFieldsToDiscountCouponAndAddUsedDiscountCoupon1659287465936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("DROP INDEX `FK_charges_tables_vehicle_group_id` ON `charges_tables`");
        await queryRunner.query("CREATE TABLE `used_discount_coupon_accounts` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `used_at` timestamp NOT NULL, `discount_coupon_id` bigint NULL, `account_id` bigint NULL, `reservation_id` bigint NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `discount_coupons` ADD `quantity_coupon_per_user` int NOT NULL");
        await queryRunner.query("ALTER TABLE `discount_coupons` ADD `min_trip_value` int NOT NULL");
        await queryRunner.query("ALTER TABLE `discount_coupons` ADD `max_discount_value` int NOT NULL");
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` ADD CONSTRAINT `FK_81523e0c02d8a1286cf0adfdf9e` FOREIGN KEY (`discount_coupon_id`) REFERENCES `discount_coupons`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` ADD CONSTRAINT `FK_6f62612984d4cafd1ad85053b84` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` ADD CONSTRAINT `FK_0cba6dfe353e7961b64fb0b734e` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` DROP FOREIGN KEY `FK_0cba6dfe353e7961b64fb0b734e`");
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` DROP FOREIGN KEY `FK_6f62612984d4cafd1ad85053b84`");
        await queryRunner.query("ALTER TABLE `used_discount_coupon_accounts` DROP FOREIGN KEY `FK_81523e0c02d8a1286cf0adfdf9e`");
        await queryRunner.query("ALTER TABLE `discount_coupons` DROP COLUMN `max_discount_value`");
        await queryRunner.query("ALTER TABLE `discount_coupons` DROP COLUMN `min_trip_value`");
        await queryRunner.query("ALTER TABLE `discount_coupons` DROP COLUMN `quantity_coupon_per_user`");
        await queryRunner.query("DROP TABLE `used_discount_coupon_accounts`");
        // await queryRunner.query("CREATE INDEX `FK_charges_tables_vehicle_group_id` ON `charges_tables` (`vehicle_group_id`)");
    }

}
