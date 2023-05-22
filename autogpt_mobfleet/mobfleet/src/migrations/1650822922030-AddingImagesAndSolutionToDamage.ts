import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingImagesAndSolutionToDamage1650822922030 implements MigrationInterface {
    name = 'AddingImagesAndSolutionToDamage1650822922030';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` ADD `damage_images` json NULL');
        await queryRunner.query('ALTER TABLE `damages` ADD `solution_images` json NULL');
        await queryRunner.query('ALTER TABLE `damages` ADD `solution_comment` text NULL');
        await queryRunner.query('ALTER TABLE `damages` ADD `solved_at` datetime NULL');
        await queryRunner.query('ALTER TABLE `damages` ADD `solver_id` bigint NULL');
        await queryRunner.query(
            'ALTER TABLE `damages` ADD CONSTRAINT `FK_017b350967b9e7ef9571d6e2c40` FOREIGN KEY (`solver_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` DROP FOREIGN KEY `FK_017b350967b9e7ef9571d6e2c40`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `solver_id`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `solved_at`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `solution_comment`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `solution_images`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `damage_images`');
    }
}
