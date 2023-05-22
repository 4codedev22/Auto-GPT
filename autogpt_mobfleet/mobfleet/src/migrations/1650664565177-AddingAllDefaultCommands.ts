import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingAllDefaultCommands1650664565177 implements MigrationInterface {
    name = 'AddingAllDefaultCommands1650664565177';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM `command_logs` where ID > 0');
        await queryRunner.query('DELETE FROM `commands` where ID > 0');
        await queryRunner.query(
            "ALTER TABLE `commands` CHANGE `name` `name` enum ('OPEN_DOOR', 'CLOSE_DOOR', 'BLOCK', 'UNDO_BLOCK', 'RESET') NOT NULL",
        );
        await queryRunner.query('ALTER TABLE `commands` ADD UNIQUE INDEX `IDX_87632c6d4596995f1346b23c0c` (`name`)');
        await queryRunner.query(
            "ALTER TABLE `command_logs` CHANGE `status` `status` enum ('QUEUED', 'SUCCEEDED', 'IN_PROGRESS', 'TIMED_OUT', 'FAILED') NULL",
        );

        await queryRunner.query(
            "INSERT INTO `commands` (`command_code`, `name`, `created_at`, `updated_at`, `last_modified_by`, `ttl`) VALUES ('1001', 'OPEN_DOOR', sysdate(), sysdate(), 'francisco.cabral@moblab.digital','36000')",
        );
        await queryRunner.query(
            "INSERT INTO `commands` (`command_code`, `name`, `created_at`, `updated_at`, `last_modified_by`, `ttl`) VALUES ('1002', 'CLOSE_DOOR', sysdate(), sysdate(), 'francisco.cabral@moblab.digital','36000')",
        );
        await queryRunner.query(
            "INSERT INTO `commands` (`command_code`, `name`, `created_at`, `updated_at`, `last_modified_by`, `ttl`) VALUES ('1005', 'BLOCK', sysdate(), sysdate(), 'francisco.cabral@moblab.digital','36000')",
        );
        await queryRunner.query(
            "INSERT INTO `commands` (`command_code`, `name`, `created_at`, `updated_at`, `last_modified_by`, `ttl`) VALUES ('1006', 'UNDO_BLOCK', sysdate(), sysdate(), 'francisco.cabral@moblab.digital','36000')",
        );
        await queryRunner.query(
            "INSERT INTO `commands` (`command_code`, `name`, `created_at`, `updated_at`, `last_modified_by`, `ttl`) VALUES ('1007', 'RESET', sysdate(), sysdate(), 'francisco.cabral@moblab.digital','36000')",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM `command_logs` where ID > 0');
        await queryRunner.query('DELETE FROM `commands` where ID > 0');
        await queryRunner.query(
            "ALTER TABLE `command_logs` CHANGE `status` `status` enum ('QUEUED', 'SUCCEEDED', 'TIMED_OUT', 'FAILED') CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL",
        );
        await queryRunner.query('ALTER TABLE `commands` DROP INDEX `IDX_87632c6d4596995f1346b23c0c`');
        await queryRunner.query(
            "ALTER TABLE `commands` CHANGE `name` `name` enum ('OPEN_DOOR', 'CLOSE_DOOR', 'BLOCK', 'UNDO_BLOCK', 'RESET') CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NOT NULL",
        );
    }
}
