/* TypeScript file generated from Brushless.res by genType. */

/* eslint-disable */
/* tslint:disable */

const BrushlessJS = require('./Brushless.bs.js');

import type {AttributeValue as $$attributeValue} from './external';

export type attributeValue = $$attributeValue;

export type Attribute_Value_t = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string };

export type Attribute_Value_from<a> = { readonly value: a; readonly alias: string };

export type Attribute_Path_t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: Attribute_Path_sub[] };

export type Attribute_Path_sub = 
    { TAG: "Name"; readonly name: string }
  | { TAG: "Index"; readonly index: number };

export type Attribute_Path_parserState = 0 | 1 | 2 | 3 | 4;

export type Register_t = { names: (undefined | {[id: string]: string}); values: (undefined | {[id: string]: attributeValue}) };

export abstract class Register_uint8Array { protected opaque!: any }; /* simulate opaque types */

export abstract class Register_attributeValue_ { protected opaque!: any }; /* simulate opaque types */

export type comparator = "=" | "<>" | "<" | "<=" | ">" | ">=";

export type Condition_operand = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "AttributePath"; readonly name: string; readonly subpath: Attribute_Path_sub[] }
  | { TAG: "Size"; readonly operand: Condition_operand };

export type Condition_limits = { readonly lower: Condition_operand; readonly upper: Condition_operand };

export type Condition_condition = 
    { TAG: "Comparison"; readonly lhs: Condition_operand; readonly comparator: comparator; readonly rhs: Condition_operand }
  | { TAG: "Between"; readonly operand: Condition_operand; readonly limits: Condition_limits }
  | { TAG: "In"; readonly operand: Condition_operand; readonly list: Condition_operand[] }
  | { TAG: "And"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Or"; readonly lhs: Condition_condition; readonly rhs: Condition_condition }
  | { TAG: "Not"; readonly condition: Condition_condition }
  | { TAG: "AttributeExists"; readonly name: Attribute_Path_t }
  | { TAG: "AttributeNotExists"; readonly name: Attribute_Path_t }
  | { TAG: "AttributeType"; readonly name: Attribute_Path_t; readonly operand: Condition_operand }
  | { TAG: "BeginsWith"; readonly name: Attribute_Path_t; readonly operand: Condition_operand }
  | { TAG: "Contains"; readonly name: Attribute_Path_t; readonly operand: Condition_operand }
  | { TAG: "ToContains"; readonly name: Attribute_Path_t; readonly operand: Condition_operand };

export type Projection_projection = Attribute_Path_t[];

export type KeyCondition_pkCond = { readonly name: Attribute_Path_t; readonly value: Attribute_Value_t };

export type KeyCondition_limits = { readonly lower: Attribute_Value_t; readonly upper: Attribute_Value_t };

export type KeyCondition_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: Attribute_Path_t; readonly comparator: comparator; readonly value: Attribute_Value_t }
  | { TAG: "Between"; readonly name: Attribute_Path_t; readonly limits: KeyCondition_limits }
  | { TAG: "BeginsWith"; readonly name: Attribute_Path_t; readonly value: Attribute_Value_t };

export type KeyCondition_keyCondition = { readonly pk: KeyCondition_pkCond; readonly sk: KeyCondition_skCondition };

export type Update_operand = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "AttributePath"; readonly name: string; readonly subpath: Attribute_Path_sub[] }
  | { TAG: "ListAppend"; readonly name: Update_operand; readonly operand: Update_operand }
  | { TAG: "IfNotExists"; readonly name: Update_operand; readonly operand: Update_operand }
  | { TAG: "Sum"; readonly lhs: Update_operand; readonly rhs: Update_operand }
  | { TAG: "Sub"; readonly lhs: Update_operand; readonly rhs: Update_operand };

export type Update_update = {
  readonly set?: Array<[Attribute_Path_t, Update_operand]>; 
  readonly remove?: Attribute_Path_t[]; 
  readonly add?: Array<[Attribute_Path_t, Attribute_Value_t]>; 
  readonly delete?: Array<[Attribute_Path_t, Attribute_Value_t]>
};

