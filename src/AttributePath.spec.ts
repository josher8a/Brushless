import {Attribute} from './Brushless.bs';

describe('Attribute.Path', () => {
    it('should convert a string path to a list of elements', () => {
        expect(
            Attribute.Path.fromString(` 
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
                expect(() => Attribute.Path.fromString(''))
                    .toThrowError()
                expect(() => Attribute.Path.fromString(' '))
                    .toThrowError()
            }
        );
        it(
            'should throw an error when a path begins with a control character',
            () => {
                expect(() => Attribute.Path.fromString('[1]'))
                    .toThrowError()
                expect(() => Attribute.Path.fromString('.a[1]'))
                    .toThrowError()
                expect(() => Attribute.Path.fromString('].a[1]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when a list index access contains no numeric',
            () => {
                expect(() => Attribute.Path.fromString('foo[a]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when a list index access contains no characters',
            () => {
                expect(() => Attribute.Path.fromString('foo[]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when an identifier immediately follows a list index access',
            () => {
                expect(() => Attribute.Path.fromString('foo[1]a'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when no identifier is found before next access',
            () => {
                expect(() => Attribute.Path.fromString('foo..a'))
                    .toThrowError()
                expect(() => Attribute.Path.fromString('foo.[1]'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error when identifier contains spaces',
            () => {
                expect(() => Attribute.Path.fromString('fo o.a'))
                    .toThrowError()
            }
        );

        it(
            'should throw an error on unterminated string',
            () => {
                expect(() => Attribute.Path.fromString('foo[1'))
                    .toThrowError()
                expect(() => Attribute.Path.fromString('foo['))
                    .toThrowError()

                expect(() => Attribute.Path.fromString('foo[1].'))
                    .toThrowError()
                expect(() => Attribute.Path.fromString('foo.'))
                    .toThrowError()
            }
        );
    });

});
