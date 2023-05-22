import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGeneratedToUUIDOnReports1657231598307 implements MigrationInterface {
    name = 'AddGeneratedToUUIDOnReports1657231598307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query("ALTER TABLE `reports` CHANGE `uuid` `uuid` varchar(36) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query("ALTER TABLE `reports` CHANGE `uuid` `uuid` varchar(255) NOT NULL");
    }

}
