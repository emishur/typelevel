import { Branded } from "./type-utils";

type Id = Branded<number, "Id">;
type Amount = Branded<number, "amount">;

function createAmountRecord(id: Id, amount: Amount) {}

type Options = "a" | "b" | "c" | (string & {});

function fn(o: Options) {}

fn("s");

console.log("Hello World");
