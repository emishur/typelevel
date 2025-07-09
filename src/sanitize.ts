import { z } from "zod";

const sanitize =
  <S extends z.ZodType>(schema: S) =>
  <V extends z.infer<typeof schema>>(value: V): z.infer<typeof schema> =>
    schema.parse(value);

const schema: z.ZodType = z.object({
  foo: z.string(),
  bar: z.number(),
});
type T = z.infer<typeof schema>;

const sanitized = sanitize(schema)({ foo: "foo", bar: 1, buz: "REMOVE" });
console.log(sanitized);
