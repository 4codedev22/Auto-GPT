import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationAccountController } from '../web/rest/notification-account.controller';
import { NotificationAccountRepository } from '../repository/notification-account.repository';
import { NotificationAccountService } from '../service/notification-account.service';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationAccountRepository])],
    controllers: [NotificationAccountController],
    providers: [NotificationAccountService],
    exports: [NotificationAccountService],
})
export class NotificationAccountModule {}
