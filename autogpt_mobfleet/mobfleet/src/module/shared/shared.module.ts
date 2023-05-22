import { Module } from '@nestjs/common';
import { GoogleMapsService } from '../../service/google-maps.service';
import { UploadService } from './upload.service';

@Module({
    providers: [GoogleMapsService, UploadService],
    exports: [GoogleMapsService, UploadService],
})
export class SharedModule {}
