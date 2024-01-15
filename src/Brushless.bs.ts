/* TypeScript file generated from Brushless.res by genType. */

/* eslint-disable */
/* tslint:disable */

const BrushlessJS = require('./Brushless.bs.js');

import type {AttributeValue as $$attributeValue} from './external';

import type {t as Dict_t} from './Dict.bs';

export type attributeValue = $$attributeValue;

export type Attribute_name = { TAG: "AttributeName"; _0: string };

export type Attribute_value_ = { readonly value: attributeValue; readonly alias: string };

export type Attribute_value = 
    { TAG: "AttributeValue"; _0: Attribute_value_ };

export type Attribute_from<a> = { readonly value: a; readonly alias: string };

export type Attribute_sub = 
    { TAG: "AttributeName"; _0: string }
  | { TAG: "ListIndex"; _0: number };

export type Attribute_path = 
    { TAG: "AttributePath"; _0: Attribute_name; _1: Attribute_sub[] };

export type Attribute_t = 
    { TAG: "AttributePath"; _0: Attribute_name; _1: Attribute_sub[] }
  | { TAG: "AttributeName"; _0: string }
  | { TAG: "AttributeValue"; _0: Attribute_value_ };

export type Attribute_parseState = "Name" | "Index";

export type Attribute_parseError = 
    "InvalidPath"
  | "MissingBaseNameBeforeIndex"
  | "EmptyPath"
  | { TAG: "InvalidIndex"; _0: string };

export type Attribute_identifier = 
    { TAG: "AttributePath"; _0: Attribute_name; _1: Attribute_sub[] }
  | { TAG: "AttributeName"; _0: string };

export type Register_t = { readonly names: Dict_t<string>; readonly values: Dict_t<attributeValue> };

export type Condition_size = { TAG: "Size"; _0: Attribute_t };

export type Condition_operand = 
    { TAG: "AttributePath"; _0: Attribute_name; _1: Attribute_sub[] }
  | { TAG: "AttributeName"; _0: string }
  | { TAG: "AttributeValue"; _0: Attribute_value_ }
  | { TAG: "Size"; _0: Attribute_t };

export type Condition_limits = { readonly lower: Condition_operand; readonly upper: Condition_operand };

export type Condition_condition = 
    { TAG: "Equals"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "NotEquals"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "LessThan"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "LessThanOrEqual"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "GreaterThan"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "GreaterThanOrEqual"; _0: Condition_operand; _1: Condition_operand }
  | { TAG: "Between"; _0: Condition_operand; _1: Condition_limits }
  | { TAG: "InList"; _0: Condition_operand; _1: Condition_operand[] }
  | { TAG: "And"; _0: Condition_condition; _1: Condition_condition }
  | { TAG: "Or"; _0: Condition_condition; _1: Condition_condition }
  | { TAG: "Not"; _0: Condition_condition }
  | { TAG: "AttributeExists"; _0: Attribute_identifier }
  | { TAG: "AttributeNotExists"; _0: Attribute_identifier }
  | { TAG: "AttributeType"; _0: Attribute_identifier; _1: Condition_operand }
  | { TAG: "BeginsWith"; _0: Attribute_identifier; _1: Condition_operand }
  | { TAG: "Contains"; _0: Attribute_identifier; _1: Condition_operand };

export type Projection_projection = Attribute_identifier[];

export type KeyCondition_pkCondition = 
    { TAG: "PartitionKey"; _0: Attribute_name; _1: Attribute_value };

export type KeyCondition_limits = { readonly lower: Attribute_value; readonly upper: Attribute_value };

export type KeyCondition_skCondition = 
    { TAG: "Equals"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "NotEquals"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "LessThan"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "LessThanOrEqual"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "GreaterThan"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "GreaterThanOrEqual"; _0: Attribute_name; _1: Attribute_value }
  | { TAG: "Between"; _0: Attribute_name; _1: KeyCondition_limits }
  | { TAG: "BeginsWith"; _0: Attribute_name; _1: Attribute_value };

export type KeyCondition_keyCondition = { readonly pk: KeyCondition_pkCondition; readonly sk?: KeyCondition_skCondition };

export type Update_funcParams<a> = { readonly identifier: a; readonly operand: a };

