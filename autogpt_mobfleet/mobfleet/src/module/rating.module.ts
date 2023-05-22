import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingRepository } from '../repository/rating.repository';
import { RatingService } from '../service/rating.service';

@Module({
    imports: [TypeOrmModule.forFeature([RatingRepository])],
    providers: [RatingService],
    exports: [RatingService],
})
export class RatingModule {}
