import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../domain/role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