export type U_operand = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "AttributePath"; readonly name: string; readonly subpath: Attribute_Path_sub[] }
  | { TAG: "ListAppend"; readonly name: U_operand; readonly operand: U_operand }
  | { TAG: "IfNotExists"; readonly name: U_operand; readonly operand: U_operand }
  | { TAG: "Sum"; readonly lhs: U_operand; readonly rhs: U_operand }
  | { TAG: "Sub"; readonly lhs: U_operand; readonly rhs: U_operand };

export type U_update = {
  readonly set?: Array<[Attribute_Path_t, U_operand]>; 
  readonly remove?: Attribute_Path_t[]; 
  readonly add?: Array<[Attribute_Path_t, Attribute_Value_t]>; 
  readonly delete?: Array<[Attribute_Path_t, Attribute_Value_t]>
};

export type C_operand = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "AttributePath"; readonly name: string; readonly subpath: Attribute_Path_sub[] }
  | { TAG: "Size"; readonly operand: C_operand };

export type C_limits = { readonly lower: C_operand; readonly upper: C_operand };

export type C_condition = 
    { TAG: "Comparison"; readonly lhs: C_operand; readonly comparator: comparator; readonly rhs: C_operand }
  | { TAG: "Between"; readonly operand: C_operand; readonly limits: C_limits }
  | { TAG: "In"; readonly operand: C_operand; readonly list: C_operand[] }
  | { TAG: "And"; readonly lhs: C_condition; readonly rhs: C_condition }
  | { TAG: "Or"; readonly lhs: C_condition; readonly rhs: C_condition }
  | { TAG: "Not"; readonly condition: C_condition }
  | { TAG: "AttributeExists"; readonly name: Attribute_Path_t }
  | { TAG: "AttributeNotExists"; readonly name: Attribute_Path_t }
  | { TAG: "AttributeType"; readonly name: Attribute_Path_t; readonly operand: C_operand }
  | { TAG: "BeginsWith"; readonly name: Attribute_Path_t; readonly operand: C_operand }
  | { TAG: "Contains"; readonly name: Attribute_Path_t; readonly operand: C_operand }
  | { TAG: "ToContains"; readonly name: Attribute_Path_t; readonly operand: C_operand };

export type K_pkCond = { readonly name: Attribute_Path_t; readonly value: Attribute_Value_t };

export type K_limits = { readonly lower: Attribute_Value_t; readonly upper: Attribute_Value_t };

export type K_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: Attribute_Path_t; readonly comparator: comparator; readonly value: Attribute_Value_t }
  | { TAG: "Between"; readonly name: Attribute_Path_t; readonly limits: K_limits }
  | { TAG: "BeginsWith"; readonly name: Attribute_Path_t; readonly value: Attribute_Value_t };

export type K_keyCondition = { readonly pk: K_pkCond; readonly sk: K_skCondition };

export type P_projection = Attribute_Path_t[];

export const Attribute_Value_make: (x:Attribute_Value_from<attributeValue>) => Attribute_Value_t = BrushlessJS.Attribute.Value.make as any;

export const Attribute_Value_toTagged: (param:Attribute_Value_t) => string = BrushlessJS.Attribute.Value.toTagged as any;

export const Attribute_Path_fromString: (str:string) => Attribute_Path_t = BrushlessJS.Attribute.Path.fromString as any;

export const Attribute_Path_nametoTagged: (name:string) => string = BrushlessJS.Attribute.Path.nametoTagged as any;

export const Attribute_Path_toString: (param:Attribute_Path_t) => string = BrushlessJS.Attribute.Path.toString as any;

export const Register_make: () => Register_t = BrushlessJS.Register.make as any;

export const Register_addValue: (register:Register_t, element:Attribute_Value_t) => string = BrushlessJS.Register.addValue as any;

export const Register_addPath: (register:Register_t, element:Attribute_Path_t) => string = BrushlessJS.Register.addPath as any;

export const Condition_Maker_equals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.equals as any;

export const Condition_Maker_notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.notEquals as any;

export const Condition_Maker_lessThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.lessThan as any;

export const Condition_Maker_lessThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.lessThanOrEqualTo as any;

export const Condition_Maker_greaterThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.greaterThan as any;

export const Condition_Maker_greaterThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.greaterThanOrEqualTo as any;

export const Condition_Maker_between: (operand:Condition_operand, limits:Condition_limits) => Condition_condition = BrushlessJS.Condition.Maker.between as any;

