/* TypeScript file generated from Brushless.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as BrushlessJS from './Brushless.bs.js';

import type {AtLeastOne as $$atLeastOne} from './external';

export type atLeastOne<a> = $$atLeastOne<a>;

export type attributeValue_ = {
  readonly S?: string; 
  readonly N?: string; 
  readonly B?: Uint8Array; 
  readonly SS?: string[]; 
  readonly NS?: string[]; 
  readonly BS?: Uint8Array[]; 
  readonly M?: {[id: string]: atLeastOne<attributeValue_>}; 
  readonly L?: atLeastOne<attributeValue_>[]; 
  readonly NULL?: boolean; 
  readonly BOOL?: boolean; 
  readonly "$unknown"?: [string, unknown]
};

export type attributeValue = atLeastOne<attributeValue_>;

export type AttributeName_t = 
    { TAG: "AttributeName"; readonly name: string };

export abstract class str { protected opaque!: any }; /* simulate opaque types */

export abstract class num { protected opaque!: any }; /* simulate opaque types */

export abstract class bool_ { protected opaque!: any }; /* simulate opaque types */

export abstract class bin { protected opaque!: any }; /* simulate opaque types */

export abstract class strSet { protected opaque!: any }; /* simulate opaque types */

export abstract class numSet { protected opaque!: any }; /* simulate opaque types */

export abstract class binSet { protected opaque!: any }; /* simulate opaque types */

export abstract class list_ { protected opaque!: any }; /* simulate opaque types */

export abstract class map_ { protected opaque!: any }; /* simulate opaque types */

export type AttributeValue_t<Cat> = ({ TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }) & { readonly _cat?: Cat };

export type AttributeValue_anyValue = AttributeValue_t<unknown>;

export type AttributeValue_from<a> = { readonly value: a; readonly alias: string };

export type AttributePath_sub = 
    { TAG: "AttributeName"; readonly name: string }
  | { TAG: "ListIndex"; readonly index: number };

export type AttributePath_t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] };

export type AttributePath_parseState = "Name" | "Index";

export type Register_t = { names?: {[id: string]: string}; values?: {[id: string]: attributeValue} };

export type comparator = "=" | "<>" | "<" | "<=" | ">" | ">=";

export type Identifier_t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string };

export type Condition_operand<Cat> = ({
    TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: Condition_operand<unknown> }
) & { readonly _cat?: Cat };

export type Condition_limits<a> = { readonly lower: Condition_operand<a>; readonly upper: Condition_operand<a> };

export type Condition_condition =
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
  | { TAG: "ToContains"; readonly identifier: Identifier_t; readonly operand: Condition_operand<unknown> };

export type Condition_attributeTypeCode = 
    "S"
  | "SS"
  | "N"
  | "NS"
  | "B"
  | "BS"
  | "BOOL"
  | "NULL"
  | "L"
  | "M";

export type Projection_projection = Identifier_t[];

export type KeyCondition_pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_anyValue };

export type KeyCondition_limits = { readonly lower: AttributeValue_anyValue; readonly upper: AttributeValue_anyValue };

export type KeyCondition_keyComparator = "=" | "<" | "<=" | ">" | ">=";

export type KeyCondition_skCondition = 
    undefined
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: KeyCondition_keyComparator; readonly value: AttributeValue_anyValue }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: KeyCondition_limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_anyValue };

export type KeyCondition_keyCondition = { readonly pk: KeyCondition_pkCond; readonly sk?: KeyCondition_skCondition };

export type Update_operand<Cat> = ({
    TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown> }
  | { TAG: "IfNotExists"; readonly identifier: Update_operand<unknown>; readonly operand: Update_operand<unknown> }
  | { TAG: "Sum"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown> }
  | { TAG: "Sub"; readonly lhs: Update_operand<unknown>; readonly rhs: Update_operand<unknown> }
) & { readonly _cat?: Cat };

export type Update_anyOperand = Update_operand<unknown>;

