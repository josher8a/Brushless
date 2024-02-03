/* TypeScript file generated from Attribute.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as AttributeJS from './Attribute.res.js';

import type {AttributeValue as $$marshalledValue} from './external';

export type marshalledValue = $$marshalledValue;

export type name = { TAG: "Name"; _0: string };

export type value_ = { readonly value: marshalledValue; readonly alias: string };

export type value = { TAG: "AttributeValue"; _0: value_ };

export type sub = 
    { TAG: "Name"; _0: string }
  | { TAG: "ListIndex"; _0: number };

export type path = 
    { TAG: "AttributePath"; _0: name; _1: sub[] };

export type t = 
    { TAG: "AttributePath"; _0: name; _1: sub[] }
  | { TAG: "Name"; _0: string }
  | { TAG: "AttributeValue"; _0: value_ };

export type parseError = 
    "InvalidPath"
  | "MissingBaseNameBeforeIndex"
  | "EmptyPath"
  | { TAG: "InvalidIndex"; _0: string };

export type identifier = 
    { TAG: "AttributePath"; _0: name; _1: sub[] }
  | { TAG: "Name"; _0: string };

export const name: (_1:string) => name = AttributeJS.name as any;

export const attributeValue: (_1:value_) => value = AttributeJS.attributeValue as any;

export const attributePath: (_1:name, _2:sub[]) => path = AttributeJS.attributePath as any;

export const pathFromString: (str:string) => 
    { TAG: "Ok"; _0: path }
  | { TAG: "Error"; _0: parseError } = AttributeJS.pathFromString as any;

export const pathFromStringUnsafe: (path:string) => path = AttributeJS.pathFromStringUnsafe as any;

export const toString: (x:t) => string = AttributeJS.toString as any;
