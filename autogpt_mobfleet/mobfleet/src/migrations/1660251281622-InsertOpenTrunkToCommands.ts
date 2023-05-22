import {MigrationInterface, QueryRunner} from "typeorm";

export class InsertOpenTrunkToCommands1660251281622 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('INSERT INTO `commands` ( `command_code`, `created_at`, `updated_at`, `last_modified_by`, `ttl`, `name`) VALUES (1027, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), \'1\', 36000,\'OPEN_TRUNK\')');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM `mobfleetdev`.`commands` WHERE command_code=1027');
    }


}
