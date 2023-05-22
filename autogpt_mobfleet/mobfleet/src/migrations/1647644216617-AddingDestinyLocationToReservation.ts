import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingDestinyLocationToReservation1647644216617 implements MigrationInterface {
    name = 'AddingDestinyLocationToReservation1647644216617';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `reservations` ADD CONSTRAINT `FK_fd64d4d8a0533c37da461f9e6fd` FOREIGN KEY (`destiny_location_id`) REFERENCES `locations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `reservations` DROP FOREIGN KEY `FK_fd64d4d8a0533c37da461f9e6fd`');
    }
}
