import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangingCommandsNameAndAddTtl1650645322382 implements MigrationInterface {
    name = 'ChangingCommandsNameAndAddTtl1650645322382';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `commands` DROP COLUMN `name`');
        await queryRunner.query(
            'ALTER TABLE `commands` ADD `name` enum (\'OPEN_DOOR\', \'CLOSE_DOOR\', \'BLOCK\', \'UNDO_BLOCK\', \'RESET\') NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `status`');
        await queryRunner.query(
            'ALTER TABLE `command_logs` ADD `status` enum (\'QUEUED\', \'SUCCEEDED\', \'TIMED_OUT\', \'FAILED\') NULL',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `command_logs` DROP COLUMN `status`');
        await queryRunner.query(
            'ALTER TABLE `command_logs` ADD `status` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
        await queryRunner.query('ALTER TABLE `commands` DROP COLUMN `name`');
        await queryRunner.query(
            'ALTER TABLE `commands` ADD `name` varchar(255) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
    }
}
