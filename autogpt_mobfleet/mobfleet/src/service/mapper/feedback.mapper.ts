import { Feedback } from '../../domain/feedback.entity';
import { FeedbackDTO } from '../dto/feedback.dto';

/**
 * A Feedback mapper object.
 */
export class FeedbackMapper {
    static fromDTOtoEntity(entityDTO: FeedbackDTO): Feedback {
        if (!entityDTO) {
            return;
        }
        const entity = new Feedback();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Feedback): FeedbackDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new FeedbackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
