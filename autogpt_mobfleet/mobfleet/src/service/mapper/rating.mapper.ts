import { Rating } from '../../domain/rating.entity';
import { RatingReservationCreateDTO } from '../dto/rating-reservation.create.dto';
import { RatingDTO } from '../dto/rating.dto';

/**
 * A Rating mapper object.
 */
export class RatingMapper {
    static fromDTOtoEntity(entityDTO: RatingDTO): Rating {
        if (!entityDTO) {
            return;
        }
        const entity = new Rating();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromReservationCreateDTOtoEntity(entityDTO: RatingReservationCreateDTO): Rating {
        if (!entityDTO) {
            return;
        }
        const entity = new Rating();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Rating): RatingDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new RatingDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
