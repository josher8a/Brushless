// TODO: Move to external binding
@genType
module DefaultMarshaller = {
  @genType.import(("@aws/dynamodb-auto-marshaller", "Marshaller"))
  type t
  %%private(
    @new @module("@aws/dynamodb-auto-marshaller") external init: unit => t = "Marshaller"
    @send @genType
    external marshallValue: (t, 'a) => Dynamo.attributeValue = "marshallValue"
  )
  let marshaller = init()
  let marshallValue = x => marshallValue(marshaller, x)
}
