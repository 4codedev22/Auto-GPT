import { of } from 'rxjs';
import { Contract } from 'src/domain/contract.entity';
import { Company } from '../../domain/company.entity';
import { CompanyNoAuthDTO } from '../dto/company-no-auth.dto';
import { ContractNoAuthDTO } from '../dto/contract-no-auth.dto';

/**
 * A CompanyNoAuthMapper mapper object.
 */
export class CompanyNoAuthMapper {

  static fromCompanyEntity(entity: Contract): ContractNoAuthDTO {
    if (!entity) { return; }

    const dto = new ContractNoAuthDTO();
    dto.id = entity.id;
    dto.uuid = entity.uuid;
    dto.name = entity.name;
    dto.supportPhone = entity.supportPhone;
    dto.supportEmail = entity.supportEmail;
    dto.supportWhatsappNumber = entity.supportWhatsappNumber;

    return dto;
  }

  static fromEntity(entity: Company): CompanyNoAuthDTO {
    if (!entity) { return; }

    const dto = new CompanyNoAuthDTO();
    dto.id = entity.id;
    dto.uuid = entity.uuid;
    dto.name = entity.name;
    dto.contracts = entity.contracts.map(CompanyNoAuthMapper.fromCompanyEntity);

    return dto;
  }
}
