import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixingDefaultUUIDContractAndCompany1648249932125 implements MigrationInterface {
    name = 'FixingDefaultUUIDContractAndCompany1648249932125';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `companies` CHANGE `uuid` `uuid` varchar(36) NOT NULL');
        await queryRunner.query('ALTER TABLE `contracts` CHANGE `uuid` `uuid` varchar(36) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `contracts` CHANGE `uuid` `uuid` varchar(36) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL DEFAULT \'uuid_generate_v4()\'',
        );
        await queryRunner.query(
            'ALTER TABLE `companies` CHANGE `uuid` `uuid` varchar(36) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL DEFAULT \'uuid_generate_v4()\'',
        );
    }
}
