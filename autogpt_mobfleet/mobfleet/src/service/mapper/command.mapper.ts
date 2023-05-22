import { Command } from '../../domain/command.entity';
import { CommandDTO } from '../dto/command.dto';

/**
 * A Command mapper object.
 */
export class CommandMapper {
    static fromDTOtoEntity(entityDTO: CommandDTO): Command {
        if (!entityDTO) {
            return;
        }
        const entity = new Command();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Command): CommandDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new CommandDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
