import { Attribute, Register, Condition, KeyCondition, C, K, U, P } from './Brushless.bs';
import {describe, it, expect} from 'bun:test';
import * as DynamoDB from '@aws-sdk/client-dynamodb'

describe('Expression', () => {
    describe('path', () => {
        it('should return the path of the expression', () => {
            const expression = Attribute.Path.fromString('foo.bar.baz');
            expect(Attribute.Path.toString(expression)).toEqual('#foo.#bar.#baz');
        }
        )
    })
    describe('ConditionExpression', () => {
        it('should return the condition expression', () => {
            const register = Register.make();
            const { equals } = Condition.Maker;
            const expression = Condition.build(equals(
                Attribute.Path.fromString('foo.bar.baz'),
                Attribute.Value.make({
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

            const pk = Attribute.Path.fromString("PK")
            const sk = Attribute.Path.fromString("SK")

            const pkVal = Attribute.Value.make({
                value: {
                    S: 'X'
                },
                alias: "PK"
            })

            const skVal = Attribute.Value.make({
                value: {
                    S: 'Y'
                },
                alias: "SK"
            })

            const foo = Attribute.Path.fromString("foo")
            const bar = Attribute.Path.fromString("bar")
            const baz = Attribute.Path.fromString("baz")
            const fooVal = Attribute.Value.make({
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
            const barVal = Attribute.Value.make({
                value: {
                    S: 'bar'
                },
                alias: "bar"
            })
            const bazVal = Attribute.Value.make({
                value: {
                    S: 'baz'
                },
                alias: "baz"
            })

            const path = Attribute.Path.fromString('foo.bar.baz[0]')




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
            console.log(JSON.stringify(command, null, 4))

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
                        [foo, U.ifNotExists(foo, Attribute.Value.make({
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
                        [foo, U.ifNotExists(foo, Attribute.Value.make({
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
                        [foo, U.ifNotExists(foo, Attribute.Value.make({
                            value: {
                                S: 'fi fa fo fum'
                            },
                            alias: "foo"
                        }))],
                        [bar, barVal],
                        [baz, U.listAppend(baz, bazVal)],
                        [path, U.sub(path, Attribute.Value.make({
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

            console.log(JSON.stringify(updateCommand, null, 4))
        })
    })
})