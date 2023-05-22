import { ArInternalMetadata } from '../../domain/ar-internal-metadata.entity';
import { ArInternalMetadataDTO } from '../dto/ar-internal-metadata.dto';

/**
 * A ArInternalMetadata mapper object.
 */
export class ArInternalMetadataMapper {
    static fromDTOtoEntity(entityDTO: ArInternalMetadataDTO): ArInternalMetadata {
        if (!entityDTO) {
            return;
        }
        const entity = new ArInternalMetadata();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ArInternalMetadata): ArInternalMetadataDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ArInternalMetadataDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
