import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from '../web/rest/reservation.controller';
import { ReservationRepository } from '../repository/reservation.repository';
import { ReservationService } from '../service/reservation.service';
import { V1Module } from '../v1/v1.module';
import { ReservationAccountModule } from './reservation-account.module';
import { AccountModule } from './account.module';
import { AuthModule } from './auth.module';
import { VehicleModule } from './vehicle.module';
import { ContractModule } from './contract.module';
import { PagarmeModule } from './pagarme.module';
import { ChargeTableModule } from './charge-table.module';
import { ReportModule } from './report.module';
import { ChargeModule } from './charge.module';
import { RatingModule } from './rating.module';
import { ReservationPaymentModule } from './reservation-payment.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from './config.module';
import { TasksModule } from '../tasks/tasks.module';
import { DiscountCouponModule } from './discount-coupon.module';
import { UsedDiscountCouponAccountModule } from './used-discount-coupon-account.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReservationRepository]),
        forwardRef(() => ReservationPaymentModule),
        forwardRef(() => V1Module),
        forwardRef(() => AccountModule),
        forwardRef(() => AuthModule),
        forwardRef(() => VehicleModule),
        forwardRef(() => ContractModule),
        forwardRef(() => ReservationAccountModule),
        forwardRef(() => PagarmeModule),
        forwardRef(() => ChargeTableModule),
        forwardRef(() => ReportModule),
        forwardRef(() => ChargeModule),
        forwardRef(() => RatingModule),
        forwardRef(() => SharedModule),
        forwardRef(() => DiscountCouponModule),
        forwardRef(() => UsedDiscountCouponAccountModule),
        TasksModule,
        ConfigModule,
    ],
    controllers: [ReservationController],
    providers: [ReservationService],
    exports: [ReservationService],
})
export class ReservationModule { }
