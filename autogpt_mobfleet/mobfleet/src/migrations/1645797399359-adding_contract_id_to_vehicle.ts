import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingContractIdToVehicle1645797399359 implements MigrationInterface {
    name = 'addingContractIdToVehicle1645797399359';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD CONSTRAINT `FK_eaa13cd8146cdc0eb66f3c9f443` FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP FOREIGN KEY `FK_eaa13cd8146cdc0eb66f3c9f443`');
    }
}
