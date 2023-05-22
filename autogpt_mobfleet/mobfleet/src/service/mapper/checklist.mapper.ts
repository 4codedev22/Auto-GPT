import { Checklist } from '../../domain/checklist.entity';
import { ChecklistDTO } from '../dto/checklist.dto';

/**
 * A Checklist mapper object.
 */
export class ChecklistMapper {
    static fromDTOtoEntity(entityDTO: ChecklistDTO): Checklist {
        if (!entityDTO) {
            return;
        }
        const entity = new Checklist();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Checklist): ChecklistDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ChecklistDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
