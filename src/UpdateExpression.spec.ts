import {describe, it, expect} from 'bun:test';
import { Register , AttributeName, AttributeValue, Update} from "./Brushless.bs";
import * as Marshaller from "@aws-sdk/util-dynamodb"

const DefaultMarshaller = {
    marshallValue: Marshaller.convertToAttr
}
describe('UpdateExpression', () => {
    it('should serialize ADD clauses', () => {
        const register = Register.make();
        expect(Update.build({
            add: [
                [AttributeName.make('foo'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [AttributeName.make('fizz'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
            ]
        }, register))
            .toBe('ADD #foo :val1, #fizz :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize DELETE clauses', () => {
        const register = Register.make();
        expect(Update.build({
            delete: [
                [AttributeName.make('foo'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [AttributeName.make('fizz'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
            ]
        }, register))
            .toBe('DELETE #foo :val1, #fizz :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize REMOVE clauses', () => {
        const register = Register.make();
        expect(Update.build({
            remove: [
                AttributeName.make('foo'),
                AttributeName.make('fizz')
            ]
        }, register))
            .toBe('REMOVE #foo, #fizz');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toBeUndefined();
    });

    it('should serialize SET clauses', () => {
        const register = Register.make();
        expect(Update.build({
            set: [
                [AttributeName.make('foo'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [AttributeName.make('fizz'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
            ]
        }, register))
            .toBe('SET #foo = :val1, #fizz = :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize SET clauses with function expressions', () => {
        const register = Register.make();
        const {listAppend} = Update
        const foo = AttributeName.make('foo')
        expect(Update.build({
            set: [
                [foo,listAppend(foo, AttributeValue.make({
                    value: {
                        S: 'bar'
                    },
                    alias: 'val1'
                }))],
            ]
        }, register))
            .toBe('SET #foo = list_append(#foo, :val1)');
        expect(register.names).toEqual({
            '#foo': 'foo',
        });
        expect(register.values).toEqual({
            ':val1': {S: 'bar'},
        });
    });

    it('should serialize SET clauses with mathematical expressions', () => {
        const register = Register.make();
        const {sum} = Update
        const foo = AttributeName.make('foo')
        expect(Update.build({
            set: [
                [foo,sum(foo, AttributeValue.make({
                    value: {
                        N: '1'
                    },
                    alias: 'val1'
                }))],
            ]}
        , register)).toBe('SET #foo = #foo + :val1');
        expect(register.names).toEqual({
            '#foo': 'foo',
        });
        expect(register.values).toEqual({
            ':val1': {N: '1'},
        });
    });

    it('should serialize expressions with multiple clauses', () => {;

        const attributes = Register.make();
        expect( Update.build({
            add: [
                [AttributeName.make('foo'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['baz']))!,
                    alias: 'val1'
                })]
            ],
            delete: [
                [AttributeName.make('foo'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['quux']))!,
                    alias: 'val2'
                })]
            ],
            remove: [
                AttributeName.make('fizz')
            ],
            set: [
                [AttributeName.make('buzz'), AttributeValue.make({
                    value: DefaultMarshaller.marshallValue(new Set(['pop']))!,
                    alias: 'val4'
                })]
            ]
        }, attributes)).toBe(
            'ADD #foo :val1 DELETE #foo :val2 SET #buzz = :val4 REMOVE #fizz'
        );
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#buzz': 'buzz',
            '#fizz': 'fizz',
        });
        expect(attributes.values).toEqual({
            ':val1': {SS: ['baz']},
            ':val2': {SS: ['quux']},
            ':val4': {SS: ['pop']},
        });
    });

});
