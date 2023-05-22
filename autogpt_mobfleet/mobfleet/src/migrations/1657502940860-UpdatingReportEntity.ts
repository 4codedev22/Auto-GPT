import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatingReportEntity1657502940860 implements MigrationInterface {
    name = 'UpdatingReportEntity1657502940860'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `page_size`");
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `current_page`");
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `params`");
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `query_string`");
        await queryRunner.query("ALTER TABLE `reports` ADD `file_name` text NULL");
        await queryRunner.query("ALTER TABLE `reports` ADD `entity_name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `reports` ADD `url` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `url`");
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `entity_name`");
        await queryRunner.query("ALTER TABLE `reports` DROP COLUMN `file_name`");
        await queryRunner.query("ALTER TABLE `reports` ADD `query_string` text NULL");
        await queryRunner.query("ALTER TABLE `reports` ADD `params` json NULL");
        await queryRunner.query("ALTER TABLE `reports` ADD `current_page` int NOT NULL");
        await queryRunner.query("ALTER TABLE `reports` ADD `page_size` int NOT NULL");
    }

}
