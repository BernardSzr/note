---
title: TypeScript Advanced Types
date: 2024-11-15
tags: [typescript, javascript, programming, types]
aliases: [TypeScript进阶, TS类型]
---

# TypeScript Advanced Types

> [!abstract] Overview
> TypeScript's type system is one of the most powerful in mainstream programming languages. This note covers advanced type features that can make your code safer and more expressive.

## Conditional Types

> [!info] What Are Conditional Types?
> Conditional types allow you to create types that depend on other types.

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

> [!tip] Real-World Use
> ```typescript
> type ApiResponse<T> = T extends "user" 
>   ? UserData 
>   : T extends "post" 
>     ? PostData 
>     : never;
> ```

## Mapped Types

> [!note] Transforming Types
> Mapped types let you create new types by transforming existing ones.

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Practical Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserUpdate = Partial<User>;  // All fields optional
type UserPreview = Pick<User, "id" | "name">;  // Only id and name
type UserWithoutEmail = Omit<User, "email">;  // All except email
```

> [!warning] Don't Overuse
> Complex mapped types can be hard to read. Use them judiciously.

## Template Literal Types

> [!info] String Manipulation
> TypeScript can manipulate string types at the type level.

```typescript
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSSpacing = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | ... | "padding-left"
```

> [!example] Real-World Use
> ```typescript
> type Route = "/users" | "/posts" | "/comments";
> type ApiRoute = `/api${Route}`;
> // "/api/users" | "/api/posts" | "/api/comments"
> ```

## Discriminated Unions

> [!tip] Pattern Matching
> Discriminated unions enable exhaustive pattern matching.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

> [!warning] Exhaustiveness Checking
> ```typescript
> function assertNever(x: never): never {
>   throw new Error("Unexpected value");
> }
> 
> function area(shape: Shape): number {
>   switch (shape.kind) {
>     case "circle":
>       return Math.PI * shape.radius ** 2;
>     // ... other cases
>     default:
>       return assertNever(shape); // Compile error if case missing
>   }
> }
> ```

## Utility Types

> [!info] Built-in Helpers
> TypeScript provides many utility types:

| Type | Purpose | Example |
|------|---------|---------|
| `Partial<T>` | All optional | `Partial<User>` |
| `Required<T>` | All required | `Required<Config>` |
| `Readonly<T>` | All readonly | `Readonly<State>` |
| `Pick<T, K>` | Select fields | `Pick<User, "id" | "name">` |
| `Omit<T, K>` | Exclude fields | `Omit<User, "password">` |
| `Record<K, V>` | Key-value map | `Record<string, number>` |
| `Exclude<T, U>` | Remove types | `Exclude<"a" | "b", "a">` |
| `Extract<T, U>` | Keep types | `Extract<"a" | "b", "a">` |
| `NonNullable<T>` | Remove null | `NonNullable<string | null>` |
| `ReturnType<T>` | Function return | `ReturnType<typeof fn>` |
| `Parameters<T>` | Function params | `Parameters<typeof fn>` |

## Infer Keyword

> [!tip] Type Inference
> The `infer` keyword lets you extract types from other types.

```typescript
// Extract array element type
type ElementOf<T> = T extends (infer E)[] ? E : never;

type A = ElementOf<string[]>;  // string
type B = ElementOf<number[]>;  // number

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract promise type
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type C = Unwrap<Promise<string>>;  // string
type D = Unwrap<number>;           // number
```

## Branded Types

> [!note] Type Safety for Primitives
> Branded types prevent mixing up similar primitive types.

```typescript
type UserId = string & { __brand: "UserId" };
type PostId = string & { __brand: "PostId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User {
  // ...
}

const userId = createUserId("123");
const postId = "456" as PostId;

getUser(userId);  // ✅ Works
getUser(postId);  // ❌ Compile error
```

> [!danger] Type Assertions
> Avoid `as` assertions when possible. Branded types are safer.

## Real-World Patterns

> [!example] API Response Pattern
> ```typescript
> type SuccessResponse<T> = {
>   status: "success";
>   data: T;
> };
> 
> type ErrorResponse = {
>   status: "error";
>   message: string;
>   code: number;
> };
> 
> type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
> 
> function handleResponse<T>(response: ApiResponse<T>) {
>   if (response.status === "success") {
>     // TypeScript knows response.data exists
>     console.log(response.data);
>   } else {
>     // TypeScript knows response.message exists
>     console.error(response.message);
>   }
> }
> ```

> [!note] See Also
> - [[Web Development Basics]] — TypeScript fundamentals
> - [[Git Version Control]] — Version controlling TypeScript projects
> - [[How I Take Notes]] — Organizing type patterns
> - [[Machine Learning Intro]] — TypeScript in ML applications

---

*Tags: #typescript #javascript #programming #types*
