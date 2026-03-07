import {describe, it, expect} from 'bun:test';
import { AttributeName, AttributePath, AttributeValue, Register, Condition, KeyCondition, C, K, U, P } from './index';
import * as DynamoDB from '@aws-sdk/client-dynamodb'

describe('Expression', () => {
    describe('path', () => {
        it('should return the path of the expression', () => {
            const expression = AttributePath.fromString('foo.bar.baz');
            expect(AttributePath.toString(expression)).toEqual('#foo.#bar.#baz');
        }
        )
    })
    describe('ConditionExpression', () => {
        it('should return the condition expression', () => {
            const register = Register.make();
            const { equals } = Condition;
            const expression = Condition.build(equals(
                AttributePath.fromString('foo.bar.baz'),
                AttributeValue.make({
                    value: {
                        S: 'foo'
                    },
                    alias: 'foo'
                })
            ), register)
            expect(expression).toEqual('#foo.#bar.#baz = :foo');
        }
        )

        it('example use case', () => {

            const register = Register.make()

            const pk = AttributeName.make("PK")
            const sk = AttributeName.make("SK")

            const pkVal = AttributeValue.make({
                value: {
                    S: 'X'
                },
                alias: "PK"
            })

            const skVal = AttributeValue.make({
                value: {
                    S: 'Y'
                },
                alias: "SK"
            })

            const foo = AttributeName.make("foo")
            const bar = AttributeName.make("bar")
            const baz = AttributeName.make("baz")
            const fooVal = AttributeValue.make({
                value: {
                    M: {
                        foo: {
                            S: 'foo'
                        },
                        bar: {
                            SS: ['bar', 'baz']
                        },
                        baz: {
                            L: [
                                {
                                    S: 'baz'
                                }
                            ]
                        }
                    }
                },
                alias: "foo"
            })
            const barVal = AttributeValue.make({
                value: {
                    S: 'bar'
                },
                alias: "bar"
            })
            const bazVal = AttributeValue.make({
                value: {
                    S: 'baz'
                },
                alias: "baz"
            })

            const path = AttributePath.fromString('foo.bar.baz[0]')




            const command: DynamoDB.QueryInput = {
                TableName: 'YourTable',
                KeyConditionExpression: KeyCondition.build({
                    pk: {
                        name: pk,
                        value: pkVal
                    },
                    sk: K.beginsWith(sk, skVal)
                }, register),
                FilterExpression: Condition.build(
                    C.and(C.equals(path, skVal), C.or(C.equals(foo, fooVal), C.and(C.equals(bar, barVal), C.contains(path, bazVal))))
                    , register),
                ProjectionExpression: P.build([foo, bar, baz], register),
                ExpressionAttributeNames: register.names,
                ExpressionAttributeValues: register.values
            }
            expect(command.KeyConditionExpression).toBe('#PK = :PK AND begins_with(#SK, :SK)');
            expect(command.FilterExpression).toBe(
                '(#foo.#bar.#baz[0] = :SK) AND ((#foo = :foo) OR ((#bar = :bar) AND (contains(#foo.#bar.#baz[0], :baz))))'
            );
            expect(command.ProjectionExpression).toBe('#foo, #bar, #baz');
            expect(command.ExpressionAttributeNames).toEqual({
                '#PK': 'PK',
                '#SK': 'SK',
                '#foo': 'foo',
                '#bar': 'bar',
                '#baz': 'baz',
            });
            expect(command.ExpressionAttributeValues).toEqual({
                ':PK': { S: 'X' },
                ':SK': { S: 'Y' },
                ':foo': { M: { foo: { S: 'foo' }, bar: { SS: ['bar', 'baz'] }, baz: { L: [{ S: 'baz' }] } } },
                ':bar': { S: 'bar' },
                ':baz': { S: 'baz' },
            });

            const updateCommand: DynamoDB.UpdateItemInput = {
                TableName: 'YourTable',
                Key: {
                    PK: pkVal.value,
                    SK: skVal.value
                },
                UpdateExpression: U.build({
                    set: [
                        [foo, U.ifNotExists(foo, fooVal)],
                        [foo, U.ifNotExists(foo, fooVal)],
                        [foo, U.ifNotExists(foo, AttributeValue.make({
                            value: {
                                M: {
                                    foo: {
                                        S: 'foo'
                                    },
                                    bar: {
                                        SS: ['bar', 'baz']
                                    },
                                    baz: {
                                        L: [
                                            {
                                                S: 'baz'
                                            }
                                        ]
                                    }
                                }
                            },
                            alias: "foo"
                        }))],
                        [foo, U.ifNotExists(foo, AttributeValue.make({
                            value: {
                                M: {
                                    foo: {
                                        S: 'foo'
                                    },
                                    bar: {
                                        SS: ['bar', 'baz']
                                    },
                                    baz: {
                                        L: [
                                            {
                                                S: 'baz'
                                            },
                                            {
                                                S: 'bar'
                                            }
                                        ]
                                    },
                                }
                            },
                            alias: "foo"
                        }))],
                        [foo, U.ifNotExists(foo, AttributeValue.make({
                            value: {
                                S: 'fi fa fo fum'
                            },
                            alias: "foo"
                        }))],
                        [bar, barVal],
                        [baz, U.listAppend(baz, bazVal)],
                        [path, U.sub(path, AttributeValue.make({
                            value: {
                                N: '1'
                            },
                            alias: "one"
                        }))]

                    ]
                }, register),
                ConditionExpression: Condition.build(
                    C.and(C.equals(path, skVal), C.or(C.equals(foo, fooVal), C.and(C.equals(bar, barVal), C.contains(path, bazVal)))), register),
                ExpressionAttributeNames: register.names,
                ExpressionAttributeValues: register.values,
            }

            expect(updateCommand.UpdateExpression).toBe(
                'SET #foo = if_not_exists(#foo, :foo), #foo = if_not_exists(#foo, :foo), #foo = if_not_exists(#foo, :foo), #foo = if_not_exists(#foo, :foo_), #foo = if_not_exists(#foo, :foo__), #bar = :bar, #baz = list_append(#baz, :baz), #foo.#bar.#baz[0] = #foo.#bar.#baz[0] - :one'
            );
            expect(updateCommand.ConditionExpression).toBe(
                '(#foo.#bar.#baz[0] = :SK) AND ((#foo = :foo) OR ((#bar = :bar) AND (contains(#foo.#bar.#baz[0], :baz))))'
            );
            expect(updateCommand.ExpressionAttributeValues).toEqual({
                ':PK': { S: 'X' },
                ':SK': { S: 'Y' },
                ':foo': { M: { foo: { S: 'foo' }, bar: { SS: ['bar', 'baz'] }, baz: { L: [{ S: 'baz' }] } } },
                ':bar': { S: 'bar' },
                ':baz': { S: 'baz' },
                ':foo_': { M: { foo: { S: 'foo' }, bar: { SS: ['bar', 'baz'] }, baz: { L: [{ S: 'baz' }, { S: 'bar' }] } } },
                ':foo__': { S: 'fi fa fo fum' },
                ':one': { N: '1' },
            });
        })
    })
})