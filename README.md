# Brushless

[Brushless](https://github.com/josher8a/Brushless) is a DynamoDB expression library that allows you to write frictionless, maintainable, and type-safe expressions. It has zero dependencies and is built with [ReScript](https://rescript-lang.org/), providing full [TypeScript](https://www.typescriptlang.org/) support.

## Installation

```bash
npm install brushless
```
## Usage

TypeScript example usage:

```typescript

    import { AttributeName, AttributePath, AttributeValue, Register, C, K, U, P } from './Brushless.bs';
    import { DynamoDB } from 'aws-sdk';

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
            S: 'foo'
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

    const queryCommand: DynamoDB.QueryInput = {
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

    const updateCommand: DynamoDB.UpdateItemInput = {
        TableName: 'YourTable',
        Key: {
            PK: pkVal.value,
            SK: skVal.value
        },
        UpdateExpression: U.build({
            set: [
                [foo, U.ifNotExists(foo, fooVal)],
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
```

The above code will generate the following DynamoDB commands:
```json
// queryCommand
    {
        "TableName": "YourTable",
        "KeyConditionExpression": "#PK = :PK AND begins_with(#SK, :SK)",
        "FilterExpression": "(#foo.#bar.#baz[0] = :SK) AND ((#foo = :foo) OR ((#bar = :bar) AND (contains(#foo.#bar.#baz[0], :baz))))",
        "ProjectionExpression": "#foo, #bar, #baz",
        "ExpressionAttributeNames": {
            "#PK": "PK",
            "#SK": "SK",
            "#foo": "foo",
            "#bar": "bar",
            "#baz": "baz"
        },
        "ExpressionAttributeValues": {
            ":PK": {
                "S": "X"
            },
            ":SK": {
                "S": "Y"
            },
            ":foo": {
                "S": "foo"
            },
            ":bar": {
                "S": "bar"
            },
            ":baz": {
                "S": "baz"
            }
        }
    }

// updateCommand
    {
        "TableName": "YourTable",
        "Key": {
            "PK": {
                "S": "X"
            },
            "SK": {
                "S": "Y"
            }
        },
        "UpdateExpression": "SET #foo = if_not_exists(#foo, :foo), #bar = :bar, #baz = list_append(#baz, :baz), #foo.#bar.#baz[0] = #foo.#bar.#baz[0] - :one",
        "ConditionExpression": "(#foo.#bar.#baz[0] = :SK) AND ((#foo = :foo) OR ((#bar = :bar) AND (contains(#foo.#bar.#baz[0], :baz))))",
        "ExpressionAttributeNames": {
            "#PK": "PK",
            "#SK": "SK",
            "#foo": "foo",
            "#bar": "bar",
            "#baz": "baz"
        },
        "ExpressionAttributeValues": {
            ":PK": {
                "S": "X"
            },
            ":SK": {
                "S": "Y"
            },
            ":foo": {
                "S": "foo"
            },
            ":bar": {
                "S": "bar"
            },
            ":baz": {
                "S": "baz"
            },
            ":one": {
                "N": "1"
            }
        }
    }

```

## Contributing
Open an [issue](https://github.com/josher8a/Brushless/issues) or a PR. We are open to any kind of contribution and feedback.