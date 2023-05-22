import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingRpushNotificationNotificationsSize1646415290047 implements MigrationInterface {
    name = 'changingRpushNotificationNotificationsSize1646415290047';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `rpush_notifications` DROP COLUMN `notification`');
        await queryRunner.query('ALTER TABLE `rpush_notifications` ADD `notification` text NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `rpush_notifications` DROP COLUMN `notification`');
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` ADD `notification` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL',
        );
    }
}
