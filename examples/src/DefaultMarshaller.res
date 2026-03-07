@genType.import(("@aws-sdk/client-dynamodb", "AttributeValue"))
type attributeValue = Brushless.attributeValue_

@module("@aws-sdk/util-dynamodb") external marshallValue: 'a => attributeValue = "convertToAttr"
