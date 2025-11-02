/* TypeScript file generated from Brushless.res by genType. */

/* eslint-disable */
/* tslint:disable */

const BrushlessJS = require('./Brushless.bs.js');

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

export type AttributeValue_t = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string };

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

export type Condition_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: Condition_operand };

export type Condition_limits = { readonly lower: Condition_operand; readonly upper: Condition_operand };

export type Condition_condition = 
    { TAG: "Comparison"; readonly lhs: Condition_operand; readonly comparator: comparator; readonly rhs: Condition_operand }
  | { TAG: "Between"; readonly operand: Condition_operand; readonly limits: Condition_limits }
  | { TAG: "In"; readonly operand: Condition_operand; readonly list: Condition_operand[] }
  | { TAG: "And"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Or"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Not"; readonly condition: Condition_condition }
  | { TAG: "AttributeExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeNotExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeType"; readonly identifier: Identifier_t; readonly operand: Condition_operand }
  | { TAG: "BeginsWith"; readonly identifier: Identifier_t; readonly operand: Condition_operand }
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: Condition_operand }
  | { TAG: "ToContains"; readonly identifier: Identifier_t; readonly operand: Condition_operand };

export type Projection_projection = Identifier_t[];

export type KeyCondition_pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type KeyCondition_limits = { readonly lower: AttributeValue_t; readonly upper: AttributeValue_t };

export type KeyCondition_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: comparator; readonly value: AttributeValue_t }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: KeyCondition_limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type KeyCondition_keyCondition = { readonly pk: KeyCondition_pkCond; readonly sk: KeyCondition_skCondition };

export type Update_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: Update_operand; readonly operand: Update_operand }
  | { TAG: "IfNotExists"; readonly identifier: Update_operand; readonly operand: Update_operand }
  | { TAG: "Sum"; readonly lhs: Update_operand; readonly rhs: Update_operand }
  | { TAG: "Sub"; readonly lhs: Update_operand; readonly rhs: Update_operand };

export type Update_update = {
  readonly set?: Array<[Identifier_t, Update_operand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, AttributeValue_t]>; 
  readonly delete?: Array<[Identifier_t, AttributeValue_t]>
};

export type U_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: U_operand; readonly operand: U_operand }
  | { TAG: "IfNotExists"; readonly identifier: U_operand; readonly operand: U_operand }
  | { TAG: "Sum"; readonly lhs: U_operand; readonly rhs: U_operand }
  | { TAG: "Sub"; readonly lhs: U_operand; readonly rhs: U_operand };

export type U_update = {
  readonly set?: Array<[Identifier_t, U_operand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, AttributeValue_t]>; 
  readonly delete?: Array<[Identifier_t, AttributeValue_t]>
};

export type C_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: C_operand };

export type C_limits = { readonly lower: C_operand; readonly upper: C_operand };

export type C_condition = 
    { TAG: "Comparison"; readonly lhs: C_operand; readonly comparator: comparator; readonly rhs: C_operand }
  | { TAG: "Between"; readonly operand: C_operand; readonly limits: C_limits }
  | { TAG: "In"; readonly operand: C_operand; readonly list: C_operand[] }
  | { TAG: "And"; readonly lhs: C_condition; readonly rhs: C_condition }
  | { TAG: "Or"; readonly lhs: C_condition; readonly rhs: C_condition }
  | { TAG: "Not"; readonly condition: C_condition }
  | { TAG: "AttributeExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeNotExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeType"; readonly identifier: Identifier_t; readonly operand: C_operand }
  | { TAG: "BeginsWith"; readonly identifier: Identifier_t; readonly operand: C_operand }
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: C_operand }
  | { TAG: "ToContains"; readonly identifier: Identifier_t; readonly operand: C_operand };

export type K_pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type K_limits = { readonly lower: AttributeValue_t; readonly upper: AttributeValue_t };

