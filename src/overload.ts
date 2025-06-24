import { assertNever } from "./type-utils";

function foo<T extends boolean>(p: T): string;
function foo<T extends number>(p: T): number;
function foo(p: boolean | number): string | number {
  if (typeof p === "boolean") return p ? "yes" : "no";
  return p * 2;
}

const a = foo(true); // a = "yes"
const b = foo(3); // b = 6

function foo2<
  T extends boolean | number,
  R = T extends boolean ? string : T extends number ? number : never
>(p: T): R {
  switch (typeof p) {
    case "boolean":
      return (p ? "true" : "false") as R;
    case "number":
      return (p * 2) as R;
    default:
      return assertNever(p);
  }
}

const a2 = foo2(true); // a: string = "yes"
const b2 = foo2(3); // b: number = 6
