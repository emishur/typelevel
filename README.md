# Testbed for Typescript Type-Level Programming

## Table of Contents

- [Prettify](#prettify)
- [Branded Types](#branded-types)
- [Open Union Type](#open-union-type)
- [Assert never and Exhaustive switch/case Matching](#assert-never-and-exhaustive-switchcase-matching)
- [Type Safe Function Return Type Overload](#type-safe-function-return-type-overload)
- [Guarantee That The Function Always Returns a Value](#guarantee-that-the-function-always-returns-a-value)
- [Type Transformation Cheat Sheet](#type-transformation-cheat-sheet)
  - [Union to Array](#union-to-array)
  - [Tuple to Union](#tuple-to-union)
  - [Preserve Literal Tuple](#preserve-literal-tuple)
  - [Function Returns Literal Tuple](#function-returns-literal-tuple)
  - [Add Readonly to Tuple](#add-readonly-to-tuple)
  - [Array of Keys from Type](#array-of-keys-from-type)
  - [Tuple Inference in Function](#tuple-inference-in-function)
  - [Pick Properties by Tuple](#pick-properties-by-tuple)
- [Example of Simple Type Safe SQL Query Builder](#example-of-simple-type-safe-sql-query-builder)

## Prettify

"Prettifying" a type in TypeScript refers to making complex or deeply nested
types more readable and understandable, especially in IDE hover previews and
error messages.

```typescript
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
```

`{ [K in keyof T]: T[K]; }` flattens intersection types. `& {}` forces TypeScript
to compute the final shape of the type.

## Branded Types

```typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;
```

```typescript
type UserId = Branded<number, "userId">;
type OrderId = Branded<number, "orderId">;

function getUser(id: UserId){}

const userId = 'user-123' as UserId;
const orderId = 'order-456' as OrderId;

getUser(userId);     // OK
getUser(orderId);    // Error: Argument of type 'OrderId' is not assignable to
// parameter of type 'UserId'
```

Brand exists only on compile time.

Derived brands

```typescript
type Unit<U extends string> = Branded<number, U>;
const div = <A extends string, B extends string>(a: Unit<A>, b: Unit<B>) =>
  (a / b) as Unit<`${A}/${B}`>;

const distance = 5 as Unit<"ft">;
const time = 10 as Unit<"sec">;
const speed = div(distance, time); //speed has brand "ft/sec"
```

## Open Union Type

```typescript
type Options = "a" | "b" | "c" | (string & {});

function fn(o: Options) {};
//Intellisense will suggests values "a", "b", "c" for the parameter o, but
// will accept any other string
```

## Assert never and Exhaustive switch/case Matching

```typescript
const assertNever = (value: never): never => {
  throw new Error(`Unexpected value ${value}`);
};
```

```typescript
type T = "a" | "b";


function fn1(v: T) {
  switch (v) {
    case "a":
      console.log(v);
      break;
    default:
      // case "b" is missing, but there is no compile time error
      throw new Error(`Unexpected value ${v}`);
  }
}

function fn2(v: T) {
  switch (v) {
    case "a":
      console.log(v);
      break;
    default:
      // case "b" is missing, and there IS a compile time error
      assertNever(v);
  }
}

//exhaustive match w/o errors
function fn3(v: T) {
  switch (v) {
    case "a":
      console.log(v);
      break;
    case "b":
      console.log(v);
      break;
    default:
      assertNever(v);
  }
}
```

## Type Safe Function Return Type Overload

```typescript
function foo<T extends boolean>(p: T): string;
function foo<T extends number>(p: T): number;
function foo(p: boolean | number): string | number {
  if (typeof p === "boolean") return p ? "yes" : "no";
  return p * 2;
}

const a = foo(true); // a: string = "yes"
const b = foo(3); // b: number = 6
```

Same with generics and conditional types:

```typescript
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
```

Both implementations still do not check if the wrong type returned by the function
implementation on compile time.

## Guarantee That The Function Always Returns a Value

```typescript
/**
 * Guarantee that function of type F always returns a value
 */
export type ReturnNonVoid<F extends (...args: any) => any> =
  ReturnType<F> extends void ? never : F;

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
let k = map(num2string)(5);
```

## Type Transformation Cheat Sheet

### Union to Array

```typescript
type U = "id" | "email";  
type A = U[]; // ⇒ ("id" | "email")[]
```

### Tuple to Union

```typescript
type T = ["id", "email"];  
type U = T[number]; // ⇒ "id" | "email"
```

### Preserve Literal Tuple

```typescript
const fields = ["id", "email"] as const;  
// type: readonly ["id", "email"]
// prevents further type inference from widening to type string[]
```

### Function Returns Literal Tuple
  
```typescript
function get(): readonly ["id", "email"] {
  // prevents caller type inference from widening to type string[]
  return ["id", "email"] as const;  
}
```

### Add Readonly to Tuple

```typescript
type T = ["id", "email"];  
type R = readonly [...T]; // ⇒ readonly ["id", "email"]
```


### Array of Keys from Type

```typescript
type A<T> = (keyof T)[];  
type User = { id: number; email: string };  
type Keys = A<User>; // ⇒ ("id" | "email")[]
```

### Tuple Inference in Function

```typescript
type U = "a" | "b" | "c";
//items can be a tuple of values from union type U only
function select<K extends U[]>(items: [...K]) {}

select(["a", "c"])// items inferred as tuple: ["a", "c"]
```

### Pick Properties by Tuple

```typescript
type K = ["id", "email"];  
type Result<T, K extends readonly (keyof T)[]> = Pick<T, K[number]>;  
// Extracts only the fields listed in K
```

## Example of Simple Type Safe SQL Query Builder

Database schema (generated by some introspection tool)

```typescript
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
```

Usage:

```typescript
const ctx = createDbContext<MySchema>();

//selectFrom() accepts only "order" or "orderItem" table names
//select() accepts only array of column names from a selected table or "*"

// r2 type is { user: string, email: string }[]
const r2 = ctx.selectFrom("order").select(["email", "user"]).execute();

// r3 type is { description: string, quantity: number }[]
const r3 = ctx
  .selectFrom("orderItem")
  .select(["description", "quantity"])
  .execute();

// r4 type is { id: number, user: string, email: string, total: number }[]
const r4 = ctx.selectFrom("order").select("*").execute();
```

[Query builder implementation](./src/query-builder.ts)
