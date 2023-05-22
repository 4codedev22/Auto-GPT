import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeChargeOrderStatusEnum1661279019928 implements MigrationInterface {
    name = 'ChangeChargeOrderStatusEnum1661279019928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` CHANGE `order_status` `order_status` enum ('pending', 'paid', 'canceled', 'failed') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` CHANGE `order_status` `order_status` enum ('pending', 'paid', 'cancelled', 'failed') NOT NULL");
    }

}
