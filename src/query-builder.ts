import { Prettify } from "./type-utils";
type TableName<Schema> = keyof Schema;

export type DBContext<Schema> = {
  selectFrom: <TName extends TableName<Schema>>(
    table: TName
  ) => SelectQueryBuilder<TName, Schema[TName]>;
};

export type SelectQueryBuilder<TName, TSchema> = {
  select: <Columns extends (keyof TSchema)[], P extends "*" | [...Columns]>(
    columns: P
  ) => SelectQueryExecutor<TSchema, Columns, P>;
};

export type SelectQueryExecutor<
  TSchema,
  Columns extends (keyof TSchema)[],
  P extends "*" | [...Columns],
  Result = SelectResult<TSchema, P>
> = {
  execute: () => Result[];
};

export const createDbContext = <Schema>(): DBContext<Schema> => ({
  selectFrom: <TName extends TableName<Schema>>(table: TName) =>
    createSQB<TName, Schema[TName]>(table),
});

const createSQB = <TName, TSchema>(
  table: TName
): SelectQueryBuilder<TName, TSchema> => ({
  select: <Columns extends (keyof TSchema)[], P extends "*" | [...Columns]>(
    columns: P
  ) => ({
    execute: () => executeSelectQuery<TName, TSchema>(table)(columns),
  }),
});

type SelectResult<TSchema, P> = Prettify<
  P extends "*"
    ? TSchema
    : P extends (keyof TSchema)[]
    ? Pick<TSchema, P[number]>
    : never
>;

export const executeSelectQuery =
  <TName, TSchema>(table: TName) =>
  <
    Columns extends (keyof TSchema)[],
    P extends "*" | [...Columns],
    Result = SelectResult<TSchema, P>
  >(
    columns: P
  ): Result[] => {
    const cols =
      columns === "*" ? "*" : columns.map((c) => c.toString()).join(",");
    const sql = `select ${cols} from ${table}`;
    console.log("SQL", sql);
    return [] as Result[];
  };
