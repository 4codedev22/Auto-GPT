import { RpushNotification } from '../../domain/rpush-notification.entity';
import { RpushNotificationDTO } from '../dto/rpush-notification.dto';

/**
 * A RpushNotification mapper object.
 */
export class RpushNotificationMapper {
    static fromDTOtoEntity(entityDTO: RpushNotificationDTO): RpushNotification {
        if (!entityDTO) {
            return;
        }
        const entity = new RpushNotification();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RpushNotification): RpushNotificationDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new RpushNotificationDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