export type K_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: comparator; readonly value: AttributeValue_t }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: K_limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type K_keyCondition = { readonly pk: K_pkCond; readonly sk: K_skCondition };

export type P_projection = Identifier_t[];

export const AttributeName_make: (name:string) => AttributeName_t = BrushlessJS.AttributeName.make as any;

export const AttributeName_toString: (param:AttributeName_t) => string = BrushlessJS.AttributeName.toString as any;

export const AttributeValue_make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t = BrushlessJS.AttributeValue.make as any;

export const AttributeValue_toString: (param:AttributeValue_t) => string = BrushlessJS.AttributeValue.toString as any;

export const AttributePath_fromString: (str:string) => AttributePath_t = BrushlessJS.AttributePath.fromString as any;

export const AttributePath_toString: (param:AttributePath_t) => string = BrushlessJS.AttributePath.toString as any;

export const Register_make: () => Register_t = BrushlessJS.Register.make as any;

export const Register_isValueEqual: (a:attributeValue, b:attributeValue) => boolean = BrushlessJS.Register.isValueEqual as any;

export const Register_addValue: (register:Register_t, element:AttributeValue_t) => AttributeValue_t = BrushlessJS.Register.addValue as any;

export const Register_addName: (register:Register_t, element:AttributeName_t) => AttributeName_t = BrushlessJS.Register.addName as any;

export const Register_addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t = BrushlessJS.Register.addPath as any;

export const Identifier_toString: (identifier:Identifier_t, register:Register_t) => string = BrushlessJS.Identifier.toString as any;

export const Condition_equals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.equals as any;

export const Condition_notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.notEquals as any;

export const Condition_lessThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThan as any;

export const Condition_lessThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThanOrEqualTo as any;

export const Condition_greaterThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThan as any;

export const Condition_greaterThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThanOrEqualTo as any;

export const Condition_between: (operand:Condition_operand, limits:Condition_limits) => Condition_condition = BrushlessJS.Condition.between as any;

export const Condition_inList: (operand:Condition_operand, list:Condition_operand[]) => Condition_condition = BrushlessJS.Condition.inList as any;

export const Condition_attributeExists: (identifier:Identifier_t) => Condition_condition = BrushlessJS.Condition.attributeExists as any;

export const Condition_attributeNotExists: (identifier:Identifier_t) => Condition_condition = BrushlessJS.Condition.attributeNotExists as any;

export const Condition_attributeType: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.attributeType as any;

export const Condition_beginsWith: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.beginsWith as any;

export const Condition_contains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.contains as any;

export const Condition_toContains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.toContains as any;

export const Condition_and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.and as any;

export const Condition_or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.or as any;

export const Condition_not: (condition:Condition_condition) => Condition_condition = BrushlessJS.Condition.not as any;

export const Condition_size: (operand:Condition_operand) => Condition_operand = BrushlessJS.Condition.size as any;

export const Condition_build: (condition:Condition_condition, register:Register_t) => string = BrushlessJS.Condition.build as any;

export const Projection_build: (projection:Projection_projection, register:Register_t) => string = BrushlessJS.Projection.build as any;

export const KeyCondition_equals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.equals as any;

export const KeyCondition_notEquals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.notEquals as any;

export const KeyCondition_lessThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThan as any;

export const KeyCondition_lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThanOrEqualTo as any;

export const KeyCondition_greaterThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThan as any;

export const KeyCondition_greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThanOrEqualTo as any;

export const KeyCondition_between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition = BrushlessJS.KeyCondition.between as any;

export const KeyCondition_beginsWith: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.beginsWith as any;

export const KeyCondition_any: KeyCondition_skCondition = BrushlessJS.KeyCondition.any as any;

export const KeyCondition_build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string = BrushlessJS.KeyCondition.build as any;

export const Update_listAppend: (identifier:Update_operand, operand:Update_operand) => Update_operand = BrushlessJS.Update.listAppend as any;