export const Condition_Maker_inList: (operand:Condition_operand, list:Condition_operand[]) => Condition_condition = BrushlessJS.Condition.Maker.inList as any;

export const Condition_Maker_attributeExists: (name:Attribute_Path_t) => Condition_condition = BrushlessJS.Condition.Maker.attributeExists as any;

export const Condition_Maker_attributeNotExists: (name:Attribute_Path_t) => Condition_condition = BrushlessJS.Condition.Maker.attributeNotExists as any;

export const Condition_Maker_attributeType: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.attributeType as any;

export const Condition_Maker_beginsWith: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.beginsWith as any;

export const Condition_Maker_contains: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.contains as any;

export const Condition_Maker_toContains: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition = BrushlessJS.Condition.Maker.toContains as any;

export const Condition_Maker_and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.Maker.and as any;

export const Condition_Maker_or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessJS.Condition.Maker.or as any;

export const Condition_Maker_not: (condition:Condition_condition) => Condition_condition = BrushlessJS.Condition.Maker.not as any;

export const Condition_Maker_size: (operand:Condition_operand) => Condition_operand = BrushlessJS.Condition.Maker.size as any;

export const Condition_equals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.equals as any;

export const Condition_notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.notEquals as any;

export const Condition_lessThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThan as any;

export const Condition_lessThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThanOrEqualTo as any;

export const Condition_greaterThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThan as any;

export const Condition_greaterThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThanOrEqualTo as any;

export const Condition_between: (_1:Condition_operand, _2:Condition_limits) => Condition_condition = BrushlessJS.Condition.between as any;

export const Condition_inList: (_1:Condition_operand, _2:Condition_operand[]) => Condition_condition = BrushlessJS.Condition.inList as any;

export const Condition_attributeExists: (_1:Attribute_Path_t) => Condition_condition = BrushlessJS.Condition.attributeExists as any;

export const Condition_attributeNotExists: (_1:Attribute_Path_t) => Condition_condition = BrushlessJS.Condition.attributeNotExists as any;

export const Condition_attributeType: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.attributeType as any;

export const Condition_beginsWith: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.beginsWith as any;

export const Condition_contains: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.contains as any;

export const Condition_toContains: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.toContains as any;

export const Condition_and: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessJS.Condition.and as any;

export const Condition_or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessJS.Condition.or as any;

export const Condition_not: (_1:Condition_condition) => Condition_condition = BrushlessJS.Condition.not as any;

export const Condition_size: (_1:Condition_operand) => Condition_operand = BrushlessJS.Condition.size as any;

export const Condition_build: (condition:Condition_condition, register:Register_t) => string = BrushlessJS.Condition.build as any;

export const Projection_build: (projection:Projection_projection, register:Register_t) => string = BrushlessJS.Projection.build as any;

export const KeyCondition_Maker_equals: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.equals as any;

export const KeyCondition_Maker_notEquals: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.notEquals as any;

export const KeyCondition_Maker_lessThan: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.lessThan as any;

export const KeyCondition_Maker_lessThanOrEqualTo: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.lessThanOrEqualTo as any;

export const KeyCondition_Maker_greaterThan: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.greaterThan as any;

export const KeyCondition_Maker_greaterThanOrEqualTo: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.greaterThanOrEqualTo as any;

export const KeyCondition_Maker_between: (name:Attribute_Path_t, limits:KeyCondition_limits) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.between as any;

export const KeyCondition_Maker_beginsWith: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.beginsWith as any;

export const KeyCondition_Maker_any: KeyCondition_skCondition = BrushlessJS.KeyCondition.Maker.any as any;

export const KeyCondition_equals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.equals as any;

export const KeyCondition_notEquals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.notEquals as any;

export const KeyCondition_lessThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThan as any;

export const KeyCondition_lessThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThanOrEqualTo as any;

export const KeyCondition_greaterThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThan as any;

export const KeyCondition_greaterThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThanOrEqualTo as any;

export const KeyCondition_between: (_1:Attribute_Path_t, _2:KeyCondition_limits) => KeyCondition_skCondition = BrushlessJS.KeyCondition.between as any;

export const KeyCondition_beginsWith: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition = BrushlessJS.KeyCondition.beginsWith as any;

