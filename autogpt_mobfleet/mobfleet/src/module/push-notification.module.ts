import { Module } from '@nestjs/common';

import { PushNotificationService } from '../service/push-notification.service';
import { RpushAppModule } from './rpush-app.module';
import { RpushNotificationModule } from './rpush-notification.module';

@Module({
    imports: [
        RpushAppModule,
        RpushNotificationModule,
    ],
    controllers: [],
    providers: [PushNotificationService],
    exports: [PushNotificationService],
})
export class PushNotificationModule {}
