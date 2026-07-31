open Types

@genType
type pkCond = {
  name: AttributeName.t,
  value: AttributeValue.t,
}

@genType
type limits = {lower: AttributeValue.t, upper: AttributeValue.t}

@genType
type skCondition =
  | Comparison({name: AttributeName.t, comparator: comparator, value: AttributeValue.t})
  | Between({name: AttributeName.t, limits: limits})
  | BeginsWith({name: AttributeName.t, value: AttributeValue.t})
  | @as(undefined) @deprecated("Omit the `sk` field instead") Any

@genType
type keyCondition = {
  pk: pkCond,
  sk?: skCondition,
}

@genType
let equals = (name, value) => Comparison({name, comparator: Equals, value})
@genType
let notEquals = (name, value) => Comparison({name, comparator: NotEquals, value})
@genType
let lessThan = (name, value) => Comparison({name, comparator: LessThan, value})
@genType
let lessThanOrEqualTo = (name, value) => Comparison({name, comparator: LessThanOrEqual, value})
@genType
let greaterThan = (name, value) => Comparison({name, comparator: GreaterThan, value})
@genType
let greaterThanOrEqualTo = (name, value) => Comparison({
  name,
  comparator: GreaterThanOrEqual,
  value,
})
@genType
let between = (name, limits) => Between({name, limits})
@genType
let beginsWith = (name, value) => BeginsWith({name, value})
@genType @deprecated("Omit the `sk` field instead")
let any = Any

%%private(
  let skConditionToString = (skCondition: option<skCondition>, register) =>
    switch skCondition {
    | None | Some(Any) => ""
    | Some(Comparison({name, comparator, value})) =>
      ` AND ${AttributeName.toString(Register.addName(register, name))} ${comparatorToString(
          comparator,
        )} ${AttributeValue.toString(Register.addValue(register, value))}`
    | Some(Between({name, limits})) =>
      ` AND ${AttributeName.toString(
          Register.addName(register, name),
        )} BETWEEN ${AttributeValue.toString(
          Register.addValue(register, limits.lower),
        )} AND ${AttributeValue.toString(Register.addValue(register, limits.upper))}`
    | Some(BeginsWith({name, value})) =>
      ` AND begins_with(${AttributeName.toString(
          Register.addName(register, name),
        )}, ${AttributeValue.toString(Register.addValue(register, value))})`
    }
)

@genType
let build = (keyCondition: keyCondition, register) =>
  `${AttributeName.toString(
      Register.addName(register, keyCondition.pk.name),
    )} = ${AttributeValue.toString(Register.addValue(register, keyCondition.pk.value))}` ++
  skConditionToString(keyCondition.sk, register)
