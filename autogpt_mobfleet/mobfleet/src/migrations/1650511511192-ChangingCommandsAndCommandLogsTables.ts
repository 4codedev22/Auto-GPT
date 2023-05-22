import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangingCommandsAndCommandLogsTables1650511511192 implements MigrationInterface {
    name = 'ChangingCommandsAndCommandLogsTables1650511511192';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `message`');
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `channel`');
        await queryRunner.query('ALTER TABLE `command_logs` ADD `job_identifier` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `command_logs` ADD `status` varchar(255) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `status`');
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `job_identifier`');
        await queryRunner.query(
            'ALTER TABLE `command_logs` ADD `channel` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE `command_logs` ADD `message` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
    }
}
