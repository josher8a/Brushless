// Type-level regression test for the GADT-derived category safety on Update
// operands. Checked by `npm run gentype:check` (tsc --noEmit); runs no code.

import { Update, AttributePath, AttributeValue } from "./index";

const p = AttributePath.fromString("foo");
const id = p as unknown as import("./index").Identifier_t;
const v = AttributeValue.make({ value: { N: "1" }, alias: "n" });

// --- Allowed: + / - over (schema-less) operands; list_append over operands ---
Update.sum(v, v);
Update.sub(Update.sum(v, v), v); // sum yields a number, fits sub
Update.listAppend(p, p);
Update.ifNotExists(p, v);

// --- Allowed: a SET entry erases the operand category ---
const _u: import("./index").Update_update = {
  set: [
    [id, Update.sum(v, v)],
    [id, Update.listAppend(p, p)],
  ],
};
void _u;

// --- Rejected: + requires numbers; list_append yields a list ---
// @ts-expect-error  list_append -> operand<list_> cannot satisfy operand<num>
Update.sum(Update.listAppend(p, p), v);

// --- Rejected: list_append requires lists; + yields a number ---
// @ts-expect-error  sum -> operand<num> cannot satisfy operand<list_>
Update.listAppend(Update.sum(v, v), p);

// --- Typed number literals pin the number category for + / - ---
const m1 = Update.number({ value: 1, alias: "m1" });
const m2 = Update.number({ value: 2, alias: "m2" });
Update.sum(m1, m2);
Update.sub(Update.sum(m1, m2), m1);

// @ts-expect-error  list_append requires lists, not a number literal
Update.listAppend(m1, p);

const lst = Update.list({ value: [{ N: "1" }], alias: "lst" });
Update.listAppend(p, lst); // appending a typed list literal is fine
// @ts-expect-error  + requires numbers, not a list literal
Update.sum(lst, m1);
