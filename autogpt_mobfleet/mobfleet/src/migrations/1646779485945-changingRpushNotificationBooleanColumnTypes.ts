import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingRpushNotificationBooleanColumnTypes1646779485945 implements MigrationInterface {
    name = 'changingRpushNotificationBooleanColumnTypes1646779485945';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `configs` DROP COLUMN `value`');
        await queryRunner.query('ALTER TABLE `configs` ADD `value` text NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `configs` DROP COLUMN `value`');
        await queryRunner.query(
            'ALTER TABLE `configs` ADD `value` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
    }
}
