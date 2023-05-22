import { FeedbackComment } from '../../domain/feedback-comment.entity';
import { FeedbackCommentDTO } from '../dto/feedback-comment.dto';

/**
 * A FeedbackComment mapper object.
 */
export class FeedbackCommentMapper {
    static fromDTOtoEntity(entityDTO: FeedbackCommentDTO): FeedbackComment {
        if (!entityDTO) {
            return;
        }
        const entity = new FeedbackComment();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: FeedbackComment): FeedbackCommentDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new FeedbackCommentDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
