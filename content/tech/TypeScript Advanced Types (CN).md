---
title: TypeScript Advanced Types
date: 2024-11-15
tags: [typescript, javascript, programming, types]
aliases: [TypeScript进阶, TS类型]
lang: zh-CN
---

# TypeScript Advanced Types

> [!abstract] Overview
> TypeScript's type system is one of the most powerful in mainstream programming languages. This note covers advanced type features.

## Conditional Types

> [!info] What Are Conditional Types?
> Conditional types allow you to create types that depend on other types.

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

## Mapped Types

> [!note] Transforming Types
> Mapped types let you create new types by transforming existing ones.

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
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

type UserUpdate = Partial<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;
```

## Template Literal Types

> [!info] String Manipulation
> TypeScript can manipulate string types at the type level.

```typescript
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"
```

## Discriminated Unions

> [!tip] Pattern Matching
> Discriminated unions enable exhaustive pattern matching.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

## Utility Types

| Type | Purpose | Example |
|------|---------|---------|
| `Partial<T>` | All optional | `Partial<User>` |
| `Required<T>` | All required | `Required<Config>` |
| `Readonly<T>` | All readonly | `Readonly<State>` |
| `Pick<T, K>` | Select fields | `Pick<User, "id">` |
| `Omit<T, K>` | Exclude fields | `Omit<User, "email">` |
| `Record<K, V>` | Key-value map | `Record<string, number>` |

## Branded Types

> [!note] Type Safety for Primitives
> Branded types prevent mixing up similar primitive types.

```typescript
type UserId = string & { __brand: "UserId" };
type PostId = string & { __brand: "PostId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

const userId = createUserId("123");
const postId = "456" as PostId;

getUser(userId);  // ✅ Works
getUser(postId);  // ❌ Compile error
```

> [!note] See Also
> - [[Web Development Basics]] — TypeScript fundamentals
> - [[Git Version Control]] — Version controlling TypeScript projects
> - [[How I Take Notes]] — Organizing type patterns

---

*Tags: #typescript #javascript #programming #types*
