
import { QueryRunner } from "typeorm";


const baseQuery = `
SELECT IF(
    EXISTS(
    SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = '#QUERY_TABLE_NAME#' AND #QUERY_TABLE_ITEM# = '#QUERY_TABLE_ITEM_VALUE#'
    ),
    '#QUERY_TO_EXECUTE#',NULL
) as result
`;


const getFkName = `
SELECT  CONSTRAINT_NAME as result
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = '#QUERY_TABLE_NAME#' AND #QUERY_TABLE_ITEM# = '#QUERY_TABLE_ITEM_VALUE#'
`;

type QueryReplacerBuilder = {
    rawQueryBuilder: string;
    forExecute: (queryString: string) => Omit<QueryReplacerBuilder, 'forExecute' | 'table' | 'itemName' | 'itemValue'>,
    getQuery: () => string;
    table: (tableName: string) => Omit<QueryReplacerBuilder, 'forExecute' | 'table' | 'itemValue' | 'run'>,
    itemName: (itemName: string) => Omit<QueryReplacerBuilder, 'forExecute' | 'table' | 'itemName' | 'run'>,
    itemValue: (itemValue: string) => Omit<QueryReplacerBuilder, 'run' | 'table' | 'itemName' | 'itemValue'>,
};

const replace = ({ rawQueryBuilder, ...q }: QueryReplacerBuilder, key, value) => {
    const resultObj = {
        ...q,
        rawQueryBuilder: rawQueryBuilder.replace(key, value)
    };
    return resultObj;
}

const executeSql = async (queryRunner: QueryRunner, sql: string): Promise<void> => {
    const result = await queryRunner.query(sql);
    const onSuccessQuery = result?.[0]?.result;
    if (onSuccessQuery) {
        await queryRunner.query(onSuccessQuery);
    }
};


const executeSqlAndGetResult = async (queryRunner: QueryRunner, sql: string): Promise<any> => {
    const result = await queryRunner.query(sql);
    return result?.[0]?.result;
};

const queryReplacer = (raw: string): QueryReplacerBuilder => ({
    rawQueryBuilder: raw,
    forExecute(queryString: string) {
        return replace(this, '#QUERY_TO_EXECUTE#', queryString);
    },
    table(tableName: string) {
        return replace(this, '#QUERY_TABLE_NAME#', tableName);
    },
    itemName(itemName: string) {
        return replace(this, '#QUERY_TABLE_ITEM#', itemName);
    },
    itemValue(itemValue: string) {
        return replace(this, '#QUERY_TABLE_ITEM_VALUE#', itemValue);
    },
    getQuery() {
        return this.rawQueryBuilder
    }
});

const queryExecutor = (): FluentVerifier => ({
    using: (queryRunner): FluentVerifierQueryBuilder => ({
        verify: () => ({
            onTable: tableName => ({
                ifThe: () => {
                    const forType = (type: 'COLUMN_NAME' | 'CONSTRAINT_NAME') => (value) => ({
                        exists: () => ({
                            thenExecuteWithFK: async (exec: (fkName: string) => Promise<string>) => {
                                const getFkQuery = queryReplacer(getFkName)
                                    .table(tableName)
                                    .itemName(type)
                                    .itemValue(value)
                                    .getQuery();
                                const loadedResult = await executeSqlAndGetResult(queryRunner, getFkQuery);
                                const execQuery = await exec(loadedResult);
                                if (execQuery) {
                                    const sql = queryReplacer(baseQuery)
                                        .table(tableName)
                                        .itemName(type)
                                        .itemValue(value)
                                        .forExecute(execQuery)
                                        .getQuery();
                                    await executeSql(queryRunner, sql);
                                }

                            },
                            thenExecute: async queryString => {
                                const sql = queryReplacer(baseQuery)
                                    .table(tableName)
                                    .itemName(type)
                                    .itemValue(value)
                                    .forExecute(queryString)
                                    .getQuery();
                                await executeSql(queryRunner, sql);
                            }
                        })
                    });
                    return {
                        column: forType('COLUMN_NAME'),
                        constraint: forType('CONSTRAINT_NAME')
                    };
                }
            })
        })
    })
});
type FluentVerifier = {
    using: (queryRunner: QueryRunner) => FluentVerifierQueryBuilder;
}
type FluentExecutor = {
    thenExecuteWithFK: (exec: (fkName: string) => Promise<string>) => Promise<void>;
    thenExecute: (queryString: string) => Promise<void>;
}

type FluentElementValue = {
    exists: () => FluentExecutor;
}
type FluentElementSelector = {
    column: (columnName: string) => FluentElementValue;
    constraint: (columnName: string) => FluentElementValue;
}

type FluentTableProcessSelector = {
    ifThe: () => FluentElementSelector
};
type FluentExistingQueryBuilder = {
    onTable: (tableName: string) => FluentTableProcessSelector
};
type FluentVerifierQueryBuilder = {
    verify: () => FluentExistingQueryBuilder
};

export default
    queryExecutor
