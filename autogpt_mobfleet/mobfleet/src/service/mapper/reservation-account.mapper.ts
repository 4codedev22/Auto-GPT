import { ReservationAccount } from '../../domain/reservation-account.entity';
import { ReservationAccountDTO } from '../dto/reservation-account.dto';

/**
 * A ReservationAccount mapper object.
 */
export class ReservationAccountMapper {
    static fromDTOtoEntity(entityDTO: ReservationAccountDTO): ReservationAccount {
        if (!entityDTO) {
            return;
        }
        const entity = new ReservationAccount();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ReservationAccount): ReservationAccountDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new ReservationAccountDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
