@genType.import(("@aws-sdk/client-dynamodb", "AttributeValue"))
type attributeValue = Brushless.Types.attributeValue_

@module("@aws-sdk/util-dynamodb") external marshallValue: 'a => attributeValue = "convertToAttr"
