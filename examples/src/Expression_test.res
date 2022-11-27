open Dynamo
// test splitWhen
Js.log("hello world"->splitWhen(char => char == " "))

let register = Register.make()

// example: info.rating[0].plot[1][1]
open AttributePath
let info = AttributeName({name: "info"})
let rating = AttributeName({name: "rating"})
let plot = AttributeName({name: "plot"})

let examplePath: AttributePath.t = AttributePath({
  name: "info",
  subpath: [rating, ListIndex({index: 0}), plot, ListIndex({index: 1}), ListIndex({index: 1})],
})

Js.log(AttributePath.toString(AttributePath.fromString("info.rating[0].plot[1][1]")))
Js.log(AttributePath.toString(examplePath))
open Marshaller
open Condition
let year = AttributePath({name: "year", subpath: [ListIndex({index: 0})]})
let title = AttributeName({name: "title"})
let yearValue = AttributeValue({
  value: DefaultMarshaller.marshallValue(1992),
  alias: "year",
})
let titleValue = AttributeValue({
  value: DefaultMarshaller.marshallValue("The Last of the Mohicans"),
  alias: "title",
})
let file = AttributeName({name: "file"})
let minFileSize = AttributeValue({
  value: DefaultMarshaller.marshallValue(0),
  alias: "minFileSize",
})

open Condition.Overload
let exampleConditionExpression: Condition.condition =
  year === yearValue && title !== titleValue && Size({operand: file}) > minFileSize

Js.log(Condition.build(exampleConditionExpression, register))

let exampleProjectionExpression: Projection.projection = [
  AttributeName({name: "year"}),
  AttributeName({name: "title"}),
  AttributeName({name: "info"}),
]

Js.log(Projection.build(exampleProjectionExpression, register))

let exampleKeyConditionExpression: KeyCondition.keyCondition = {
  pk: {
    name: AttributeName({name: "year"}),
    value: AttributeValue({
      value: DefaultMarshaller.marshallValue(1992),
      alias: "year",
    }),
  },
  sk: Comparison({
    name: AttributeName({name: "title"}),
    comparator: Equals,
    value: AttributeValue({
      value: DefaultMarshaller.marshallValue("The Last of the Mohicans"),
      alias: "title",
    }),
  }),
}

Js.log(KeyCondition.build(exampleKeyConditionExpression, register))

let exampleUpdateExpression: Update.update = {
  set: [
    (
      AttributeName({name: "rating"}),
      AttributeValue({value: DefaultMarshaller.marshallValue(5), alias: "rating"}),
    ),
    (
      AttributeName({name: "plot"}),
      IfNotExists({
        identifier: AttributeName({name: "plot"}),
        operand: AttributeValue({value: DefaultMarshaller.marshallValue("test"), alias: "plot"}),
      }),
    ),
  ],
  remove: [AttributeName({name: "actors"})],
  add: [
    (
      AttributeName({name: "actors"}),
      AttributeValue({
        value: DefaultMarshaller.marshallValue(["Daniel Day-Lewis", "Madeleine Stowe"]),
        alias: "actors",
      }),
    ),
  ],
}

Js.log(Update.build(exampleUpdateExpression, register))

Js.log(register.names)

Js.log(register.values)
