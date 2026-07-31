// TODO: Move to external binding
// @genType
// module DefaultMarshaller = {
//   @genType.import(("@aws/dynamodb-auto-marshaller", "Marshaller"))
//   type t
//   %%private(
//     @new @module("@aws/dynamodb-auto-marshaller") external init: unit => t = "Marshaller"
//     @send @genType
//     external marshallValue: (t, 'a) => attributeValue = "marshallValue"
//   )
//   let marshaller = init()
//   let marshallValue = x => marshallValue(marshaller, x)
// }

@genType
type t = AttributeValue({value: Types.attributeValue, alias: string})

@genType
type from<'a> = {
  value: 'a,
  alias: string,
}

@genType
let make = x => AttributeValue({
  value: x.value, // DefaultMarshaller.marshallValue(x.value),
  alias: x.alias,
})

@genType
let toString = (AttributeValue({alias, _})) => ":" ++ alias
