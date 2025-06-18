# Testbed for Typescript Type-Level Programming

## Type Transformation Cheat Sheet

### Table of Contents

- [Union to Array](#union-to-array)
- [Tuple to Union](#tuple-to-union)
- [Preserve Literal Tuple](#preserve-literal-tuple)
- [Function Returns Literal Tuple](#function-returns-literal-tuple)
- [Add Readonly to Tuple](#add-readonly-to-tuple)
- [Array of Keys from Type](#array-of-keys-from-type)
- [Tuple Inference in Function](#tuple-inference-in-function)
- [Pick Properties by Tuple](#pick-properties-by-tuple)

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

Note: inspect `K extends readonly (keyof T)[]`

```typescript
function select<T, K extends readonly (keyof T)[]>(cols: readonly [...K]) {}  
// cols inferred as tuple: ["id", "email"]
```

### Pick Properties by Tuple

```typescript
type K = ["id", "email"];  
type Result<T, K extends readonly (keyof T)[]> = Pick<T, K[number]>;  
// Extracts only the fields listed in K
```
