import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChargesTable1657749331644 implements MigrationInterface {
    name = 'CreateChargesTable1657749331644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `charges` (`id` bigint NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL, `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_by` varchar(255) NULL, `description` varchar(255) NULL, `value_cents` int NOT NULL DEFAULT '0', `created_by` varchar(255) NULL, `selected_card_id` varchar(100) NOT NULL, `card_last_four` varchar(4) NOT NULL, `card_brand` varchar(100) NOT NULL, `charge_info` json NOT NULL, `charge_status` enum ('pending', 'paid', 'canceled', 'processing', 'failed', 'overpaid', 'underpaid', 'chargedback') NOT NULL, `order_status` enum ('pending', 'paid', 'cancelled', 'failed') NOT NULL, `reservation_id` bigint NULL, `contract_id` bigint NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `charges` ADD CONSTRAINT `FK_867401841bfbfd88ef8b9891061` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `charges` ADD CONSTRAINT `FK_c115e5a0b1b3263688186698701` FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `charges` DROP FOREIGN KEY `FK_c115e5a0b1b3263688186698701`");
        await queryRunner.query("ALTER TABLE `charges` DROP FOREIGN KEY `FK_867401841bfbfd88ef8b9891061`");
        await queryRunner.query("DROP TABLE `charges`");
    }

}
