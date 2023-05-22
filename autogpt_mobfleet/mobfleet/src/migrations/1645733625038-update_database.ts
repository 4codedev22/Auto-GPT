import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1645733625038 implements MigrationInterface {
    name = 'updateDatabase1645733625038';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `reservations` DROP COLUMN `status`');
        await queryRunner.query(
            'ALTER TABLE `reservations` ADD `status` enum (\'OPEN\', \'IN_PROGRESS\', \'FINISHED\', \'CANCELLED\', \'OVERDUE\') NULL',
        );
        await queryRunner.query('ALTER TABLE `reservations` DROP COLUMN `cancellation_reason`');
        await queryRunner.query(
            'ALTER TABLE `reservations` ADD `cancellation_reason` enum (\'BY_NOT_WITHDRAWN_VEHICLE\', \'VEHICLE_UNAVAILABLE\', \'BACKOFFICE_BY_OPERATOR\', \'BY_DRIVER\') NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `gearshift`');
        await queryRunner.query("ALTER TABLE `vehicles` ADD `gearshift` enum ('MANUAL', 'AUTOMATIC') NULL");
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `type_fuel`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `type_fuel` enum (\'FLEX\', \'GASOLINE\', \'GAS\', \'DIESEL\', \'ALCOHOL\', \'ELECTRIC\') NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `color`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `color` enum (\'WHITE\', \'BLACK\', \'RED\', \'GREEN\', \'YELLOW\', \'SILVER\', \'GRAY\', \'BLUE\', \'WINE\', \'BROWN\') NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `status`');
        await queryRunner.query("ALTER TABLE `vehicles` ADD `status` enum ('ACTIVE', 'INACTIVE', 'MAINTENANCE') NULL");
        await queryRunner.query(
            'ALTER TABLE `locations` CHANGE `type` `type` enum (\'INFO_POINT\', \'HOTSPOT\', \'GROUPER\') NULL',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `locations` CHANGE `type` `type` enum (\'0\', \'1\', \'2\') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `status`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `status` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `color`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `color` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `type_fuel`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `type_fuel` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` DROP COLUMN `gearshift`');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD `gearshift` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
        await queryRunner.query('ALTER TABLE `reservations` DROP COLUMN `cancellation_reason`');
        await queryRunner.query('ALTER TABLE `reservations` ADD `cancellation_reason` int NULL');
        await queryRunner.query('ALTER TABLE `reservations` DROP COLUMN `status`');
        await queryRunner.query('ALTER TABLE `reservations` ADD `status` int NULL');
    }
}
