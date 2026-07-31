/* TypeScript file generated from Types.res by genType. */

/* eslint-disable */
/* tslint:disable */

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

export type comparator = "=" | "<>" | "<" | "<=" | ">" | ">=";
