import { Prettify } from "./type-utils";
type TableName<Schema> = keyof Schema;

export type DBContext<Schema> = {
  selectFrom: <TName extends TableName<Schema>>(
    table: TName
  ) => SelectQueryBuilder<TName, Schema[TName]>;
};

export type SelectQueryBuilder<TName, TSchema> = {
  select: <Columns extends (keyof TSchema)[]>(
    columns: [...Columns]
  ) => SelectQueryExecutor<TSchema, Columns>;
};

export type SelectQueryExecutor<
  TSchema,
  Columns extends (keyof TSchema)[],
  Result = Prettify<Pick<TSchema, Columns[number]>>
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
  select: <Columns extends (keyof TSchema)[]>(columns: [...Columns]) => ({
    execute: () => executeSelectQuery<TName, TSchema>(table)(columns),
  }),
});

export const executeSelectQuery =
  <TName, TSchema>(table: TName) =>
  <
    Columns extends (keyof TSchema)[],
    Result = Prettify<Pick<TSchema, Columns[number]>>
  >(
    columns: [...Columns]
  ): Result[] => {
    const sql = `select ${columns
      .map((c) => c.toString())
      .join(",")} from ${table}`;
    console.log("SQL", sql);
    return [] as Result[];
  };
