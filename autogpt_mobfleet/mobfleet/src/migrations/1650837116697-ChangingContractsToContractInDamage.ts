import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangingContractsToContractInDamage1650837116697 implements MigrationInterface {
    name = 'ChangingContractsToContractInDamage1650837116697';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` ADD `contract_id` bigint NULL');
        await queryRunner.query(
            'ALTER TABLE `damages` ADD CONSTRAINT `FK_a2f5bc181ec398245d95192e448` FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `damages` DROP FOREIGN KEY `FK_a2f5bc181ec398245d95192e448`');
        await queryRunner.query('ALTER TABLE `damages` DROP COLUMN `contract_id`');
    }
}
