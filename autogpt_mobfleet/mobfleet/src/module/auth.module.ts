import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AccountModule } from './account.module';
import { CompanyModule } from './company.module';
import { ContractModule } from './contract.module';
import { ReservationModule } from './reservation.module';
import { SmsModule } from './sms.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { AccountController } from '../web/rest/user-account.controller';
import { SameUserGuard } from '../security';
@Module({
    imports: [
        AccountModule,
        CompanyModule,
        ContractModule,
        PassportModule,
        ReservationModule,
        SmsModule,
        JwtModule.register({
            secret: process.env.SECURITY_TOKEN_KEY,
            signOptions: { expiresIn: '2592000s', algorithm: 'HS512' },
        })
    ],
    controllers: [UserJWTController, AccountController],
    providers: [AuthService, JwtStrategy, SameUserGuard],
    exports: [AuthService, SameUserGuard],
})
export class AuthModule {}
