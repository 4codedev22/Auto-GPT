import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

import { AllExceptionsFilter } from './client/all-exceptions-filter';
import ormconfig from './orm.config';
import * as Modules from './module';


// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
    imports: [
        I18nModule.forRoot({
            fallbackLanguage: 'pt-br',
            parser: I18nJsonParser,
            parserOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [{ use: AcceptLanguageResolver, options: { matchType: 'strict-loose' } }],
        }),
        TypeOrmModule.forRootAsync({ useFactory: () => ormconfig }),
        ScheduleModule.forRoot(),
        Modules.AccountModule,
        Modules.AuthModule,
        Modules.ActiveStorageAttachmentModule,
        Modules.ActiveStorageBlobModule,
        Modules.AlertModule,
        Modules.ArInternalMetadataModule,
        Modules.ChecklistModule,
        Modules.CommandLogModule,
        Modules.CommandModule,
        Modules.CompanyModule,
        Modules.ConfigModule,
        Modules.ContractModule,
        Modules.DamageModule,
        Modules.FeedbackCommentModule,
        Modules.FeedbackModule,
        Modules.LocationModule,
        Modules.MailerModule,
        Modules.MaintenanceModule,
        Modules.NotificationAccountModule,
        Modules.NotificationModule,
        Modules.PushNotificationModule,
        Modules.RatingModule,
        Modules.ReportModule,
        Modules.ReservationAccountModule,
        Modules.ReservationModule,
        Modules.RoleModule,
        Modules.RpushAppModule,
        Modules.RpushFeedbackModule,
        Modules.RpushNotificationModule,
        Modules.SmsTokenModule,
        Modules.VehicleGroupModule,
        Modules.VehicleManufacturerModule,
        Modules.VehicleModelModule,
        Modules.VehicleStatusLogModule,
        Modules.VehicleModule,
        Modules.SharedModule,
        Modules.V1Module,
        Modules.ChargeTableModule,
        Modules.CardModule,
        Modules.PagarmeModule,
        Modules.ChargeConditionModule,
        Modules.DiscountCouponModule,
        Modules.TasksModule,
        Modules.UsedDiscountCouponAccountModule,
        Modules.PaymentModule,
        Modules.SmsModule,
        // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
    ],
    controllers: [
        // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
    ],
})
export class AppModule {}