export const KeyCondition_any: KeyCondition_skCondition = BrushlessJS.KeyCondition.any as any;

export const KeyCondition_build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string = BrushlessJS.KeyCondition.build as any;

export const Update_Maker_listAppend: (name:Update_operand, operand:Update_operand) => Update_operand = BrushlessJS.Update.Maker.listAppend as any;

export const Update_Maker_ifNotExists: (name:Update_operand, operand:Update_operand) => Update_operand = BrushlessJS.Update.Maker.ifNotExists as any;

export const Update_Maker_sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessJS.Update.Maker.sum as any;

export const Update_Maker_sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessJS.Update.Maker.sub as any;

export const Update_listAppend: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.listAppend as any;

export const Update_ifNotExists: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.ifNotExists as any;

export const Update_sum: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.sum as any;

export const Update_sub: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.sub as any;

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

export const C_attributeExists: (_1:Attribute_Path_t) => C_condition = BrushlessJS.C.attributeExists as any;

export const C_attributeNotExists: (_1:Attribute_Path_t) => C_condition = BrushlessJS.C.attributeNotExists as any;

export const C_attributeType: (_1:Attribute_Path_t, _2:C_operand) => C_condition = BrushlessJS.C.attributeType as any;

export const C_beginsWith: (_1:Attribute_Path_t, _2:C_operand) => C_condition = BrushlessJS.C.beginsWith as any;

export const C_contains: (_1:Attribute_Path_t, _2:C_operand) => C_condition = BrushlessJS.C.contains as any;

export const C_toContains: (_1:Attribute_Path_t, _2:C_operand) => C_condition = BrushlessJS.C.toContains as any;

export const C_and: (_1:C_condition, _2:C_condition) => C_condition = BrushlessJS.C.and as any;

export const C_or: (_1:C_condition, _2:C_condition) => C_condition = BrushlessJS.C.or as any;

export const C_not: (_1:C_condition) => C_condition = BrushlessJS.C.not as any;

export const C_size: (_1:C_operand) => C_operand = BrushlessJS.C.size as any;

export const C_build: (_1:C_condition, _2:Register_t) => string = BrushlessJS.C.build as any;

export const K_equals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.equals as any;

export const K_notEquals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.notEquals as any;

export const K_lessThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.lessThan as any;

export const K_lessThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.lessThanOrEqualTo as any;

export const K_greaterThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.greaterThan as any;

export const K_greaterThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.greaterThanOrEqualTo as any;

export const K_between: (_1:Attribute_Path_t, _2:K_limits) => K_skCondition = BrushlessJS.K.between as any;

export const K_beginsWith: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition = BrushlessJS.K.beginsWith as any;

export const K_any: K_skCondition = BrushlessJS.K.any as any;

export const K_build: (_1:K_keyCondition, _2:Register_t) => string = BrushlessJS.K.build as any;

export const P_build: (_1:P_projection, _2:Register_t) => string = BrushlessJS.P.build as any;

export const K: {
  notEquals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  greaterThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  greaterThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  between: (_1:Attribute_Path_t, _2:K_limits) => K_skCondition; 
  lessThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  build: (_1:K_keyCondition, _2:Register_t) => string; 
  any: K_skCondition; 
  lessThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  equals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition; 
  beginsWith: (_1:Attribute_Path_t, _2:Attribute_Value_t) => K_skCondition
} = BrushlessJS.K as any;

