import { Report } from '../../domain/report.entity';
import { ReportDTO } from '../dto/report.dto';


/**
 * A Report mapper object.
 */
export class ReportMapper {

  static fromDTOtoEntity (entityDTO: ReportDTO): Report {
    if (!entityDTO) {
      return;
    }
    let entity = new Report();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Report): ReportDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ReportDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
