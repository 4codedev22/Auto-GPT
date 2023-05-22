import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingStatusToContract1648242903722 implements MigrationInterface {
    name = 'AddingStatusToContract1648242903722';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contracts` ADD `status` enum ('ACTIVE', 'CANCELED') NULL");
        await queryRunner.query(
            'ALTER TABLE `companies` CHANGE `uuid` `uuid` varchar(36) NOT NULL DEFAULT \'uuid_generate_v4()\'',
        );
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `device_hw_type` `device_hw_type` int(11) NULL');
        await queryRunner.query(
            'ALTER TABLE `contracts` CHANGE `uuid` `uuid` varchar(36) NOT NULL DEFAULT \'uuid_generate_v4()\'',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `contracts` CHANGE `uuid` `uuid` varchar(36) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `device_hw_type` `device_hw_type` int NULL');
        await queryRunner.query(
            'ALTER TABLE `companies` CHANGE `uuid` `uuid` varchar(36) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `contracts` DROP COLUMN `status`');
    }
}
