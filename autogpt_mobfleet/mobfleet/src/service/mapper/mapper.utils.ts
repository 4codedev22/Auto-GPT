export class MapperUtils {
    static toCamel(str: string): string {
        return str.replace(/([_][a-z])/gi, $1 => $1.toUpperCase().replace('_', ''));
    }

    static toCamelObject(obj: Object) {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
            newObj[MapperUtils.toCamel(key)] = obj[key];
        });
        return newObj;
    }

    static fieldsFromRaw(rawEntity: any, alias: string): any {
        const startAlias = `${alias}_`
        const mappedFields = Object.getOwnPropertyNames(rawEntity ?? {})
            .filter(f => f.indexOf(startAlias) === 0)
            .map(f => [f, MapperUtils.toCamel(f.replace(startAlias, ''))]);

        return mappedFields;
    }

    static rawToDTOByFields(fields: string[][]): (rawEntity: any) => any {

        return (rawEntity: any) => {
            const newObj = {};
            let isAllNull = true;
            fields.forEach(([field, locationField]) => {
                newObj[locationField] = rawEntity[field];
                if (rawEntity[field] !== null) {
                    isAllNull = false;
                }
            });
            return isAllNull ? {} : newObj;
        }
    }

}
