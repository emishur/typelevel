export type TableName<Schema> = keyof Schema;

export const executeSelectQuery =
  <TName, TSchema>(table: TName) =>
  <Columns extends (keyof TSchema)[]>(columns: [...Columns]) => {
    const sql = `select ${columns
      .map((c) => c.toString())
      .join(",")} from ${table}`;
    console.log("SQL", sql);
  };
