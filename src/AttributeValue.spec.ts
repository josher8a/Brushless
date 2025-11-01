import { describe, it, expect } from 'bun:test';
import { AttributeValue, Register, attributeValue } from "./Brushless.bs";
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
        const examples: [attributeValue, attributeValue][] = [[{
            S: 'string',
        }, {
            S: 'string2',
        }], [{
            N: '1',
        }, {
            N: '2',
        }], [{
            B: new Uint8Array([1]),
        }, {
            B: new Uint8Array([2]),
        }], [{
            SS: ['string'],
        }, {
            SS: ['string2'],
        }], [{
            NS: ['1'],
        }, {
            NS: ['2'],
        }], [{
            BS: [new Uint8Array([1])],
        }, {
            BS: [new Uint8Array([2])],
        }], [{
            M: {
                a: {
                    S: 'string',
                }
            },
        }, {
            M: {
                a: {
                    S: 'string2',
                }
            },
        }], [{
            L: [{
                S: 'string',
            }],
        }, {
            L: [{
                S: 'string2',
            }],
        }], [{
            NULL: true,
        }, {
            NULL: false,
        }], [{
            BOOL: true
        }, {
            BOOL: false
        }]
        ]

        it.each(examples)('should return true for equal values', (a, b) => {
            expect(Register.isValueEqual(a, a)).toBeTrue();
            expect(Register.isValueEqual(b, b)).toBeTrue();
            expect(Register.isValueEqual(a, b)).toBeFalse();
        });
    })

});
