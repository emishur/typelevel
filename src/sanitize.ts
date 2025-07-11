import { z } from "zod";

const sanitize =
  <S extends z.ZodType>(schema: S) =>
  <V extends z.infer<typeof schema>>(value: V): z.infer<typeof schema> =>
    schema.parse(value);

const simpleSchema = z.object({
  foo: z.string(),
  bar: z.number(),
});
type Simple = z.infer<typeof simpleSchema>;

const sanitizeSimple = sanitize(simpleSchema);
const simple = { foo: "foo", bar: 1, buz: "REMOVE" };
const sanitizedSimple = sanitizeSimple(simple);
console.log("simple", sanitizedSimple);

const withNestedSchema = z.object({
  a: z.string(),
  nested: simpleSchema,
});
type Nested = z.infer<typeof withNestedSchema>;
const sanitizeWithNested = sanitize(withNestedSchema);
const withNested = {
  a: "a",
  nested: simple,
  extra: "REMOVE",
};
const sanitizedNested = sanitizeWithNested(withNested);
console.log("nested", sanitizedNested);

const nestedArraySchema = z.object({
  simples: z.array(simpleSchema),
});
type NestedArray = z.infer<typeof nestedArraySchema>;
const sanitizeNestedArray = sanitize(nestedArraySchema);

const nestedArray = { simples: [simple, simple] };
const sanitizedNestedArray = sanitizeNestedArray(nestedArray);
console.log("nested array", sanitizedNestedArray);
