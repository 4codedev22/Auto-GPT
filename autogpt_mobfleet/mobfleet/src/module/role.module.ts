import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from '../web/rest/role.controller';
import { RoleRepository } from '../repository/role.repository';
import { RoleService } from '../service/role.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleRepository])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
