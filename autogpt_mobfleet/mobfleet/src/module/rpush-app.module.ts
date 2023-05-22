import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpushAppController } from '../web/rest/rpush-app.controller';
import { RpushAppRepository } from '../repository/rpush-app.repository';
import { RpushAppService } from '../service/rpush-app.service';

@Module({
    imports: [TypeOrmModule.forFeature([RpushAppRepository])],
    controllers: [RpushAppController],
    providers: [RpushAppService],
    exports: [RpushAppService],
})
export class RpushAppModule {}
