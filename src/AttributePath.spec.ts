import {describe, it, expect} from 'bun:test';
import {AttributePath} from './index';

describe('AttributePath', () => {
    it('should convert a string path to a list of elements', () => {
        expect(
            AttributePath.fromString('foo.bar.baz[3][4][2].fizz[0].buzz[1]')
        ).toMatchObject({
            name:  'foo',
            subpath:[
            {TAG: 'AttributeName', name: 'bar'},
            {TAG: 'AttributeName', name: 'baz'},
            {TAG: 'ListIndex', index: 3},
            {TAG: 'ListIndex', index: 4},
            {TAG: 'ListIndex', index: 2},
            {TAG: 'AttributeName', name: 'fizz'},
            {TAG: 'ListIndex', index: 0},
            {TAG: 'AttributeName', name: 'buzz'},
            {TAG: 'ListIndex', index: 1},
        ]});
    });


    describe('path correctness checking', () => {
        it(
            'should throw an error when a path begins with a control character',
            () => {
                expect(() => AttributePath.fromString('[1]'))
                    .toThrowError('InvalidPath');
            }
        );

        it(
            'should throw an error when a list index access contains invalid characters',
            () => {
                expect(() => AttributePath.fromString('foo[a]'))
                    .toThrowError('InvalidIndex');
            }
        );

        it(
            'should throw an error when a list index access contains no characters',
            () => {
                expect(() => AttributePath.fromString('foo[]'))
                    .toThrowError('InvalidIndex');
            }
        );

        it(
            'should throw an error when an identifier immediately follows a list index access',
            () => {
                expect(() => AttributePath.fromString('foo[1]a'))
                    .toThrowError('InvalidPath');
            }
        );
    });

});
