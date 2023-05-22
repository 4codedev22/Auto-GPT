import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdationgSystemInRoles1648735119824 implements MigrationInterface {
    name = 'UpdationgSystemInRoles1648735119824';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `roles` CHANGE `system` `system` tinyint(1) NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `roles` CHANGE `system` `system` tinyint(4) NOT NULL');
    }
}
