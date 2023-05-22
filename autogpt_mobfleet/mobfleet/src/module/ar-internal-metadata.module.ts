import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArInternalMetadataController } from '../web/rest/ar-internal-metadata.controller';
import { ArInternalMetadataRepository } from '../repository/ar-internal-metadata.repository';
import { ArInternalMetadataService } from '../service/ar-internal-metadata.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArInternalMetadataRepository])],
    controllers: [ArInternalMetadataController],
    providers: [ArInternalMetadataService],
    exports: [ArInternalMetadataService],
})
export class ArInternalMetadataModule {}
