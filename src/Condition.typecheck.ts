// Type-level regression test for the GADT-derived category safety that the
// post-genType codemod (scripts/patch-gentype.mjs) restores to the TS surface.
// This file is checked by `npm run gentype:check` (tsc --noEmit). It runs no
// code; the `@ts-expect-error` lines fail the build if the safety regresses.

import { Condition, AttributePath, AttributeValue } from "./index";

const foo = AttributePath.fromString("foo");
const id = foo as unknown as import("./index").Identifier_t;
const strVal = AttributeValue.make({ value: { S: "x" }, alias: "x" });

// --- Allowed: begins_with with a string-ish operand ---
Condition.beginsWith(id, strVal);

// --- Allowed: size() yields a number, compared against another operand ---
const sz = Condition.size(foo); // Condition_operand<Condition_num>
Condition.equals(sz, sz);

// --- Allowed: condition stays a discriminated union (TAG narrowing works) ---
const c = Condition.equals(strVal, strVal);
if (c.TAG === "Comparison") {
  const _cmp: import("./index").comparator = c.comparator;
  void _cmp;
}

// --- Rejected: begins_with requires a string; size() is a number ---
// @ts-expect-error  size() -> operand<num> cannot satisfy operand<str>
Condition.beginsWith(id, Condition.size(foo));

// --- Typed value constructors pin the category of literals ---
const n1 = Condition.number({ value: 1, alias: "n1" });
const n2 = Condition.number({ value: 2, alias: "n2" });
const s1 = Condition.string({ value: "x", alias: "s1" });

// Allowed: same-category comparisons / begins_with on a string literal
Condition.equals(n1, n2);
Condition.between(n1, { lower: n1, upper: n2 });
Condition.beginsWith(id, s1);

// @ts-expect-error  comparing a number literal to a string literal
Condition.equals(n1, s1);
// @ts-expect-error  begins_with requires a string, not a number literal
Condition.beginsWith(id, n1);

const b1 = Condition.boolean({ value: true, alias: "b1" });
Condition.equals(b1, Condition.boolean({ value: false, alias: "b2" }));
// @ts-expect-error  comparing a boolean literal to a number literal
Condition.equals(b1, n1);

// --- Multi-category: begins_with accepts String OR Binary, but not Number ---
const bin = Condition.binary({ value: new Uint8Array([1, 2]), alias: "bin" });
Condition.beginsWith(id, s1); // String ok
Condition.beginsWith(id, bin); // Binary ok
// @ts-expect-error  begins_with does not accept a number
Condition.beginsWith(id, n1);
// @ts-expect-error  binary and string are still distinct for equality
Condition.equals(bin, s1);

// --- attribute_type takes a DynamoDB type code, not an arbitrary value ---
Condition.attributeType(id, "L");
Condition.attributeType(id, "BOOL");
// @ts-expect-error  "X" is not a valid DynamoDB type code
Condition.attributeType(id, "X");

// --- size() is valid only on String/Binary/Set/List/Map (and paths) ---
Condition.size(foo); // path ok
Condition.size(s1); // string ok
Condition.size(Condition.stringSet({ value: ["a"], alias: "ss" })); // set ok
// @ts-expect-error  size() is not valid on a number
Condition.size(n1);
// @ts-expect-error  size() is not valid on a boolean
Condition.size(b1);

// --- ordering (< <= > >=, BETWEEN) is valid only on String/Number/Binary ---
Condition.lessThan(n1, n2); // number ok
Condition.greaterThan(s1, Condition.string({ value: "y", alias: "s2" })); // string ok
Condition.between(n1, { lower: n1, upper: n2 }); // number bounds ok
// @ts-expect-error  ordering is not valid on booleans
Condition.lessThan(b1, Condition.boolean({ value: false, alias: "b3" }));
// equals/notEquals remain valid on any type (equality, not ordering)
Condition.equals(b1, Condition.boolean({ value: false, alias: "b4" }));
// contains: operand stays polymorphic — the path's type (String vs Set) is not
// statically known (schema-less), so the spec's element-type rule is unenforceable.
Condition.contains(id, s1);
