import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhatsAppNumberToContract1659534292462 implements MigrationInterface {
    name = 'AddWhatsAppNumberToContract1659534292462';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `contracts` ADD `support_whatsapp_number` varchar(255) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `contracts` DROP COLUMN `support_whatsapp_number`');
    }
}
