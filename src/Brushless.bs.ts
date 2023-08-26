/* TypeScript file generated from Brushless.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const BrushlessBS = require('./Brushless.bs');

import type {AttributeValue as $$attributeValue} from './external';

import type {t as Dict_t} from './Dict.bs';

// tslint:disable-next-line:interface-over-type-literal
export type attributeValue = $$attributeValue;

// tslint:disable-next-line:interface-over-type-literal
export type AttributeName_t = 
    { TAG: "AttributeName"; readonly name: string };

// tslint:disable-next-line:interface-over-type-literal
export type AttributeValue_t = 
    { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string };

// tslint:disable-next-line:interface-over-type-literal
export type AttributeValue_from<a> = { readonly value: a; readonly alias: string };

// tslint:disable-next-line:interface-over-type-literal
export type AttributePath_sub = 
    { TAG: "AttributeName"; readonly name: string }
  | { TAG: "ListIndex"; readonly index: number };

// tslint:disable-next-line:interface-over-type-literal
export type AttributePath_t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] };

// tslint:disable-next-line:interface-over-type-literal
export type AttributePath_parseState = "Name" | "Index";

// tslint:disable-next-line:interface-over-type-literal
export type Register_t = { readonly names: Dict_t<string>; readonly values: Dict_t<attributeValue> };

// tslint:disable-next-line:interface-over-type-literal
export type comparator = 
    "Equals"
  | "NotEquals"
  | "LessThan"
  | "LessThanOrEqual"
  | "GreaterThan"
  | "GreaterThanOrEqual";

// tslint:disable-next-line:interface-over-type-literal
export type Identifier_t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string };

// tslint:disable-next-line:interface-over-type-literal
export type Condition_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: Condition_operand };

// tslint:disable-next-line:interface-over-type-literal
export type Condition_limits = { readonly lower: Condition_operand; readonly upper: Condition_operand };

// tslint:disable-next-line:interface-over-type-literal
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
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: Condition_operand };

// tslint:disable-next-line:interface-over-type-literal
export type Projection_projection = Identifier_t[];

// tslint:disable-next-line:interface-over-type-literal
export type KeyCondition_pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type KeyCondition_limits = { readonly lower: AttributeValue_t; readonly upper: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type KeyCondition_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: comparator; readonly value: AttributeValue_t }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: KeyCondition_limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type KeyCondition_keyCondition = { readonly pk: KeyCondition_pkCond; readonly sk: KeyCondition_skCondition };

// tslint:disable-next-line:interface-over-type-literal
export type Update_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: Update_operand; readonly operand: Update_operand }
  | { TAG: "IfNotExists"; readonly identifier: Update_operand; readonly operand: Update_operand }
  | { TAG: "Sum"; readonly lhs: Update_operand; readonly rhs: Update_operand }
  | { TAG: "Sub"; readonly lhs: Update_operand; readonly rhs: Update_operand };

// tslint:disable-next-line:interface-over-type-literal
export type Update_update = {
  readonly set?: Array<[Identifier_t, Update_operand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, AttributeValue_t]>; 
  readonly delete?: Array<[Identifier_t, AttributeValue_t]>
};

// tslint:disable-next-line:interface-over-type-literal
export type U_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: U_operand; readonly operand: U_operand }
  | { TAG: "IfNotExists"; readonly identifier: U_operand; readonly operand: U_operand }
  | { TAG: "Sum"; readonly lhs: U_operand; readonly rhs: U_operand }
  | { TAG: "Sub"; readonly lhs: U_operand; readonly rhs: U_operand };

// tslint:disable-next-line:interface-over-type-literal
export type U_update = {
  readonly set?: Array<[Identifier_t, U_operand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, AttributeValue_t]>; 
  readonly delete?: Array<[Identifier_t, AttributeValue_t]>
};

// tslint:disable-next-line:interface-over-type-literal
export type C_operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: C_operand };

// tslint:disable-next-line:interface-over-type-literal
export type C_limits = { readonly lower: C_operand; readonly upper: C_operand };

// tslint:disable-next-line:interface-over-type-literal
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
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: C_operand };

// tslint:disable-next-line:interface-over-type-literal
export type K_pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type K_limits = { readonly lower: AttributeValue_t; readonly upper: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type K_skCondition = 
    "Any"
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: comparator; readonly value: AttributeValue_t }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: K_limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_t };

// tslint:disable-next-line:interface-over-type-literal
export type K_keyCondition = { readonly pk: K_pkCond; readonly sk: K_skCondition };

// tslint:disable-next-line:interface-over-type-literal
export type P_projection = Identifier_t[];

export const AttributeName_make: (name:string) => AttributeName_t = BrushlessBS.AttributeName.make;

export const AttributeName_toString: (name:AttributeName_t) => string = BrushlessBS.AttributeName.toString;

export const AttributeValue_make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t = BrushlessBS.AttributeValue.make;

export const AttributeValue_toString: (value:AttributeValue_t) => string = BrushlessBS.AttributeValue.toString;

export const AttributePath_fromString: (str:string) => AttributePath_t = BrushlessBS.AttributePath.fromString;

export const AttributePath_toString: (path:AttributePath_t) => string = BrushlessBS.AttributePath.toString;

export const Register_make: () => Register_t = BrushlessBS.Register.make;

export const Register_addValue: (register:Register_t, element:AttributeValue_t) => AttributeValue_t = BrushlessBS.Register.addValue;

export const Register_addName: (register:Register_t, element:AttributeName_t) => AttributeName_t = BrushlessBS.Register.addName;

export const Register_addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t = BrushlessBS.Register.addPath;

export const Identifier_toString: (identifier:Identifier_t, register:Register_t) => string = BrushlessBS.Identifier.toString;

export const Condition_Maker_equals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.equals;

export const Condition_Maker_notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.notEquals;

export const Condition_Maker_lessThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.lessThan;

export const Condition_Maker_lessThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.lessThanOrEqualTo;

export const Condition_Maker_greaterThan: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.greaterThan;

export const Condition_Maker_greaterThanOrEqualTo: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.greaterThanOrEqualTo;

export const Condition_Maker_between: (operand:Condition_operand, limits:Condition_limits) => Condition_condition = BrushlessBS.Condition.Maker.between;

export const Condition_Maker_inList: (operand:Condition_operand, list:Condition_operand[]) => Condition_condition = BrushlessBS.Condition.Maker.inList;

export const Condition_Maker_attributeExists: (identifier:Identifier_t) => Condition_condition = BrushlessBS.Condition.Maker.attributeExists;

export const Condition_Maker_attributeNotExists: (identifier:Identifier_t) => Condition_condition = BrushlessBS.Condition.Maker.attributeNotExists;

export const Condition_Maker_attributeType: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.attributeType;

export const Condition_Maker_beginsWith: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.beginsWith;

export const Condition_Maker_contains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition = BrushlessBS.Condition.Maker.contains;

export const Condition_Maker_and: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessBS.Condition.Maker.and;

export const Condition_Maker_or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition = BrushlessBS.Condition.Maker.or;

export const Condition_Maker_not: (condition:Condition_condition) => Condition_condition = BrushlessBS.Condition.Maker.not;

export const Condition_Maker_size: (operand:Condition_operand) => Condition_operand = BrushlessBS.Condition.Maker.size;

export const Condition_equals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.equals;

export const Condition_notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.notEquals;

export const Condition_lessThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.lessThan;

export const Condition_lessThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.lessThanOrEqualTo;

export const Condition_greaterThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.greaterThan;

export const Condition_greaterThanOrEqualTo: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.greaterThanOrEqualTo;

export const Condition_between: (_1:Condition_operand, _2:Condition_limits) => Condition_condition = BrushlessBS.Condition.between;

export const Condition_inList: (_1:Condition_operand, _2:Condition_operand[]) => Condition_condition = BrushlessBS.Condition.inList;

export const Condition_attributeExists: (_1:Identifier_t) => Condition_condition = BrushlessBS.Condition.attributeExists;

export const Condition_attributeNotExists: (_1:Identifier_t) => Condition_condition = BrushlessBS.Condition.attributeNotExists;

export const Condition_attributeType: (_1:Identifier_t, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.attributeType;

export const Condition_beginsWith: (_1:Identifier_t, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.beginsWith;

export const Condition_contains: (_1:Identifier_t, _2:Condition_operand) => Condition_condition = BrushlessBS.Condition.contains;

export const Condition_and: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessBS.Condition.and;

export const Condition_or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessBS.Condition.or;

export const Condition_not: (_1:Condition_condition) => Condition_condition = BrushlessBS.Condition.not;

export const Condition_size: (_1:Condition_operand) => Condition_operand = BrushlessBS.Condition.size;

export const Condition_build: (condition:Condition_condition, register:Register_t) => string = BrushlessBS.Condition.build;

export const Projection_build: (projection:Projection_projection, register:Register_t) => string = BrushlessBS.Projection.build;

export const KeyCondition_Maker_equals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.equals;

export const KeyCondition_Maker_notEquals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.notEquals;

export const KeyCondition_Maker_lessThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.lessThan;

export const KeyCondition_Maker_lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.lessThanOrEqualTo;

export const KeyCondition_Maker_greaterThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.greaterThan;

export const KeyCondition_Maker_greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.greaterThanOrEqualTo;

export const KeyCondition_Maker_between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.between;

export const KeyCondition_Maker_beginsWith: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.beginsWith;

export const KeyCondition_Maker_any: KeyCondition_skCondition = BrushlessBS.KeyCondition.Maker.any;

export const KeyCondition_equals: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.equals;

export const KeyCondition_notEquals: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.notEquals;

export const KeyCondition_lessThan: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.lessThan;

export const KeyCondition_lessThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.lessThanOrEqualTo;

export const KeyCondition_greaterThan: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.greaterThan;

export const KeyCondition_greaterThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.greaterThanOrEqualTo;

export const KeyCondition_between: (_1:AttributeName_t, _2:KeyCondition_limits) => KeyCondition_skCondition = BrushlessBS.KeyCondition.between;

export const KeyCondition_beginsWith: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition = BrushlessBS.KeyCondition.beginsWith;

export const KeyCondition_any: KeyCondition_skCondition = BrushlessBS.KeyCondition.any;

export const KeyCondition_build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string = BrushlessBS.KeyCondition.build;

export const Update_Maker_listAppend: (identifier:Update_operand, operand:Update_operand) => Update_operand = BrushlessBS.Update.Maker.listAppend;

export const Update_Maker_ifNotExists: (identifier:Update_operand, operand:Update_operand) => Update_operand = BrushlessBS.Update.Maker.ifNotExists;

export const Update_Maker_sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessBS.Update.Maker.sum;

export const Update_Maker_sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand = BrushlessBS.Update.Maker.sub;

export const Update_listAppend: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessBS.Update.listAppend;

export const Update_ifNotExists: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessBS.Update.ifNotExists;

export const Update_sum: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessBS.Update.sum;

export const Update_sub: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessBS.Update.sub;

export const Update_build: (update:Update_update, register:Register_t) => string = BrushlessBS.Update.build;

export const U_listAppend: (_1:U_operand, _2:U_operand) => U_operand = BrushlessBS.U.listAppend;

export const U_ifNotExists: (_1:U_operand, _2:U_operand) => U_operand = BrushlessBS.U.ifNotExists;

export const U_sum: (_1:U_operand, _2:U_operand) => U_operand = BrushlessBS.U.sum;

export const U_sub: (_1:U_operand, _2:U_operand) => U_operand = BrushlessBS.U.sub;

export const U_build: (_1:U_update, _2:Register_t) => string = BrushlessBS.U.build;

export const C_equals: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.equals;

export const C_notEquals: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.notEquals;

export const C_lessThan: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.lessThan;

export const C_lessThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.lessThanOrEqualTo;

export const C_greaterThan: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.greaterThan;

export const C_greaterThanOrEqualTo: (_1:C_operand, _2:C_operand) => C_condition = BrushlessBS.C.greaterThanOrEqualTo;

export const C_between: (_1:C_operand, _2:C_limits) => C_condition = BrushlessBS.C.between;

export const C_inList: (_1:C_operand, _2:C_operand[]) => C_condition = BrushlessBS.C.inList;

export const C_attributeExists: (_1:Identifier_t) => C_condition = BrushlessBS.C.attributeExists;

export const C_attributeNotExists: (_1:Identifier_t) => C_condition = BrushlessBS.C.attributeNotExists;

export const C_attributeType: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessBS.C.attributeType;

export const C_beginsWith: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessBS.C.beginsWith;

export const C_contains: (_1:Identifier_t, _2:C_operand) => C_condition = BrushlessBS.C.contains;

export const C_and: (_1:C_condition, _2:C_condition) => C_condition = BrushlessBS.C.and;

export const C_or: (_1:C_condition, _2:C_condition) => C_condition = BrushlessBS.C.or;

export const C_not: (_1:C_condition) => C_condition = BrushlessBS.C.not;

export const C_size: (_1:C_operand) => C_operand = BrushlessBS.C.size;

export const C_build: (_1:C_condition, _2:Register_t) => string = BrushlessBS.C.build;

export const K_equals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.equals;

export const K_notEquals: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.notEquals;

export const K_lessThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.lessThan;

export const K_lessThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.lessThanOrEqualTo;

export const K_greaterThan: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.greaterThan;

export const K_greaterThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.greaterThanOrEqualTo;

export const K_between: (_1:AttributeName_t, _2:K_limits) => K_skCondition = BrushlessBS.K.between;

export const K_beginsWith: (_1:AttributeName_t, _2:AttributeValue_t) => K_skCondition = BrushlessBS.K.beginsWith;

export const K_any: K_skCondition = BrushlessBS.K.any;

export const K_build: (_1:K_keyCondition, _2:Register_t) => string = BrushlessBS.K.build;

export const P_build: (_1:P_projection, _2:Register_t) => string = BrushlessBS.P.build;

export const AttributeName: { toString: (name:AttributeName_t) => string; make: (name:string) => AttributeName_t } = BrushlessBS.AttributeName

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
} = BrushlessBS.K

export const Identifier: { toString: (identifier:Identifier_t, register:Register_t) => string } = BrushlessBS.Identifier

export const Condition: {
  attributeType: (_1:Identifier_t, _2:Condition_operand) => Condition_condition; 
  notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  attributeNotExists: (_1:Identifier_t) => Condition_condition; 
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
    attributeType: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition; 
    notEquals: (lhs:Condition_operand, rhs:Condition_operand) => Condition_condition; 
    attributeNotExists: (identifier:Identifier_t) => Condition_condition; 
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
    beginsWith: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition; 
    or: (lhs:Condition_condition, rhs:Condition_condition) => Condition_condition; 
    attributeExists: (identifier:Identifier_t) => Condition_condition; 
    contains: (identifier:Identifier_t, operand:Condition_operand) => Condition_condition
  }; 
  beginsWith: (_1:Identifier_t, _2:Condition_operand) => Condition_condition; 
  or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition; 
  attributeExists: (_1:Identifier_t) => Condition_condition; 
  contains: (_1:Identifier_t, _2:Condition_operand) => Condition_condition
} = BrushlessBS.Condition

export const KeyCondition: {
  notEquals: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  greaterThan: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  greaterThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  between: (_1:AttributeName_t, _2:KeyCondition_limits) => KeyCondition_skCondition; 
  lessThanOrEqualTo: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  build: (keyCondition:KeyCondition_keyCondition, register:Register_t) => string; 
  any: KeyCondition_skCondition; 
  lessThan: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  equals: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition; 
  Maker: {
    notEquals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    greaterThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    between: (name:AttributeName_t, limits:KeyCondition_limits) => KeyCondition_skCondition; 
    lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    any: KeyCondition_skCondition; 
    lessThan: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    equals: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition; 
    beginsWith: (name:AttributeName_t, value:AttributeValue_t) => KeyCondition_skCondition
  }; 
  beginsWith: (_1:AttributeName_t, _2:AttributeValue_t) => KeyCondition_skCondition
} = BrushlessBS.KeyCondition

export const Update: {
  sub: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  listAppend: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  ifNotExists: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  sum: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  build: (update:Update_update, register:Register_t) => string; 
  Maker: {
    sub: (lhs:Update_operand, rhs:Update_operand) => Update_operand; 
    listAppend: (identifier:Update_operand, operand:Update_operand) => Update_operand; 
    ifNotExists: (identifier:Update_operand, operand:Update_operand) => Update_operand; 
    sum: (lhs:Update_operand, rhs:Update_operand) => Update_operand
  }
} = BrushlessBS.Update

export const Register: {
  addValue: (register:Register_t, element:AttributeValue_t) => AttributeValue_t; 
  addPath: (register:Register_t, element:AttributePath_t) => AttributePath_t; 
  addName: (register:Register_t, element:AttributeName_t) => AttributeName_t; 
  make: () => Register_t
} = BrushlessBS.Register

export const Projection: { build: (projection:Projection_projection, register:Register_t) => string } = BrushlessBS.Projection

export const AttributePath: { fromString: (str:string) => AttributePath_t; toString: (path:AttributePath_t) => string } = BrushlessBS.AttributePath

export const U: {
  sub: (_1:U_operand, _2:U_operand) => U_operand; 
  listAppend: (_1:U_operand, _2:U_operand) => U_operand; 
  ifNotExists: (_1:U_operand, _2:U_operand) => U_operand; 
  sum: (_1:U_operand, _2:U_operand) => U_operand; 
  build: (_1:U_update, _2:Register_t) => string
} = BrushlessBS.U

export const C: {
  attributeType: (_1:Identifier_t, _2:C_operand) => C_condition; 
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
} = BrushlessBS.C

export const AttributeValue: { toString: (value:AttributeValue_t) => string; make: (x:AttributeValue_from<attributeValue>) => AttributeValue_t } = BrushlessBS.AttributeValue

export const P: { build: (_1:P_projection, _2:Register_t) => string } = BrushlessBS.P
