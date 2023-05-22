import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReceiverFieldToSmsToken1669835053281 implements MigrationInterface {
    name = 'AddReceiverFieldToSmsToken1669835053281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sms_tokens` ADD `receiver` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sms_tokens` DROP COLUMN `receiver`");
    }

}