export type Update_addOperand = Update_operand<num | strSet | numSet | binSet>;

export type Update_deleteOperand = Update_operand<strSet | numSet | binSet>;

export type Update_update = {
  readonly set?: Array<[Identifier_t, Update_anyOperand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, Update_addOperand]>; 
  readonly delete?: Array<[Identifier_t, Update_deleteOperand]>
};

export const Marshaller_marshall: <a>(value:a) => attributeValue = BrushlessJS.Marshaller.marshall as any;

export const Marshaller_unmarshall: <a>(value:atLeastOne<attributeValue_>) => a = BrushlessJS.Marshaller.unmarshall as any;

export const AttributeName_make: (name:string) => AttributeName_t = BrushlessJS.AttributeName.make as any;

export const AttributeName_toString: (param:AttributeName_t) => string = BrushlessJS.AttributeName.toString as any;

export const AttributeValue_make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t<never> = BrushlessJS.AttributeValue.make as any;

export const AttributeValue_toString: <T1>(param:AttributeValue_t<T1>) => string = BrushlessJS.AttributeValue.toString as any;

export const AttributeValue_string: (v:AttributeValue_from<string>) => AttributeValue_t<str> = BrushlessJS.AttributeValue.string as any;

export const AttributeValue_number: (v:AttributeValue_from<number>) => AttributeValue_t<num> = BrushlessJS.AttributeValue.number as any;

export const AttributeValue_boolean: (v:AttributeValue_from<boolean>) => AttributeValue_t<bool_> = BrushlessJS.AttributeValue.boolean as any;

export const AttributeValue_binary: (v:AttributeValue_from<Uint8Array>) => AttributeValue_t<bin> = BrushlessJS.AttributeValue.binary as any;

export const AttributeValue_stringSet: (v:AttributeValue_from<string[]>) => AttributeValue_t<strSet> = BrushlessJS.AttributeValue.stringSet as any;

export const AttributeValue_numberSet: (v:AttributeValue_from<number[]>) => AttributeValue_t<numSet> = BrushlessJS.AttributeValue.numberSet as any;

export const AttributeValue_binarySet: (v:AttributeValue_from<Uint8Array[]>) => AttributeValue_t<binSet> = BrushlessJS.AttributeValue.binarySet as any;

export const AttributeValue_list: (v:AttributeValue_from<attributeValue[]>) => AttributeValue_t<list_> = BrushlessJS.AttributeValue.list as any;

export const AttributeValue_map: (v:AttributeValue_from<{[id: string]: attributeValue}>) => AttributeValue_t<map_> = BrushlessJS.AttributeValue.map as any;

export const AttributePath_fromString: (str:string) => AttributePath_t = BrushlessJS.AttributePath.fromString as any;

export const AttributePath_toString: (param:AttributePath_t) => string = BrushlessJS.AttributePath.toString as any;

export const Register_make: () => Register_t = BrushlessJS.Register.make as any;

export const Register_isValueEqual: (a:attributeValue, b:attributeValue) => boolean = BrushlessJS.Register.isValueEqual as any;

export const Register_addValue: <T1>(register:Register_t, element:AttributeValue_t<T1>) => AttributeValue_t<T1> = BrushlessJS.Register.addValue as any;

export const Register_addName: (register:Register_t, element:AttributeName_t) => AttributeName_t = BrushlessJS.Register.addName as any;

export const Register_addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t = BrushlessJS.Register.addPath as any;

export const Identifier_toString: (identifier:Identifier_t, register:Register_t) => string = BrushlessJS.Identifier.toString as any;

export const Condition_equals: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.equals as any;

export const Condition_notEquals: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.notEquals as any;

export const Condition_lessThan: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.lessThan as any;

export const Condition_lessThanOrEqualTo: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.lessThanOrEqualTo as any;

export const Condition_greaterThan: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.greaterThan as any;

export const Condition_greaterThanOrEqualTo: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.greaterThanOrEqualTo as any;

