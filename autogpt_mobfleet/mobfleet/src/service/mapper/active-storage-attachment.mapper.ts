import { ActiveStorageAttachment } from '../../domain/active-storage-attachment.entity';
import { ActiveStorageAttachmentDTO } from '../dto/active-storage-attachment.dto';

/**
 * A ActiveStorageAttachment mapper object.
 */
export class ActiveStorageAttachmentMapper {
    static fromDTOtoEntity(entityDTO: ActiveStorageAttachmentDTO): ActiveStorageAttachment {
        if (!entityDTO) {
            return;
        }
        const entity = new ActiveStorageAttachment();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ActiveStorageAttachment): ActiveStorageAttachmentDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ActiveStorageAttachmentDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
