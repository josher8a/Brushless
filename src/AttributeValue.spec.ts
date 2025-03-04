import { describe, it, expect } from 'bun:test';
import { AttributeValue, Register, Register_attributeValue_ } from "./Brushless.bs";
import * as Marshaller from "@aws-sdk/util-dynamodb"

const DefaultMarshaller = {
    marshallValue: Marshaller.convertToAttr
}
describe('AttributeValue', () => {
    describe('::isAttributeValue', () => {
        it('should accept valid attribute values', () => {
            const value = AttributeValue.make({
                value: {
                    S: 'string',
                },
                alias: 'www'
            });

            const valueWithMarshalled = AttributeValue.make({
                value: DefaultMarshaller.marshallValue("string")!,
                alias: 'www'
            });

            expect(value).toBeTruthy();
            expect(valueWithMarshalled).toMatchObject(value);
        });
    });

    describe('::isValueEqual', () => {
        const base : Register_attributeValue_= {
            S: undefined,
            N: undefined,
            B: undefined,
            SS: undefined,
            NS: undefined,
            BS: undefined,
            M: undefined,
            L: undefined,
            NULL: undefined,
            BOOL: undefined
        }
        const examples : [Register_attributeValue_,Register_attributeValue_][]= [[{
            ...base,
            S: 'string',
        }, {
            ...base,
            S: 'string2',
        }], [{
            ...base,
            N: '1',
        }, {
            ...base,
            N: '2',
        }], [{
            ...base,
            B: new Uint8Array([1]),
        }, {
            ...base,
            B: new Uint8Array([2]),
        }], [{
            ...base,
            SS: ['string'],
        }, {
            ...base,
            SS: ['string2'],
        }], [{
            ...base,
            NS: ['1'],
        }, {
            ...base,
            NS: ['2'],
        }], [{
            ...base,
            BS: [new Uint8Array([1])],
        }, {
            ...base,
            BS: [new Uint8Array([2])],
        }], [{
            ...base,
            M: {
                a: {
                    ...base,
                    S: 'string',
                }
            },
        }, {
            ...base,
            M: {
                a: {
                    ...base,
                    S: 'string2',
                }
            },
        }], [{
            ...base,
            L: [{
                ...base,
                S: 'string',
            }],
        }, {
            ...base,
            L: [{
                ...base,
                S: 'string2',
            }],
        }], [{
            ...base,
            NULL: true,
        }, {
            ...base,
            NULL: false,
        }], [{
            ...base,
            BOOL: true
        }, {
            ...base,
            BOOL: false
        }]
        ]

        it.each(examples)('should return true for equal values', (a,b) => {


                expect(Register.isValueEqual(a, a)).toBeTrue();
                expect(Register.isValueEqual(b, b)).toBeTrue();
                expect(Register.isValueEqual(a, b)).toBeFalse();
        });
    })

});
