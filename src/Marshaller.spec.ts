import { describe, it, expect } from 'bun:test';
import { Marshaller } from './index';

const m = Marshaller.marshall;

describe('Marshaller.marshall', () => {
    it('marshalls scalars', () => {
        expect(m('hi')).toEqual({ S: 'hi' });
        expect(m(42)).toEqual({ N: '42' });
        expect(m(1.5)).toEqual({ N: '1.5' });
        expect(m(true)).toEqual({ BOOL: true });
        expect(m(null)).toEqual({ NULL: true });
        expect(m(undefined)).toEqual({ NULL: true });
        expect(m(10n)).toEqual({ N: '10' });
    });

    it('marshalls binary', () => {
        expect(m(new Uint8Array([1, 2]))).toEqual({ B: new Uint8Array([1, 2]) });
    });

    it('marshalls a heterogeneous list recursively', () => {
        expect(m([1, 'a', true])).toEqual({
            L: [{ N: '1' }, { S: 'a' }, { BOOL: true }],
        });
    });

    it('marshalls a nested object as a map recursively', () => {
        expect(m({ a: 1, b: { c: 'x' } })).toEqual({
            M: { a: { N: '1' }, b: { M: { c: { S: 'x' } } } },
        });
    });

    it('marshalls Sets by element type', () => {
        expect(m(new Set(['a', 'b']))).toEqual({ SS: ['a', 'b'] });
        expect(m(new Set([1, 2]))).toEqual({ NS: ['1', '2'] });
        expect(m(new Set([new Uint8Array([1])]))).toEqual({
            BS: [new Uint8Array([1])],
        });
    });

    it('throws on an empty Set (DynamoDB rejects empty sets)', () => {
        expect(() => m(new Set())).toThrow();
    });
});
