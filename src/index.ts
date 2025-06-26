import { createDbContext, executeSelectQuery } from "./query-builder";
import { Branded, Prettify } from "./type-utils";

type Id = Branded<number, "Id">;
type Amount = Branded<number, "amount">;

function createAmountRecord(id: Id, amount: Amount) {}

type Options = "a" | "b" | "c" | (string & {});

function fn(o: Options) {}

fn("s");

type O = {
  foo: number;
  bar: string;
};
type KK = (keyof O & {})[];
function accept<A extends KK, R = Prettify<Pick<O, A[number]>>>(
  input: readonly [...A]
): R {
  console.log("ACCEPT", input);
  return {} as R;
}

//generated from the DB schema introspection
type MySchema = {
  order: {
    id: number;
    user: string;
    email: string;
    total: number;
  };
  orderItem: {
    id: number;
    orderId: number;
    sku: string;
    description: string;
    quantity: number;
  };
};

const r = executeSelectQuery<"order", MySchema["order"]>("order")([
  "email",
  "user",
]);

const ctx = createDbContext<MySchema>();

const r2 = ctx.selectFrom("order").select(["email", "user"]).execute();
const r3 = ctx
  .selectFrom("orderItem")
  .select(["description", "quantity"])
  .execute();
