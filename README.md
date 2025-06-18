# Testbed for Typescript Type-Level Programming

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

    ### Array of Keys from Type

```typescript

type A<T> = (keyof T)[];  
type User = { id: number; email: string };  
type Keys = A<User>; // ⇒ ("id" | "email")[]
```

  ### Preserve Literal Tuple

```typescript

const fields = ["id", "email"] as const;  
// type: readonly ["id", "email"]
```

  ### Tuple Inference in Function

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

  ### Add Readonly to Tuple

```typescript

type T = ["id", "email"];  
type R = readonly [...T]; // ⇒ readonly ["id", "email"]
```

  ### Enforce Immutable Literal Inference

```typescript

const fields = ["id", "email"] as const;  
// Prevents widening to string[]
```

  ### Function Returns Literal Tuple
  
```typescript

function get(): readonly ["id", "email"] {  
  return ["id", "email"] as const;  
}
```