export const Condition: {
  attributeType: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition; 
  toContains: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition; 
  notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  attributeNotExists: (_1:Attribute_Path_t) => Condition_condition; 
  greaterThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  greaterThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  between: (_1:Condition_operand, _2:Condition_limits) => Condition_condition; 
  inList: (_1:Condition_operand, _2:Condition_operand[]) => Condition_condition; 
  and: (_1:Condition_condition, _2:Condition_condition) => Condition_condition; 
  size: (_1:Condition_operand) => Condition_operand; 
  lessThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  build: (condition:Condition_condition, register:Register_t) => string; 
  not: (_1:Condition_condition) => Condition_condition; 
  lessThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  equals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  Maker: {
    attributeType: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition; 
    toContains: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition; 
    notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    attributeNotExists: (name:Attribute_Path_t) => Condition_condition; 
    greaterThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    greaterThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    between: (operand:Condition_operand, limits:Condition_limits) => Condition_condition; 
    inList: (operand:Condition_operand, list:Condition_operand[]) => Condition_condition; 
    and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
    size: (operand:Condition_operand) => Condition_operand; 
    lessThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    not: (condition:Condition_condition) => Condition_condition; 
    lessThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    equals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    beginsWith: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition; 
    or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
    attributeExists: (name:Attribute_Path_t) => Condition_condition; 
    contains: (name:Attribute_Path_t, operand:Condition_operand) => Condition_condition
  }; 
  beginsWith: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition; 
  or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition; 
  attributeExists: (_1:Attribute_Path_t) => Condition_condition; 
  contains: (_1:Attribute_Path_t, _2:Condition_operand) => Condition_condition
} = BrushlessJS.Condition as any;

export const KeyCondition: {
  notEquals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  greaterThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  greaterThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  between: (_1:Attribute_Path_t, _2:KeyCondition_limits) => KeyCondition_skCondition; 
  lessThanOrEqualTo: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string; 
  any: KeyCondition_skCondition; 
  lessThan: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  equals: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition; 
  Maker: {
    notEquals: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    greaterThan: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    greaterThanOrEqualTo: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    between: (name:Attribute_Path_t, limits:KeyCondition_limits) => KeyCondition_skCondition; 
    lessThanOrEqualTo: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    any: KeyCondition_skCondition; 
    lessThan: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    equals: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition; 
    beginsWith: (name:Attribute_Path_t, value:Attribute_Value_t) => KeyCondition_skCondition
  }; 
  beginsWith: (_1:Attribute_Path_t, _2:Attribute_Value_t) => KeyCondition_skCondition
} = BrushlessJS.KeyCondition as any;

export const Update: {
  sub: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  listAppend: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  ifNotExists: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  sum: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  build: (update:Update_update, register:Register_t) => string; 
  Maker: {
    sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand; 
    listAppend: (name:Update_operand, operand:Update_operand) => Update_operand; 
    ifNotExists: (name:Update_operand, operand:Update_operand) => Update_operand; 
    sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand
  }
} = BrushlessJS.Update as any;

export const Register: {
  addValue: (register:Register_t, element:Attribute_Value_t) => string; 
  addPath: (register:Register_t, element:Attribute_Path_t) => string; 
  make: () => Register_t
} = BrushlessJS.Register as any;

export const Projection: { build: (projection:Projection_projection, register:Register_t) => string } = BrushlessJS.Projection as any;

export const Attribute: { Value: { toTagged: (param:Attribute_Value_t) => string; make: (x:Attribute_Value_from<attributeValue>) => Attribute_Value_t }; Path: {
  fromString: (str:string) => Attribute_Path_t; 
  nametoTagged: (name:string) => string; 
  toString: (param:Attribute_Path_t) => string
} } = BrushlessJS.Attribute as any;

export const U: {
  sub: (_1:U_operand, _2:U_operand) => U_operand; 
  listAppend: (_1:U_operand, _2:U_operand) => U_operand; 
  ifNotExists: (_1:U_operand, _2:U_operand) => U_operand; 
  sum: (_1:U_operand, _2:U_operand) => U_operand; 
  build: (_1:U_update, _2:Register_t) => string
} = BrushlessJS.U as any;

export const C: {
  attributeType: (_1:Attribute_Path_t, _2:C_operand) => C_condition; 
  toContains: (_1:Attribute_Path_t, _2:C_operand) => C_condition; 
  notEquals: (_1:C_operand, _2:C_operand) => C_condition; 
  attributeNotExists: (_1:Attribute_Path_t) => C_condition; 
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
  beginsWith: (_1:Attribute_Path_t, _2:C_operand) => C_condition; 
  or: (_1:C_condition, _2:C_condition) => C_condition; 
  attributeExists: (_1:Attribute_Path_t) => C_condition; 
  contains: (_1:Attribute_Path_t, _2:C_operand) => C_condition
} = BrushlessJS.C as any;

export const P: { build: (_1:P_projection, _2:Register_t) => string } = BrushlessJS.P as any;
