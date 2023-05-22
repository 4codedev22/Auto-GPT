import { RpushApp } from '../../domain/rpush-app.entity';
import { RpushAppDTO } from '../dto/rpush-app.dto';

/**
 * A RpushApp mapper object.
 */
export class RpushAppMapper {
    static fromDTOtoEntity(entityDTO: RpushAppDTO): RpushApp {
        if (!entityDTO) {
            return;
        }
        const entity = new RpushApp();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RpushApp): RpushAppDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new RpushAppDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
