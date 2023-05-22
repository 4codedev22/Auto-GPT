import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovingUndesiredTables1657655597195 implements MigrationInterface {
    name = 'RemovingUndesiredTables1657655597195'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query("DROP TABLE IF EXISTS `checklist`");
        await queryRunner.query("DROP TABLE IF EXISTS `check_lists`");
        await queryRunner.query("DROP TABLE IF EXISTS `location`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
