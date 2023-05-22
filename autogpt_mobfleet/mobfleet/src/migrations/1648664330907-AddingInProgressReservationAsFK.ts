import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingInProgressReservationAsFK1648664330907 implements MigrationInterface {
    name = 'AddingInProgressReservationAsFK1648664330907';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `reservation_id` `reservation_id` bigint NULL');
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD UNIQUE INDEX `IDX_e96c3796a3e19e51eca86a0679` (`reservation_id`)',
        );
        await queryRunner.query(
            'CREATE UNIQUE INDEX `REL_e96c3796a3e19e51eca86a0679` ON `vehicles` (`reservation_id`)',
        );
        await queryRunner.query(
            'ALTER TABLE `vehicles` ADD CONSTRAINT `FK_e96c3796a3e19e51eca86a0679f` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `vehicles` DROP FOREIGN KEY `FK_e96c3796a3e19e51eca86a0679f`');
        await queryRunner.query('DROP INDEX `REL_e96c3796a3e19e51eca86a0679` ON `vehicles`');
        await queryRunner.query('ALTER TABLE `vehicles` DROP INDEX `IDX_e96c3796a3e19e51eca86a0679`');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `reservation_id` `reservation_id` bigint NULL');
    }
}
