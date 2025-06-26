declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;
export type ExtractBrand<T> = T extends { [__brand]: infer B } ? B : never;

/**
 * "Prettifying" a type in TypeScript refers to making complex or deeply nested
 * types more readable and understandable, especially in IDE hover previews and
 * error messages.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value ${value}`);
};
