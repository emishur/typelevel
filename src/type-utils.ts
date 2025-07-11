declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

/**
 * "Prettifying" a type in TypeScript refers to making complex or deeply nested
 * types more readable and understandable, especially in IDE hover previews and
 * error messages.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Guarantee that function of type F always returns a value
 */
export type ReturnNonVoid<F extends (...args: any) => any> =
  ReturnType<F> extends void ? never : F;

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value ${value}`);
};
