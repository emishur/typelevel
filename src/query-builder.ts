import { Prettify } from "./type-utils";
type TableName<Schema> = keyof Schema;

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
