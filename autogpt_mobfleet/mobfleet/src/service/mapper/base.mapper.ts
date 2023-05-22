export class BaseMapper {

  static fromEntities<E, D> (entities: E[], fn: (e: E) => D): D[] {
    if (!entities) { return []; }
    return entities.map(fn);
  }

  static fromDTOs<D, E> (dtos: D[], fn: (d: D) => E): E[] {
    if (!dtos) { return []; }
    return dtos.map(fn);
  }

  static fromEntitiesWithCount<E,D> (entities: [E[], number], fn: (e: E) => D): [D[], number] {
    if (!entities) { return [[], 0]; }
    const [entityList, count] = entities;
    return [this.fromEntities(entityList, fn), count];
  }

  static fromDTOsWithCount<D,E> (dtos: [D[], number], fn: (d: D) => E): [E[], number] {
    if (!dtos) { return [[], 0]; }
    const [dtoList, count] = dtos;
    return [this.fromDTOs(dtoList, fn), count];
  }

}
