import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProofOfResidenceImageFieldToAccount1666877193221 implements MigrationInterface {
    name = 'AddProofOfResidenceImageFieldToAccount1666877193221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` ADD `proof_of_residence_image` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `proof_of_residence_image`");
    }

}
