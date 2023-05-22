import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangingCnhSituation1651120243623 implements MigrationInterface {
    name = 'ChangingCnhSituation1651120243623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` CHANGE `cnh_situation` `cnh_situation` enum ('VALID', 'INVALID') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` CHANGE `cnh_situation` `cnh_situation` enum ('ACTIVE', 'INACTIVE') CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
    }

}
