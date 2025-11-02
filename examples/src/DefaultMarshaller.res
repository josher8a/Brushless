@genType.import(("aws-sdk/clients/dynamodb", "AttributeValue"))
type attributeValue = Brushless.attributeValue_

// TODO: Move to external binding
@genType.import(("@aws/dynamodb-auto-marshaller", "Marshaller"))
type t
%%private(
  @new @module("@aws/dynamodb-auto-marshaller")
  external init: unit => t = "Marshaller"
  @send @genType
  external marshallValue: (t, 'a) => attributeValue = "marshallValue"
)
let marshallValue = x => marshallValue(init(), x)
