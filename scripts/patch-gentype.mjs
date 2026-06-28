#!/usr/bin/env node
// Post-genType codemod.
//
// The expression models in Brushless.res are GADTs: operands (and the shared
// AttributeValue.t value) carry their DynamoDB category as a type index. genType
// can't represent GADTs — it emits the indexed types either as opaque
// `abstract class` declarations or as non-generic structural unions, neither of
// which typechecks against the generated signatures (which apply `<...>` to them).
//
// genType DOES emit the generic function signatures correctly, so the breakage is
// confined to a few type *declarations*. This script swaps those for proper
// branded generic unions and widens a few erased/multi-category slots.
//
// The brand `(... ) & { _cat?: Cat }` is an optional, type-only field: it never
// exists at runtime, so real values stay assignable, but it makes `Cat`
// load-bearing so TS enforces the category (an unused type parameter would be
// ignored by TS's structural checks). The category tags are emitted as opaque
// classes (str/num/bin/…), which are nominal, so same-category checks stay strict.
//
// Source of truth: function signatures -> Brushless.res; the union bodies and
// category-union widenings below -> THIS FILE (keep in sync with the .res variants).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src", "Brushless.bs.ts");

// Declaration replacements: a regex anchor genType emits, the branded
// replacement, and a sentinel proving the replacement is already present.
const patches = [
  {
    name: "AttributeValue_t",
    // genType emits this as a non-generic structural union; brand it + add <Cat>.
    // The member shape matches each operand's AttributeValue member, so the typed
    // value constructors (AttributeValue.number, …) are usable directly as operands.
    anchor:
      /export type AttributeValue_t =\s*\n\s+\{ TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string \};/,
    patched: "export type AttributeValue_t<Cat> =",
    replacement: `export type AttributeValue_t<Cat> = ({ TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }) & { readonly _cat?: Cat };`,
  },
  {
    name: "Condition_operand",
    anchor:
      /export abstract class Condition_operand \{ protected opaque!: any \};[^\n]*/,
    patched: "export type Condition_operand<Cat> =",
    replacement: `export type Condition_operand<Cat> = ({
    TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: Condition_operand<unknown> }
) & { readonly _cat?: Cat };`,
  },
  {
    name: "Condition_condition",
    anchor:
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
    anchor:
      /export abstract class Update_operand \{ protected opaque!: any \};[^\n]*/,
    patched: "export type Update_operand<Cat> =",
    replacement: `export type Update_operand<Cat> = ({
    TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown> }
  | { TAG: "IfNotExists"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown> }
  | { TAG: "Sum"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown> }
  | { TAG: "Sub"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown> }
) & { readonly _cat?: Cat };`,
  },
];

// Text rewrites: widen erased / multi-category slots. Category tags are the bare
// shared names (str/num/bin/strSet/numSet/binSet/list_/map_).
const rewrites = [
  {
    name: "AttributeValue_anyValue",
    from: "export type AttributeValue_anyValue = AttributeValue_t<void>;",
    to: "export type AttributeValue_anyValue = AttributeValue_t<unknown>;",
  },
  {
    name: "AttributeValue_make (untyped escape hatch)",
    // make() yields an untyped value; brand it <never> so it stays assignable into
    // ANY operand category (the escape hatch). Use the typed constructors
    // (AttributeValue.string/number/…) when you want the category checked.
    from: "<cat>(x:AttributeValue_from<attributeValue>) => AttributeValue_t<cat>",
    to: "(x:AttributeValue_from<attributeValue>) => AttributeValue_t<never>",
  },
  {
    name: "Update_anyOperand",
    from: "export type Update_anyOperand = Update_operand<void>;",
    to: "export type Update_anyOperand = Update_operand<unknown>;",
  },
  {
    name: "Update_addOperand (Number|Set)",
    from: "export type Update_addOperand = Update_operand<void>;",
    to: "export type Update_addOperand = Update_operand<num | strSet | numSet | binSet>;",
  },
  {
    name: "Update_deleteOperand (Set)",
    from: "export type Update_deleteOperand = Update_operand<void>;",
    to: "export type Update_deleteOperand = Update_operand<strSet | numSet | binSet>;",
  },
  {
    name: "Condition_size (sizeable types)",
    // size() is valid only for String/Binary/Set/List/Map (not Number/Bool/Null).
    from: "<T1>(operand:Condition_operand<T1>) => Condition_operand<num>",
    to: "(operand:Condition_operand<str | bin | strSet | numSet | binSet | list_ | map_>) => Condition_operand<num>",
  },
  {
    name: "Condition_beginsWith (String|Binary)",
    // begins_with accepts String OR Binary; ReScript types it as String only.
    from: "operand:Condition_operand<str>)",
    to: "operand:Condition_operand<str | bin>)",
  },
];

let src = readFileSync(target, "utf8");
const applied = [];
const skipped = [];

for (const p of patches) {
  if (p.anchor.test(src)) {
    src = src.replace(p.anchor, p.replacement);
    applied.push(p.name);
  } else if (src.includes(p.patched)) {
    skipped.push(p.name);
  } else {
    console.error(
      `patch-gentype: FAILED — could not find the '${p.name}' declaration ` +
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
