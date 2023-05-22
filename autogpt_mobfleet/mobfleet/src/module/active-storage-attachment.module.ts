import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStorageAttachmentController } from '../web/rest/active-storage-attachment.controller';
import { ActiveStorageAttachmentRepository } from '../repository/active-storage-attachment.repository';
import { ActiveStorageAttachmentService } from '../service/active-storage-attachment.service';

@Module({
    imports: [TypeOrmModule.forFeature([ActiveStorageAttachmentRepository])],
    controllers: [ActiveStorageAttachmentController],
    providers: [ActiveStorageAttachmentService],
    exports: [ActiveStorageAttachmentService],
})
export class ActiveStorageAttachmentModule {}
