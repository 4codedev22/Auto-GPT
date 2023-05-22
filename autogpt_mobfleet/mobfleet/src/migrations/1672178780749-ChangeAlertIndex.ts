import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeAlertIndex1672178780749 implements MigrationInterface {
    name = 'ChangeAlertIndex1672178780749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_de70ebc6a42c6ddf4a39e11831` ON `alerts`");
        await queryRunner.query("CREATE INDEX `alerts_status_index` ON `alerts` (`status`)");
        await queryRunner.query("CREATE INDEX `alerts_vehicle_identifier_index` ON `alerts` (`vehicle_identifier`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `alerts_vehicle_identifier_index` ON `alerts`");
        await queryRunner.query("DROP INDEX `alerts_status_index` ON `alerts`");
        await queryRunner.query("CREATE INDEX `IDX_de70ebc6a42c6ddf4a39e11831` ON `alerts` (`vehicle_identifier`, `status`)");
    }

}
