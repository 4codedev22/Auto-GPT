import { NotificationAccount } from '../../domain/notification-account.entity';
import { NotificationAccountDTO } from '../dto/notification-account.dto';

/**
 * A NotificationAccount mapper object.
 */
export class NotificationAccountMapper {
    static fromDTOtoEntity(entityDTO: NotificationAccountDTO): NotificationAccount {
        if (!entityDTO) {
            return;
        }
        const entity = new NotificationAccount();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: NotificationAccount): NotificationAccountDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new NotificationAccountDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
