import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReportEntity1657230455297 implements MigrationInterface {
    name = 'AddReportEntity1657230455297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query("CREATE TABLE `reports` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `uuid` varchar(255) NOT NULL, `page_size` int NOT NULL, `current_page` int NOT NULL, `params` json NULL, `query_string` text NULL, `account_id` bigint NULL, UNIQUE INDEX `IDX_8e2f2f0d6123151948d3a0537a` (`uuid`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `reports` ADD CONSTRAINT `FK_948bab5efa5819745bcad1290e7` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `reports` DROP FOREIGN KEY `FK_948bab5efa5819745bcad1290e7`");
        await queryRunner.query("DROP INDEX `IDX_8e2f2f0d6123151948d3a0537a` ON `reports`");
        await queryRunner.query("DROP TABLE `reports`");
    }

}
