import { SmsToken } from '../../domain/sms-token.entity';
import { SmsTokenDTO } from '../dto/sms-token.dto';

/**
 * A SmsToken mapper object.
 */
export class SmsTokenMapper {
    static fromDTOtoEntity(entityDTO: SmsTokenDTO): SmsToken {
        if (!entityDTO) {
            return;
        }
        const entity = new SmsToken();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: SmsToken): SmsTokenDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new SmsTokenDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
