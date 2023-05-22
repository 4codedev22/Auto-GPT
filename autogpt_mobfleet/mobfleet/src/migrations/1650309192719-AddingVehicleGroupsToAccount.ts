import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingVehicleGroupsToAccount1650309192719 implements MigrationInterface {
    name = 'AddingVehicleGroupsToAccount1650309192719';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `accounts_vehicle_groups` (`account_id` bigint NOT NULL, `vehicle_group_id` bigint NOT NULL, INDEX `IDX_5a3cc2bea76727816956a19207` (`account_id`), INDEX `IDX_65677395bbed1a4f1bb84c352e` (`vehicle_group_id`), PRIMARY KEY (`account_id`, `vehicle_group_id`)) ENGINE=InnoDB',
        );
        await queryRunner.query(
            'ALTER TABLE `accounts_vehicle_groups` ADD CONSTRAINT `FK_5a3cc2bea76727816956a192071` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `accounts_vehicle_groups` ADD CONSTRAINT `FK_65677395bbed1a4f1bb84c352e9` FOREIGN KEY (`vehicle_group_id`) REFERENCES `vehicle_groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `accounts_vehicle_groups` DROP FOREIGN KEY `FK_65677395bbed1a4f1bb84c352e9`',
        );
        await queryRunner.query(
            'ALTER TABLE `accounts_vehicle_groups` DROP FOREIGN KEY `FK_5a3cc2bea76727816956a192071`',
        );
        await queryRunner.query('DROP INDEX `IDX_65677395bbed1a4f1bb84c352e` ON `accounts_vehicle_groups`');
        await queryRunner.query('DROP INDEX `IDX_5a3cc2bea76727816956a19207` ON `accounts_vehicle_groups`');
        await queryRunner.query('DROP TABLE `accounts_vehicle_groups`');
    }
}