export const Update_ifNotExists: (identifier:Update_operand, operand:Update_operand) => Update_operand = BrushlessJS.Update.ifNotExists as any;

export const Update_sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessJS.Update.sum as any;

export const Update_sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessJS.Update.sub as any;

export const Update_build: (update:Update_update, register:Register_t) => string = BrushlessJS.Update.build as any;

export const U_listAppend: (_1:U_operand, _2:U_operand) => U_operand = BrushlessJS.U.listAppend as any;

export const U_ifNotExists: (_1:U_operand, _2:U_operand) => U_operand = BrushlessJS.U.ifNotExists as any;

export const U_sum: (_1:U_operand, _2:U_operand) => U_operand = BrushlessJS.U.sum as any;

export const U_sub: (_1:U_operand, _2:U_operand) => U_operand = BrushlessJS.U.sub as any;

export const U_build: (_1:U_update, _2:Register_t) => string = BrushlessJS.U.build as any;

export const C_equals: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.equals as any;

export const C_notEquals: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.notEquals as any;

export const C_lessThan: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.lessThan as any;

export const C_lessThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.lessThanOrEqualTo as any;

export const C_greaterThan: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.greaterThan as any;

export const C_greaterThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition = BrushlessJS.C.greaterThanOrEqualTo as any;

export const C_between: (_1:C_operand, _2:C_limits) => C_condition = BrushlessJS.C.between as any;

export const C_inList: (_1:C_operand, _2:C_operand[]) => C_condition = BrushlessJS.C.inList as any;

export const C_attributeExists: (_1:Identifier_t) => C_condition = BrushlessJS.C.attributeExists as any;

export const C_attributeNotExists: (_1:Identifier_t) => C_condition = BrushlessJS.C.attributeNotExists as any;

export const C_attributeType: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessJS.C.attributeType as any;

export const C_beginsWith: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessJS.C.beginsWith as any;

export const C_contains: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessJS.C.contains as any;

export const C_toContains: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessJS.C.toContains as any;

export const C_and: (_1:C_condition, _2:C_condition) => C_condition = BrushlessJS.C.and as any;

export const C_or: (_1:C_condition, _2:C_condition) => C_condition = BrushlessJS.C.or as any;

export const C_not: (_1:C_condition) => C_condition = BrushlessJS.C.not as any;

export const C_size: (_1:C_operand) => C_operand = BrushlessJS.C.size as any;

export const C_build: (_1:C_condition, _2:Register_t) => string = BrushlessJS.C.build as any;

export const K_equals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.equals as any;

export const K_notEquals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.notEquals as any;

export const K_lessThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.lessThan as any;

export const K_lessThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.lessThanOrEqualTo as any;

export const K_greaterThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.greaterThan as any;

export const K_greaterThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.greaterThanOrEqualTo as any;

export const K_between: (_1:AttributeName_t, _2:K_limits) => K_skCondition = BrushlessJS.K.between as any;

export const K_beginsWith: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessJS.K.beginsWith as any;

export const K_any: K_skCondition = BrushlessJS.K.any as any;

export const K_build: (_1:K_keyCondition, _2:Register_t) => string = BrushlessJS.K.build as any;

export const P_build: (_1:P_projection, _2:Register_t) => string = BrushlessJS.P.build as any;

export const AttributeName: { toString: (param:AttributeName_t) => string; make: (name:string) => AttributeName_t } = BrushlessJS.AttributeName as any;

export const K: {
  notEquals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  greaterThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  greaterThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  between: (_1:AttributeName_t, _2:K_limits) => K_skCondition; 
  lessThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  build: (_1:K_keyCondition, _2:Register_t) => string; 
  any: K_skCondition; 
  lessThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  equals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition; 
  beginsWith: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition
} = BrushlessJS.K as any;

export const Identifier: { toString: (identifier:Identifier_t, register:Register_t) => string } = BrushlessJS.Identifier as any;

