import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateAlertSchemeAndCreateIndex1672172471561 implements MigrationInterface {
    name = 'UpdateAlertSchemeAndCreateIndex1672172471561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `alerts` MODIFY `status` tinyint(1)");
        await queryRunner.query("ALTER TABLE `alerts` MODIFY `vehicle_identifier` varchar(17)");
        await queryRunner.query("CREATE INDEX `IDX_de70ebc6a42c6ddf4a39e11831` ON `alerts` (`vehicle_identifier`, `status`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_de70ebc6a42c6ddf4a39e11831` ON `alerts`");
        await queryRunner.query("ALTER TABLE `alerts` MODIFY `vehicle_identifier` text");
        await queryRunner.query("ALTER TABLE `alerts` MODIFY `status` text");
    }

}
