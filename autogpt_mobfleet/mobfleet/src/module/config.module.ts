import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigController } from '../web/rest/config.controller';
import { ConfigRepository } from '../repository/config.repository';
import { ConfigService } from '../service/config.service';
import { ContractModule } from './contract.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        CacheModule.register({ ttl: 10, max: 10 }),
        TypeOrmModule.forFeature([ConfigRepository]),
        forwardRef(() => ContractModule),
        SharedModule,
    ],
    controllers: [ConfigController],
    providers: [ConfigService],
    exports: [ConfigService],
})

export class ConfigModule {}