export type Update_operand = 
    { TAG: "Attribute"; _0: Attribute_t }
  | { TAG: "ListAppend"; _0: Update_funcParams<Update_operand> }
  | { TAG: "IfNotExists"; _0: Update_funcParams<Update_operand> }
  | { TAG: "Sum"; _0: Update_operand; _1: Update_operand }
  | { TAG: "Sub"; _0: Update_operand; _1: Update_operand };

export type Update_update = {
  readonly set?: Array<[Attribute_identifier, Update_operand]>; 
  readonly remove?: Attribute_identifier[]; 
  readonly add?: Array<[Attribute_identifier, Attribute_t]>; 
  readonly delete?: Array<[Attribute_identifier, Attribute_t]>
};

export const Attribute_attributeName: (_1:string) => Attribute_name = BrushlessJS.Attribute.attributeName as any;

export const Attribute_attributeValue: (_1:Attribute_value_) => Attribute_value = BrushlessJS.Attribute.attributeValue as any;

export const Attribute_make: (x:Attribute_value_) => Attribute_value = BrushlessJS.Attribute.make as any;

export const Attribute_attributePath: (_1:Attribute_name, _2:Attribute_sub[]) => Attribute_path = BrushlessJS.Attribute.attributePath as any;

export const Attribute_pathFromString: (str:string) => 
    { TAG: "Ok"; _0: Attribute_path }
  | { TAG: "Error"; _0: Attribute_parseError } = BrushlessJS.Attribute.pathFromString as any;

export const Attribute_pathFromStringUnsafe: (path:string) => Attribute_path = BrushlessJS.Attribute.pathFromStringUnsafe as any;

export const Attribute_toString: (x:Attribute_t) => string = BrushlessJS.Attribute.toString as any;

export const Register_make: () => Register_t = BrushlessJS.Register.make as any;

export const Register_add: (register:Register_t, element:Attribute_t) => Attribute_t = BrushlessJS.Register.add as any;

export const Register_addToString: (register:Register_t, element:Attribute_t) => string = BrushlessJS.Register.addToString as any;

export const Condition_size: (_1:Attribute_t) => Condition_size = BrushlessJS.Condition.size as any;

export const Condition_equals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.equals as any;

export const Condition_notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.notEquals as any;

export const Condition_lessThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThan as any;

export const Condition_lessThanOrEqual: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.lessThanOrEqual as any;

export const Condition_greaterThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThan as any;

