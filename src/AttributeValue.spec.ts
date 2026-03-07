import { describe, it, expect } from 'bun:test';
import { AttributeValue, Register, type attributeValue } from "./index";
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

        it('should return false for cross-type comparisons', () => {
            expect(Register.isValueEqual({ S: '1' }, { N: '1' })).toBeFalse();
            expect(Register.isValueEqual({ N: '1' }, { BOOL: true })).toBeFalse();
            expect(Register.isValueEqual({ NULL: true }, { S: 'true' })).toBeFalse();
            expect(Register.isValueEqual({ SS: ['a'] }, { L: [{ S: 'a' }] })).toBeFalse();
            expect(Register.isValueEqual({ B: new Uint8Array([1]) }, { BS: [new Uint8Array([1])] })).toBeFalse();
        });

        it('should compare nested M with mixed value types', () => {
            const a: attributeValue = { M: { x: { N: '1' }, y: { S: 'hello' } } };
            const b: attributeValue = { M: { x: { N: '1' }, y: { S: 'hello' } } };
            const c: attributeValue = { M: { x: { N: '1' }, y: { N: '2' } } };
            expect(Register.isValueEqual(a, b)).toBeTrue();
            expect(Register.isValueEqual(a, c)).toBeFalse();
        });

        it('should compare nested L with mixed value types', () => {
            const a: attributeValue = { L: [{ S: 'a' }, { N: '1' }, { BOOL: true }] };
            const b: attributeValue = { L: [{ S: 'a' }, { N: '1' }, { BOOL: true }] };
            const c: attributeValue = { L: [{ S: 'a' }, { N: '1' }, { BOOL: false }] };
            expect(Register.isValueEqual(a, b)).toBeTrue();
            expect(Register.isValueEqual(a, c)).toBeFalse();
        });

        it('should compare deeply nested M inside L', () => {
            const a: attributeValue = { L: [{ M: { k: { S: 'v' } } }] };
            const b: attributeValue = { L: [{ M: { k: { S: 'v' } } }] };
            const c: attributeValue = { L: [{ M: { k: { S: 'w' } } }] };
            expect(Register.isValueEqual(a, b)).toBeTrue();
            expect(Register.isValueEqual(a, c)).toBeFalse();
        });

        it('should return false for M with different key counts', () => {
            const a: attributeValue = { M: { x: { S: 'a' } } };
            const b: attributeValue = { M: { x: { S: 'a' }, y: { S: 'b' } } };
            expect(Register.isValueEqual(a, b)).toBeFalse();
        });

        it('should return false for L with different lengths', () => {
            expect(Register.isValueEqual(
                { L: [{ S: 'a' }] },
                { L: [{ S: 'a' }, { S: 'b' }] }
            )).toBeFalse();
        });
    })

    describe('addValue alias collision', () => {
        it('should reuse alias for deep-equal values', () => {
            const register = Register.make();
            const v1 = AttributeValue.make({ value: { S: 'hello' }, alias: 'val' });
            const v2 = AttributeValue.make({ value: { S: 'hello' }, alias: 'val' });
            Register.addValue(register, v1);
            Register.addValue(register, v2);
            expect(register.values).toEqual({ ':val': { S: 'hello' } });
        });

        it('should suffix alias when values collide but differ', () => {
            const register = Register.make();
            const v1 = AttributeValue.make({ value: { S: 'hello' }, alias: 'val' });
            const v2 = AttributeValue.make({ value: { S: 'world' }, alias: 'val' });
            Register.addValue(register, v1);
            Register.addValue(register, v2);
            expect(register.values).toEqual({
                ':val': { S: 'hello' },
                ':val_': { S: 'world' },
            });
        });

        it('should chain suffixes for multiple collisions', () => {
            const register = Register.make();
            Register.addValue(register, AttributeValue.make({ value: { S: 'a' }, alias: 'x' }));
            Register.addValue(register, AttributeValue.make({ value: { S: 'b' }, alias: 'x' }));
            Register.addValue(register, AttributeValue.make({ value: { S: 'c' }, alias: 'x' }));
            expect(register.values).toEqual({
                ':x': { S: 'a' },
                ':x_': { S: 'b' },
                ':x__': { S: 'c' },
            });
        });
    })

});
