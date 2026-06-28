#!/usr/bin/env node
// Post-genType codemod.
//
// Why this exists: the expression models in Brushless.res are GADTs (operands
// carry their DynamoDB value category as a type index — e.g. `size` yields a
// number, `begins_with` requires a string). genType cannot represent a GADT, so
// it bails and emits the indexed types as opaque `abstract class` declarations
// with NO type parameter. The result does not even typecheck: every generated
// signature still applies a type argument to them (`Condition_operand<T1>`),
// which TS rejects (TS2315 "is not generic").
//
// genType DOES emit the generic function signatures correctly, so the only
// breakage is the type *declarations*. This script swaps those opaque classes
// for proper branded generic unions. The brand (`_cat?: Cat`) is an optional,
// type-only field: it never exists at runtime, so real values stay assignable,
// but it makes `Cat` load-bearing so TS enforces the category (an unused type
// parameter would be ignored by TS's structural checks — see the spike notes).
//
// Source of truth:
//   - function signatures  -> Brushless.res (genType derives them)
//   - the union bodies below -> THIS FILE (kept in sync with the .res variants)
// If you add/rename a constructor in a patched module, update the body here.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src", "Brushless.bs.ts");

// Each patch: the opaque-class anchor genType emits, the branded replacement,
// and a sentinel that proves the replacement is already present (idempotency).
const patches = [
  {
    name: "Condition_operand",
    opaque:
      /export abstract class Condition_operand \{ protected opaque!: any \};[^\n]*/,
    patched: "export type Condition_operand<Cat> =",
    replacement: `export type Condition_operand<Cat> =
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[]; readonly _cat?: Cat }
  | { TAG: "AttributeName"; readonly name: string; readonly _cat?: Cat }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string; readonly _cat?: Cat }
  | { TAG: "Size"; readonly operand: Condition_operand<unknown>; readonly _cat?: Cat };`,
  },
  {
    name: "Condition_condition",
    opaque:
      /export abstract class Condition_condition \{ protected opaque!: any \};[^\n]*/,
    patched: "export type Condition_condition =",
    replacement: `export type Condition_condition =
    { TAG: "Comparison"; readonly lhs: Condition_operand<unknown>; readonly comparator: comparator; readonly rhs: Condition_operand<unknown> }
  | { TAG: "Between"; readonly operand: Condition_operand<unknown>; readonly limits: Condition_limits<unknown> }
  | { TAG: "In"; readonly operand: Condition_operand<unknown>; readonly list: Condition_operand<unknown>[] }
  | { TAG: "And"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Or"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Not"; readonly condition: Condition_condition }
  | { TAG: "AttributeExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeNotExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeType"; readonly identifier: Identifier_t; readonly operand: Condition_operand<unknown> }
  | { TAG: "BeginsWith"; readonly identifier: Identifier_t; readonly operand: Condition_operand<unknown> }
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: Condition_operand<unknown> }
  | { TAG: "ToContains"; readonly identifier: Identifier_t; readonly operand: Condition_operand<unknown> };`,
  },
  {
    name: "Update_operand",
    opaque:
      /export abstract class Update_operand \{ protected opaque!: any \};[^\n]*/,
    patched: "export type Update_operand<Cat> =",
    replacement: `export type Update_operand<Cat> =
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[]; readonly _cat?: Cat }
  | { TAG: "AttributeName"; readonly name: string; readonly _cat?: Cat }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string; readonly _cat?: Cat }
  | { TAG: "ListAppend"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown>; readonly _cat?: Cat }
  | { TAG: "IfNotExists"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown>; readonly _cat?: Cat }
  | { TAG: "Sum"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown>; readonly _cat?: Cat }
  | { TAG: "Sub"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown>; readonly _cat?: Cat };`,
  },
];

// Simple text rewrites (not opaque-class declarations). Each has a `from`
// (current genType output), a `to`, and is a no-op if `to` is already present.
const rewrites = [
  {
    name: "Update_anyOperand",
    // genType emits the erased slot as `<void>`; with the brand that would
    // reject any typed operand, so widen it to `<unknown>` (accepts any category).
    from: "export type Update_anyOperand = Update_operand<void>;",
    to: "export type Update_anyOperand = Update_operand<unknown>;",
  },
  {
    name: "Update_addOperand (Number|Set)",
    // ADD supports only Number or Set data types (spec).
    from: "export type Update_addOperand = Update_operand<void>;",
    to: "export type Update_addOperand = Update_operand<Update_num | Update_strSet | Update_numSet | Update_binSet>;",
  },
  {
    name: "Update_deleteOperand (Set)",
    // DELETE supports only Set data types (spec).
    from: "export type Update_deleteOperand = Update_operand<void>;",
    to: "export type Update_deleteOperand = Update_operand<Update_strSet | Update_numSet | Update_binSet>;",
  },
  {
    name: "Condition_size (sizeable types)",
    // size() is valid only for String, Binary, Set, List, Map (not Number/Bool/Null).
    // Widen the (otherwise unconstrained) parameter to that union. Anchored on the
    // `<T1>(operand:...)=>...<Condition_num>` shape, unique to size.
    from: "<T1>(operand:Condition_operand<T1>) => Condition_operand<Condition_num>",
    to: "(operand:Condition_operand<Condition_str | Condition_bin | Condition_strSet | Condition_numSet | Condition_binSet | Condition_list_ | Condition_map_>) => Condition_operand<Condition_num>",
  },
  {
    name: "Condition_beginsWith (String|Binary)",
    // DynamoDB begins_with accepts String OR Binary. ReScript can only type the
    // parameter as one opaque category (`str`), so widen the emitted parameter to
    // the union here. Anchored on the `operand:` parameter (the `string` value
    // constructor returns the same type but in return position, no `operand:`).
    // Replaces both the `const` and the module-object-literal occurrences.
    from: "operand:Condition_operand<Condition_str>)",
    to: "operand:Condition_operand<Condition_str | Condition_bin>)",
  },
];

let src = readFileSync(target, "utf8");
const applied = [];
const skipped = [];

for (const p of patches) {
  if (p.opaque.test(src)) {
    src = src.replace(p.opaque, p.replacement);
    applied.push(p.name);
  } else if (src.includes(p.patched)) {
    skipped.push(p.name); // already patched (idempotent re-run)
  } else {
    console.error(
      `patch-gentype: FAILED — could not find the opaque '${p.name}' declaration ` +
        `nor a previously-patched one in ${target}.\n` +
        `genType output likely changed shape. Update scripts/patch-gentype.mjs.`,
    );
    process.exit(1);
  }
}

for (const r of rewrites) {
  if (src.includes(r.from)) {
    src = src.split(r.from).join(r.to);
    applied.push(r.name);
  } else if (src.includes(r.to)) {
    skipped.push(r.name);
  } else {
    console.error(
      `patch-gentype: FAILED — could not find the '${r.name}' text to rewrite ` +
        `nor a previously-rewritten one in ${target}.\n` +
        `genType output likely changed shape. Update scripts/patch-gentype.mjs.`,
    );
    process.exit(1);
  }
}

if (applied.length) {
  writeFileSync(target, src);
  console.log(`patch-gentype: patched ${applied.join(", ")}`);
}
if (skipped.length) {
  console.log(`patch-gentype: already patched ${skipped.join(", ")} (skipped)`);
}
