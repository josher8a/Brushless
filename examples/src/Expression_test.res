open Brushless
open DefaultMarshaller
open AttributePath
open AttributeValue

// test splitWhen
// Js.log("hello world"->splitWhen(char => char == " "))

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

Console.log(AttributePath.toString(AttributePath.fromString("info.rating[0].plot[1][1]")))
Console.log(AttributePath.toString(examplePath))
open Condition
let year = AttributePath({name: "year", subpath: [ListIndex({index: 0})]})
let title = AttributeName({name: "title"})
let yearValue = AttributeValue({
  value: marshallValue(1992),
  alias: "year",
})
let titleValue = AttributeValue({
  value: marshallValue("The Last of the Mohicans"),
  alias: "title",
})
let file = AttributeName({name: "file"})
let minFileSize = AttributeValue({
  value: marshallValue(0),
  alias: "minFileSize",
})

let exampleConditionExpression: Condition.condition = {
  open Condition.Overload
  year == yearValue && title != titleValue && Size({operand: file}) > minFileSize
}
Console.log(Condition.build(exampleConditionExpression, register))

let exampleProjectionExpression: Projection.projection = [
  AttributeName({name: "year"}),
  AttributeName({name: "title"}),
  AttributeName({name: "info"}),
]

Console.log(Projection.build(exampleProjectionExpression, register))

let exampleKeyConditionExpression: KeyCondition.keyCondition = {
  pk: {
    name: AttributeName({name: "year"}),
    value: AttributeValue({
      value: marshallValue(1992),
      alias: "year",
    }),
  },
  sk: Comparison({
    name: AttributeName({name: "title"}),
    comparator: Equals,
    value: AttributeValue({
      value: marshallValue("The Last of the Mohicans"),
      alias: "title",
    }),
  }),
}

Console.log(KeyCondition.build(exampleKeyConditionExpression, register))

let exampleUpdateExpression: Update.update = {
  set: [
    (AttributeName({name: "rating"}), AttributeValue({value: marshallValue(5), alias: "rating"})),
    (
      AttributeName({name: "plot"}),
      IfNotExists({
        identifier: AttributeName({name: "plot"}),
        operand: AttributeValue({value: marshallValue("test"), alias: "plot"}),
      }),
    ),
  ],
  remove: [AttributeName({name: "actors"})],
  add: [
    (
      AttributeName({name: "actors"}),
      AttributeValue({
        value: marshallValue(["Daniel Day-Lewis", "Madeleine Stowe"]),
        alias: "actors",
      }),
    ),
  ],
}

Console.log(Update.build(exampleUpdateExpression, register))

Console.log(register.names)

Console.log(register.values)
