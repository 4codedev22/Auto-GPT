import { Config } from '../../domain/config.entity';
import { ConfigDTO } from '../dto/config.dto';

/**
 * A Config mapper object.
 */
export class ConfigMapper {
    static fromDTOtoEntity(entityDTO: ConfigDTO): Config {
        if (!entityDTO) {
            return;
        }
        const entity = new Config();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Config): ConfigDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ConfigDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
