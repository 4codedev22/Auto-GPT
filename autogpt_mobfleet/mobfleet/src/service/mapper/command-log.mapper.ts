import { CommandLog } from '../../domain/command-log.entity';
import { CommandLogDTO } from '../dto/command-log.dto';
import { CommandLogSimpleDTO } from '../dto/command-log.simple.dto';

/**
 * A CommandLog mapper object.
 */
export class CommandLogMapper {
    static fromDTOtoSimpleDTO(entityDTO: CommandLogDTO): CommandLogSimpleDTO {
        if (!entityDTO) {
            return;
        }
        return {
            vehicleId: entityDTO?.vehicle?.id,
            accountId: entityDTO?.account?.id,
            command: entityDTO?.command?.name,
            executedAt: entityDTO?.executedAt,
            status: entityDTO?.status,
        } as CommandLogSimpleDTO;
    }
    static fromDTOtoEntity(entityDTO: CommandLogDTO): CommandLog {
        if (!entityDTO) {
            return;
        }
        const entity = new CommandLog();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: CommandLog): CommandLogDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new CommandLogDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