export const Condition_between: <T1>(operand:Condition_operand<T1>, limits:Condition_limits<T1>) => Condition_condition = BrushlessJS.Condition.between as any;

export const Condition_inList: <T1>(operand:Condition_operand<T1>, list:Condition_operand<T1>[]) => Condition_condition = BrushlessJS.Condition.inList as any;

export const Condition_attributeExists: (identifier:Identifier_t) => Condition_condition = BrushlessJS.Condition.attributeExists as any;

export const Condition_attributeNotExists: (identifier:Identifier_t) => Condition_condition = BrushlessJS.Condition.attributeNotExists as any;

export const Condition_attributeType: (identifier:Identifier_t, type_:Condition_attributeTypeCode) => Condition_condition = BrushlessJS.Condition.attributeType as any;

export const Condition_beginsWith: (identifier:Identifier_t, operand:Condition_operand<str | bin>) => Condition_condition = BrushlessJS.Condition.beginsWith as any;

export const Condition_contains: <T1>(identifier:Identifier_t, operand:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.contains as any;

export const Condition_toContains: <T1>(identifier:Identifier_t, operand:Condition_operand<T1>) => Condition_condition = BrushlessJS.Condition.toContains as any;

export const Condition_and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.and as any;

export const Condition_or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.or as any;

export const Condition_not: (condition:Condition_condition) => Condition_condition = BrushlessJS.Condition.not as any;

export const Condition_size: (operand:Condition_operand<str | bin | strSet | numSet | binSet | list_ | map_>) => Condition_operand<num> = BrushlessJS.Condition.size as any;

export const Condition_build: (condition:Condition_condition, register:Register_t) => string = BrushlessJS.Condition.build as any;

export const Projection_build: (projection:Projection_projection, register:Register_t) => string = BrushlessJS.Projection.build as any;

export const KeyCondition_equals: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.equals as any;

export const KeyCondition_lessThan: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThan as any;

export const KeyCondition_lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThanOrEqualTo as any;

export const KeyCondition_greaterThan: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThan as any;

export const KeyCondition_greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThanOrEqualTo as any;

export const KeyCondition_between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition = BrushlessJS.KeyCondition.between as any;

export const KeyCondition_beginsWith: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition = BrushlessJS.KeyCondition.beginsWith as any;

export const KeyCondition_any: KeyCondition_skCondition = BrushlessJS.KeyCondition.any as any;

export const KeyCondition_build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string = BrushlessJS.KeyCondition.build as any;

export const Update_listAppend: (identifier:Update_operand<list_>, operand:Update_operand<list_>) => Update_operand<list_> = BrushlessJS.Update.listAppend as any;

export const Update_ifNotExists: <T1,T2>(identifier:Update_operand<T1>, operand:Update_operand<T2>) => Update_operand<T2> = BrushlessJS.Update.ifNotExists as any;

export const Update_sum: (lhs:Update_operand<num>, rhs:Update_operand<num>) => Update_operand<num> = BrushlessJS.Update.sum as any;

export const Update_sub: (lhs:Update_operand<num>, rhs:Update_operand<num>) => Update_operand<num> = BrushlessJS.Update.sub as any;

export const Update_build: (update:Update_update, register:Register_t) => string = BrushlessJS.Update.build as any;

export const AttributeName: { toString: (param:AttributeName_t) => string; make: (name:string) => AttributeName_t } = BrushlessJS.AttributeName as any;

export const Identifier: { toString: (identifier:Identifier_t, register:Register_t) => string } = BrushlessJS.Identifier as any;

export const Condition: {
  attributeType: (identifier:Identifier_t, type_:Condition_attributeTypeCode) => Condition_condition; 
  toContains: <T1>(identifier:Identifier_t, operand:Condition_operand<T1>) => Condition_condition; 
  notEquals: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  attributeNotExists: (identifier:Identifier_t) => Condition_condition; 
  greaterThan: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  greaterThanOrEqualTo: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  between: <T1>(operand:Condition_operand<T1>, limits:Condition_limits<T1>) => Condition_condition; 
  inList: <T1>(operand:Condition_operand<T1>, list:Condition_operand<T1>[]) => Condition_condition; 
  and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
  size: (operand:Condition_operand<str | bin | strSet | numSet | binSet | list_ | map_>) => Condition_operand<num>; 
  lessThanOrEqualTo: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  build: (condition:Condition_condition, register:Register_t) => string; 
  not: (condition:Condition_condition) => Condition_condition; 
  lessThan: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  equals: <T1>(lhs:Condition_operand<T1>, rhs:Condition_operand<T1>) => Condition_condition; 
  beginsWith: (identifier:Identifier_t, operand:Condition_operand<str | bin>) => Condition_condition; 
  or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
  attributeExists: (identifier:Identifier_t) => Condition_condition; 
  contains: <T1>(identifier:Identifier_t, operand:Condition_operand<T1>) => Condition_condition
} = BrushlessJS.Condition as any;

export const KeyCondition: {
  greaterThan: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition; 
  greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition; 
  between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition; 
  lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition; 
  build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string; 
  any: KeyCondition_skCondition; 
  lessThan: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition; 
  equals: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition; 
  beginsWith: (name:AttributeName_t, value:AttributeValue_anyValue) => KeyCondition_skCondition
} = BrushlessJS.KeyCondition as any;

export const Update: {
  sub: (lhs:Update_operand<num>, rhs:Update_operand<num>) => Update_operand<num>; 
  listAppend: (identifier:Update_operand<list_>, operand:Update_operand<list_>) => Update_operand<list_>; 
  ifNotExists: <T1,T2>(identifier:Update_operand<T1>, operand:Update_operand<T2>) => Update_operand<T2>; 
  sum: (lhs:Update_operand<num>, rhs:Update_operand<num>) => Update_operand<num>; 
  build: (update:Update_update, register:Register_t) => string
} = BrushlessJS.Update as any;

export const Register: {
  addValue: <T1>(register:Register_t, element:AttributeValue_t<T1>) => AttributeValue_t<T1>; 
  addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t; 
  addName: (register:Register_t, element:AttributeName_t) => AttributeName_t; 
  isValueEqual: (a:attributeValue, b:attributeValue) => boolean; 
  make: () => Register_t
} = BrushlessJS.Register as any;

export const Projection: { build: (projection:Projection_projection, register:Register_t) => string } = BrushlessJS.Projection as any;

export const Marshaller: { unmarshall: <a>(value:atLeastOne<attributeValue_>) => a; marshall: <a>(value:a) => attributeValue } = BrushlessJS.Marshaller as any;

export const AttributePath: { fromString: (str:string) => AttributePath_t; toString: (param:AttributePath_t) => string } = BrushlessJS.AttributePath as any;

export const AttributeValue: {
  boolean: (v:AttributeValue_from<boolean>) => AttributeValue_t<bool_>; 
  number: (v:AttributeValue_from<number>) => AttributeValue_t<num>; 
  map: (v:AttributeValue_from<{[id: string]: attributeValue}>) => AttributeValue_t<map_>; 
  stringSet: (v:AttributeValue_from<string[]>) => AttributeValue_t<strSet>; 
  numberSet: (v:AttributeValue_from<number[]>) => AttributeValue_t<numSet>; 
  string: (v:AttributeValue_from<string>) => AttributeValue_t<str>; 
  binary: (v:AttributeValue_from<Uint8Array>) => AttributeValue_t<bin>; 
  list: (v:AttributeValue_from<attributeValue[]>) => AttributeValue_t<list_>; 
  toString: <T1>(param:AttributeValue_t<T1>) => string; 
  binarySet: (v:AttributeValue_from<Uint8Array[]>) => AttributeValue_t<binSet>; 
  make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t<never>
} = BrushlessJS.AttributeValue as any;
