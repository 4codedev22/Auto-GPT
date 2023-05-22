import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStorageBlobController } from '../web/rest/active-storage-blob.controller';
import { ActiveStorageBlobRepository } from '../repository/active-storage-blob.repository';
import { ActiveStorageBlobService } from '../service/active-storage-blob.service';

@Module({
    imports: [TypeOrmModule.forFeature([ActiveStorageBlobRepository])],
    controllers: [ActiveStorageBlobController],
    providers: [ActiveStorageBlobService],
    exports: [ActiveStorageBlobService],
})
export class ActiveStorageBlobModule {}
