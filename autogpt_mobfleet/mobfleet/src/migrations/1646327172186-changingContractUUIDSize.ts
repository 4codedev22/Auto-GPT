import { MigrationInterface, QueryRunner } from 'typeorm';

export class changingContractUUIDSize1646327172186 implements MigrationInterface {
    name = 'changingContractUUIDSize1646327172186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX `IDX_d47764660e5f64763194e3c66f` ON `contracts`');
        await queryRunner.query('ALTER TABLE `contracts` DROP COLUMN `uuid`');
        await queryRunner.query('ALTER TABLE `contracts` ADD `uuid` varchar(36) NOT NULL');
        await queryRunner.query('ALTER TABLE `contracts` ADD UNIQUE INDEX `IDX_d47764660e5f64763194e3c66f` (`uuid`)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `contracts` DROP INDEX `IDX_d47764660e5f64763194e3c66f`');
        await queryRunner.query('ALTER TABLE `contracts` DROP COLUMN `uuid`');
        await queryRunner.query(
            'ALTER TABLE `contracts` ADD `uuid` varchar(26) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL',
        );
        await queryRunner.query('CREATE UNIQUE INDEX `IDX_d47764660e5f64763194e3c66f` ON `contracts` (`uuid`)');
    }
}
