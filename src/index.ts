import { createDbContext, executeSelectQuery } from "./query-builder";
import {
  assertNever,
  Branded,
  ExtractBrand,
  Prettify,
  ReturnNonVoid,
} from "./type-utils";

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

const rall = executeSelectQuery<"order", MySchema["order"]>("order")("*");

const ctx = createDbContext<MySchema>();

const r2 = ctx.selectFrom("order").select(["email", "user"]).execute();
const r3 = ctx
  .selectFrom("orderItem")
  .select(["description", "quantity"])
  .execute();
const r4 = ctx.selectFrom("order").select("*").execute();

function tt<
  P extends string | number,
  R = Prettify<P extends string ? boolean : P extends number ? string : never>
>(p: P): R {
  if (typeof p === "string") {
    return true as R;
  }
  if (typeof p === "number") return p.toString() as R;
  return assertNever(p);
}

const t1 = tt("foo");
const t2 = tt(3);

const map =
  <A, B>(fn: ReturnNonVoid<(a: A) => B>) =>
  (a: A): B => {
    return fn(a);
  };

function num2string(n: number) {
  console.log(n.toString());
  // missing return n.toString();
}
// compile time error
//let k = map(num2string)(5);
// console.log("k", k);

type Unit<U extends string> = Branded<number, U>;
const div = <A extends string, B extends string>(a: Unit<A>, b: Unit<B>) =>
  (a / b) as Unit<`${A}/${B}`>;

//derived brands
const distance = 5 as Unit<"ft">;
const time = 10 as Unit<"sec">;
const speed = div(distance, time); //speed has brand "ft/sec"