export const Condition: {
  attributeType: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition; 
  toContains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition; 
  notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  attributeNotExists: (identifier:Identifier_t) => Condition_condition; 
  greaterThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  greaterThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  between: (operand:Condition_operand, limits:Condition_limits) => Condition_condition; 
  inList: (operand:Condition_operand, list:Condition_operand[]) => Condition_condition; 
  and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
  size: (operand:Condition_operand) => Condition_operand; 
  lessThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  build: (condition:Condition_condition, register:Register_t) => string; 
  not: (condition:Condition_condition) => Condition_condition; 
  lessThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  equals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
  beginsWith: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition; 
  or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
  attributeExists: (identifier:Identifier_t) => Condition_condition; 
  contains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition
} = BrushlessJS.Condition as any;

export const KeyCondition: {
  notEquals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  greaterThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition; 
  lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string; 
  any: KeyCondition_skCondition; 
  lessThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  equals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
  beginsWith: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition
} = BrushlessJS.KeyCondition as any;

export const Update: {
  sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand; 
  listAppend: (identifier:Update_operand, operand:Update_operand) => Update_operand; 
  ifNotExists: (identifier:Update_operand, operand:Update_operand) => Update_operand; 
  sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand; 
  build: (update:Update_update, register:Register_t) => string
} = BrushlessJS.Update as any;

export const Register: {
  addValue: (register:Register_t, element:AttributeValue_t) => AttributeValue_t; 
  addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t; 
  addName: (register:Register_t, element:AttributeName_t) => AttributeName_t; 
  isValueEqual: (a:attributeValue, b:attributeValue) => boolean; 
  make: () => Register_t
} = BrushlessJS.Register as any;

export const Projection: { build: (projection:Projection_projection, register:Register_t) => string } = BrushlessJS.Projection as any;

export const AttributePath: { fromString: (str:string) => AttributePath_t; toString: (param:AttributePath_t) => string } = BrushlessJS.AttributePath as any;

export const U: {
  sub: (_1:U_operand, _2:U_operand) => U_operand; 
  listAppend: (_1:U_operand, _2:U_operand) => U_operand; 
  ifNotExists: (_1:U_operand, _2:U_operand) => U_operand; 
  sum: (_1:U_operand, _2:U_operand) => U_operand; 
  build: (_1:U_update, _2:Register_t) => string
} = BrushlessJS.U as any;

export const C: {
  attributeType: (_1:Identifier_t, _2:C_operand) => C_condition; 
  toContains: (_1:Identifier_t, _2:C_operand) => C_condition; 
  notEquals: (_1:C_operand, _2:C_operand) => C_condition; 
  attributeNotExists: (_1:Identifier_t) => C_condition; 
  greaterThan: (_1:C_operand, _2:C_operand) => C_condition; 
  greaterThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition; 
  between: (_1:C_operand, _2:C_limits) => C_condition; 
  inList: (_1:C_operand, _2:C_operand[]) => C_condition; 
  and: (_1:C_condition, _2:C_condition) => C_condition; 
  size: (_1:C_operand) => C_operand; 
  lessThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition; 
  build: (_1:C_condition, _2:Register_t) => string; 
  not: (_1:C_condition) => C_condition; 
  lessThan: (_1:C_operand, _2:C_operand) => C_condition; 
  equals: (_1:C_operand, _2:C_operand) => C_condition; 
  beginsWith: (_1:Identifier_t, _2:C_operand) => C_condition; 
  or: (_1:C_condition, _2:C_condition) => C_condition; 
  attributeExists: (_1:Identifier_t) => C_condition; 
  contains: (_1:Identifier_t, _2:C_operand) => C_condition
} = BrushlessJS.C as any;

export const AttributeValue: { toString: (param:AttributeValue_t) => string; make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t } = BrushlessJS.AttributeValue as any;

export const P: { build: (_1:P_projection, _2:Register_t) => string } = BrushlessJS.P as any;
