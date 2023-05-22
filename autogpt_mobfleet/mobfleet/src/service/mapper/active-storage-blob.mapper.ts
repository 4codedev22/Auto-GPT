import { ActiveStorageBlob } from '../../domain/active-storage-blob.entity';
import { ActiveStorageBlobDTO } from '../dto/active-storage-blob.dto';

/**
 * A ActiveStorageBlob mapper object.
 */
export class ActiveStorageBlobMapper {
    static fromDTOtoEntity(entityDTO: ActiveStorageBlobDTO): ActiveStorageBlob {
        if (!entityDTO) {
            return;
        }
        const entity = new ActiveStorageBlob();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ActiveStorageBlob): ActiveStorageBlobDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ActiveStorageBlobDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
