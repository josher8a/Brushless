import {AttributePath} from './Brushless.bs';

describe('AttributePath', () => {
    it('should convert a string path to a list of elements', () => {
        expect(
            AttributePath.fromString(` 
            foo 
            .bar
            .baz[3 ][4][2]
            .fizz[0]
            .buzz[1] 
            `)
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
            'should throw an error when a path is empty',
            () => {
                expect(() => AttributePath.fromString(''))
                    .toThrowError()
                expect(() => AttributePath.fromString(' '))
                    .toThrowError()
            }
        );
        it(
            'should throw an error when a path begins with a control character',
            () => {
                expect(() => AttributePath.fromString('[1]'))
                    .toThrowError()
                expect(() => AttributePath.fromString('.a[1]'))
                    .toThrowError()
                expect(() => AttributePath.fromString('].a[1]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when a list index access contains no numeric',
            () => {
                expect(() => AttributePath.fromString('foo[a]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when a list index access contains no characters',
            () => {
                expect(() => AttributePath.fromString('foo[]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when an identifier immediately follows a list index access',
            () => {
                expect(() => AttributePath.fromString('foo[1]a'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when no identifier is found before next access',
            () => {
                expect(() => AttributePath.fromString('foo..a'))
                    .toThrowError()
                expect(() => AttributePath.fromString('foo.[1]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when identifier contains spaces',
            () => {
                expect(() => AttributePath.fromString('fo o.a'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error on unterminated string',
            () => {
                expect(() => AttributePath.fromString('foo[1'))
                    .toThrowError()
                expect(() => AttributePath.fromString('foo['))
                    .toThrowError()

                expect(() => AttributePath.fromString('foo[1].'))
                    .toThrowError()
                expect(() => AttributePath.fromString('foo.'))
                    .toThrowError()
            }
        );
    });

});
