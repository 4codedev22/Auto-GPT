import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingHotspotsToVehicle1647642145003 implements MigrationInterface {
    name = 'AddingHotspotsToVehicle1647642145003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `location_complement_index` ON `locations`');
        await queryRunner.query('ALTER TABLE `locations` CHANGE `complement` `address` varchar(128) NULL');
        await queryRunner.query('ALTER TABLE `reservations` ADD `devolution_location_id` bigint NULL');
        await queryRunner.query('ALTER TABLE `vehicles` ADD `device_ble_uuid` varchar(36) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` ADD `device_hw_type` int(11) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` ADD `default_hotspot_id` bigint NULL');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `address`');
        await queryRunner.query('ALTER TABLE `locations` ADD `address` text NOT NULL');
        await queryRunner.query(
            'ALTER TABLE `reservations` ADD CONSTRAINT `FK_7d9d7a2852cfc65044adddcba96` FOREIGN KEY (`origin_location_id`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `reservations` ADD CONSTRAINT `FK_342752b5c8b533d9eb55179f8b3` FOREIGN KEY (`devolution_location_id`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD CONSTRAINT `FK_0c2fc8ade64b223ecf8aa1cea87` FOREIGN KEY (`current_hotspot_id`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD CONSTRAINT `FK_5f9ccd96ef332459bef93323f6a` FOREIGN KEY (`default_hotspot_id`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP FOREIGN KEY `FK_5f9ccd96ef332459bef93323f6a`');
        await queryRunner.query('ALTER TABLE `vehicles` DROP FOREIGN KEY `FK_0c2fc8ade64b223ecf8aa1cea87`');
        await queryRunner.query('ALTER TABLE `reservations` DROP FOREIGN KEY `FK_342752b5c8b533d9eb55179f8b3`');
        await queryRunner.query('ALTER TABLE `reservations` DROP FOREIGN KEY `FK_7d9d7a2852cfc65044adddcba96`');
        await queryRunner.query('ALTER TABLE `locations` DROP COLUMN `address`');
        await queryRunner.query('ALTER TABLE `locations` ADD `address` varchar(128) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `default_hotspot_id`');
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_hw_type`');
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `device_ble_uuid`');
        await queryRunner.query('ALTER TABLE `reservations` DROP COLUMN `devolution_location_id`');
        await queryRunner.query('ALTER TABLE `locations` CHANGE `address` `complement` varchar(128) NULL');
        await queryRunner.query('CREATE INDEX `location_complement_index` ON `locations` (`complement`)');
    }
}
