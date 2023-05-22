import { EntityRepository, Repository } from 'typeorm';
import { Rating } from '../domain/rating.entity';

@EntityRepository(Rating)
export class RatingRepository extends Repository<Rating> {}
