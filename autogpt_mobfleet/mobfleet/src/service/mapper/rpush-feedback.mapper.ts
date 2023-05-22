import { RpushFeedback } from '../../domain/rpush-feedback.entity';
import { RpushFeedbackDTO } from '../dto/rpush-feedback.dto';

/**
 * A RpushFeedback mapper object.
 */
export class RpushFeedbackMapper {
    static fromDTOtoEntity(entityDTO: RpushFeedbackDTO): RpushFeedback {
        if (!entityDTO) {
            return;
        }
        const entity = new RpushFeedback();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RpushFeedback): RpushFeedbackDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new RpushFeedbackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
