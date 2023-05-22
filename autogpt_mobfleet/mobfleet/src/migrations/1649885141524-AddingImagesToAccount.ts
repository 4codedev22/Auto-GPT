import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingImagesToAccount1649885141524 implements MigrationInterface {
    name = 'AddingImagesToAccount1649885141524';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `accounts` ADD `cnh_iamge` text NULL');
        await queryRunner.query('ALTER TABLE `accounts` ADD `profile_iamge` text NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `profile_iamge`');
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `cnh_iamge`');
    }
}
