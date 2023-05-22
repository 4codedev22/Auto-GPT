import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixingBooleanTypeToAllEntities1650405836423 implements MigrationInterface {
    name = 'FixingBooleanTypeToAllEntities1650405836423';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_1` `item_1` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_2` `item_2` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_3` `item_3` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_4` `item_4` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_5` `item_5` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_6` `item_6` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_7` `item_7` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_8` `item_8` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_9` `item_9` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_10` `item_10` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_11` `item_11` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_12` `item_12` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_13` `item_13` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_14` `item_14` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_15` `item_15` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `reservation_accounts` CHANGE `status` `status` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `ignition_status` `ignition_status` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `block_status` `block_status` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `door_status` `door_status` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `notifications` CHANGE `readed` `readed` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `notification_accounts` CHANGE `readed` `readed` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `active` `active` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `exec_commands` `exec_commands` tinyint(1) NULL');
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `blocked` `blocked` tinyint(1) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `blocked` `blocked` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `exec_commands` `exec_commands` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `accounts` CHANGE `active` `active` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `notification_accounts` CHANGE `readed` `readed` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `notifications` CHANGE `readed` `readed` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `door_status` `door_status` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `block_status` `block_status` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `vehicles` CHANGE `ignition_status` `ignition_status` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `reservation_accounts` CHANGE `status` `status` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_15` `item_15` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_14` `item_14` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_13` `item_13` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_12` `item_12` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_11` `item_11` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_10` `item_10` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_9` `item_9` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_8` `item_8` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_7` `item_7` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_6` `item_6` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_5` `item_5` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_4` `item_4` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_3` `item_3` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_2` `item_2` tinyint(4) NULL');
        await queryRunner.query('ALTER TABLE `checklists` CHANGE `item_1` `item_1` tinyint(4) NULL');
    }
}
