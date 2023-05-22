import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingRpushNotificationBooleanColumnTypesAgain1646936969263 implements MigrationInterface {
    name = 'changingRpushNotificationBooleanColumnTypesAgain1646936969263';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `IDX_bfc413dccd7861c5ed3c1bf720` ON `rpush_notifications`');
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `delivered` `delivered` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `failed` `failed` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `alert_is_json` `alert_is_json` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `delay_while_idle` `delay_while_idle` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `processing` `processing` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `content_available` `content_available` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `mutable_content` `mutable_content` tinyint(1) NOT NULL DEFAULT 0',
        );
        await queryRunner.query(
            'CREATE INDEX `IDX_bfc413dccd7861c5ed3c1bf720` ON `rpush_notifications` (`delivered`, `failed`, `processing`, `deliver_after`, `created_at`)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `IDX_bfc413dccd7861c5ed3c1bf720` ON `rpush_notifications`');
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `mutable_content` `mutable_content` tinyint NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `content_available` `content_available` tinyint NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `rpush_notifications` CHANGE `processing` `processing` tinyint NOT NULL');
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `delay_while_idle` `delay_while_idle` tinyint NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE `rpush_notifications` CHANGE `alert_is_json` `alert_is_json` tinyint NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `rpush_notifications` CHANGE `failed` `failed` tinyint NOT NULL');
        await queryRunner.query('ALTER TABLE `rpush_notifications` CHANGE `delivered` `delivered` tinyint NOT NULL');
        await queryRunner.query(
            'CREATE INDEX `IDX_bfc413dccd7861c5ed3c1bf720` ON `rpush_notifications` (`delivered`, `failed`, `processing`, `deliver_after`, `created_at`)',
        );
    }
}
