import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpushNotificationController } from '../web/rest/rpush-notification.controller';
import { RpushNotificationRepository } from '../repository/rpush-notification.repository';
import { RpushNotificationService } from '../service/rpush-notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([RpushNotificationRepository])],
    controllers: [RpushNotificationController],
    providers: [RpushNotificationService],
    exports: [RpushNotificationService],
})
export class RpushNotificationModule {}
