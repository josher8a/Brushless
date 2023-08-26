/* TypeScript file generated from Marshaller.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const MarshallerBS = require('./Marshaller.bs');

import type {Marshaller as $$DefaultMarshaller_t} from '@aws/dynamodb-auto-marshaller';

import type {attributeValue as Dynamo_attributeValue} from 'brushless/src/Brushless.bs';

// tslint:disable-next-line:interface-over-type-literal
export type DefaultMarshaller_t = $$DefaultMarshaller_t;

export const DefaultMarshaller_marshaller: DefaultMarshaller_t = MarshallerBS.DefaultMarshaller.marshaller;

export const DefaultMarshaller_marshallValue: <T1>(x:T1) => Dynamo_attributeValue = MarshallerBS.DefaultMarshaller.marshallValue;

export const DefaultMarshaller: { marshallValue: <T1>(x:T1) => Dynamo_attributeValue; marshaller: DefaultMarshaller_t } = MarshallerBS.DefaultMarshaller