export const Condition_greaterThanOrEqual: (_1:Condition_operand, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.greaterThanOrEqual as any;

export const Condition_between: (_1:Condition_operand, _2:Condition_limits) => Condition_condition = BrushlessJS.Condition.between as any;

export const Condition_inList: (_1:Condition_operand, _2:Condition_operand[]) => Condition_condition = BrushlessJS.Condition.inList as any;

export const Condition_and: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessJS.Condition.and as any;

export const Condition_or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition = BrushlessJS.Condition.or as any;

export const Condition_not: (_1:Condition_condition) => Condition_condition = BrushlessJS.Condition.not as any;

export const Condition_attributeExists: (_1:Attribute_identifier) => Condition_condition = BrushlessJS.Condition.attributeExists as any;

export const Condition_attributeNotExists: (_1:Attribute_identifier) => Condition_condition = BrushlessJS.Condition.attributeNotExists as any;

export const Condition_attributeType: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.attributeType as any;

export const Condition_beginsWith: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.beginsWith as any;

export const Condition_contains: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition = BrushlessJS.Condition.contains as any;

export const Condition_build: (condition:Condition_condition, register:Register_t) => string = BrushlessJS.Condition.build as any;

export const Projection_build: (projection:Projection_projection, register:Register_t) => string = BrushlessJS.Projection.build as any;

export const KeyCondition_partitionKey: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_pkCondition = BrushlessJS.KeyCondition.partitionKey as any;

export const KeyCondition_equals: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.equals as any;

export const KeyCondition_notEquals: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.notEquals as any;

export const KeyCondition_lessThan: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThan as any;

export const KeyCondition_lessThanOrEqual: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.lessThanOrEqual as any;

export const KeyCondition_greaterThan: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThan as any;

export const KeyCondition_greaterThanOrEqual: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.greaterThanOrEqual as any;

export const KeyCondition_between: (_1:Attribute_name, _2:KeyCondition_limits) => KeyCondition_skCondition = BrushlessJS.KeyCondition.between as any;

export const KeyCondition_beginsWith: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition = BrushlessJS.KeyCondition.beginsWith as any;

export const KeyCondition_build: (condition:KeyCondition_keyCondition, register:Register_t) => string = BrushlessJS.KeyCondition.build as any;

export const Update_attribute: (_1:Attribute_t) => Update_operand = BrushlessJS.Update.attribute as any;

export const Update_listAppend: (_1:Update_funcParams<Update_operand>) => Update_operand = BrushlessJS.Update.listAppend as any;

export const Update_ifNotExists: (_1:Update_funcParams<Update_operand>) => Update_operand = BrushlessJS.Update.ifNotExists as any;

export const Update_sum: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.sum as any;

export const Update_sub: (_1:Update_operand, _2:Update_operand) => Update_operand = BrushlessJS.Update.sub as any;

export const Update_build: (update:Update_update, register:Register_t) => string = BrushlessJS.Update.build as any;

export const Condition: {
  attributeType: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition; 
  notEquals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  attributeNotExists: (_1:Attribute_identifier) => Condition_condition; 
  greaterThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  size: (_1:Attribute_t) => Condition_size; 
  between: (_1:Condition_operand, _2:Condition_limits) => Condition_condition; 
  inList: (_1:Condition_operand, _2:Condition_operand[]) => Condition_condition; 
  and: (_1:Condition_condition, _2:Condition_condition) => Condition_condition; 
  lessThanOrEqual: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  build: (condition:Condition_condition, register:Register_t) => string; 
  not: (_1:Condition_condition) => Condition_condition; 
  lessThan: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  equals: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  greaterThanOrEqual: (_1:Condition_operand, _2:Condition_operand) => Condition_condition; 
  or: (_1:Condition_condition, _2:Condition_condition) => Condition_condition; 
  beginsWith: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition; 
  attributeExists: (_1:Attribute_identifier) => Condition_condition; 
  contains: (_1:Attribute_identifier, _2:Condition_operand) => Condition_condition
} = BrushlessJS.Condition as any;

export const KeyCondition: {
  partitionKey: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_pkCondition; 
  notEquals: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  greaterThan: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  between: (_1:Attribute_name, _2:KeyCondition_limits) => KeyCondition_skCondition; 
  lessThanOrEqual: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  build: (condition:KeyCondition_keyCondition, register:Register_t) => string; 
  lessThan: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  equals: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  greaterThanOrEqual: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition; 
  beginsWith: (_1:Attribute_name, _2:Attribute_value) => KeyCondition_skCondition
} = BrushlessJS.KeyCondition as any;

export const Update: {
  sub: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  listAppend: (_1:Update_funcParams<Update_operand>) => Update_operand; 
  ifNotExists: (_1:Update_funcParams<Update_operand>) => Update_operand; 
  sum: (_1:Update_operand, _2:Update_operand) => Update_operand; 
  build: (update:Update_update, register:Register_t) => string; 
  attribute: (_1:Attribute_t) => Update_operand
} = BrushlessJS.Update as any;

export const Register: {
  add: (register:Register_t, element:Attribute_t) => Attribute_t; 
  addToString: (register:Register_t, element:Attribute_t) => string; 
  make: () => Register_t
} = BrushlessJS.Register as any;

export const Projection: { build: (projection:Projection_projection, register:Register_t) => string } = BrushlessJS.Projection as any;

export const Attribute: {
  attributeValue: (_1:Attribute_value_) => Attribute_value; 
  pathFromStringUnsafe: (path:string) => Attribute_path; 
  attributePath: (_1:Attribute_name, _2:Attribute_sub[]) => Attribute_path; 
  attributeName: (_1:string) => Attribute_name; 
  toString: (x:Attribute_t) => string; 
  pathFromString: (str:string) => 
    {
    TAG: "Ok"; 
    _0: Attribute_path
  }
  | {
    TAG: "Error"; 
    _0: Attribute_parseError
  }; 
  make: (x:Attribute_value_) => Attribute_value
} = BrushlessJS.Attribute as any;
