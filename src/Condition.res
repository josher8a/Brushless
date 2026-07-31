open Types

@genType
type rec operand =
  | ...AttributePath.t
  | ...AttributeName.t
  | ...AttributeValue.t
  | Size({operand: operand}) // is a function but it is the only one that returns a number

@genType
type limits = {lower: operand, upper: operand}

@genType
type rec condition =
  | Comparison({lhs: operand, comparator: comparator, rhs: operand})
  | Between({operand: operand, limits: limits})
  | In({operand: operand, list: array<operand>})
  | And({lhs: condition, rhs: condition})
  | Or({lhs: condition, rhs: condition})
  | Not({condition: condition})
  //   | Function(function)
  // and function =
  | AttributeExists({identifier: Identifier.t})
  | AttributeNotExists({identifier: Identifier.t})
  | AttributeType({identifier: Identifier.t, operand: operand})
  | BeginsWith({identifier: Identifier.t, operand: operand})
  | Contains({identifier: Identifier.t, operand: operand})
  // alias for contains where the order of the arguments is reversed
  | ToContains({identifier: Identifier.t, operand: operand})

@genType
let equals = (lhs, rhs) => Comparison({lhs, comparator: Equals, rhs})
@genType
let notEquals = (lhs, rhs) => Comparison({lhs, comparator: NotEquals, rhs})
@genType
let lessThan = (lhs, rhs) => Comparison({lhs, comparator: LessThan, rhs})
@genType
let lessThanOrEqualTo = (lhs, rhs) => Comparison({lhs, comparator: LessThanOrEqual, rhs})
@genType
let greaterThan = (lhs, rhs) => Comparison({lhs, comparator: GreaterThan, rhs})
@genType
let greaterThanOrEqualTo = (lhs, rhs) => Comparison({
  lhs,
  comparator: GreaterThanOrEqual,
  rhs,
})
@genType
let between = (operand, limits) => Between({operand, limits})
@genType
let inList = (operand, list) => In({operand, list})
@genType
let attributeExists = identifier => AttributeExists({identifier: identifier})
@genType
let attributeNotExists = identifier => AttributeNotExists({identifier: identifier})
@genType
let attributeType = (identifier, operand) => AttributeType({identifier, operand})
@genType
let beginsWith = (identifier, operand) => BeginsWith({identifier, operand})
@genType
let contains = (identifier, operand) => Contains({identifier, operand})
@genType
let toContains = (identifier, operand) => ToContains({identifier, operand})
@genType
let \"and" = (lhs, rhs) => And({lhs, rhs})
@genType
let or = (lhs, rhs) => Or({lhs, rhs})
@genType
let not = condition => Not({condition: condition})
@genType
let size = operand => Size({operand: operand})

module Overload = {
  @genType.opaque
  let \"&&" = \"and"
  @genType.opaque
  let \"||" = or
  @genType.opaque
  let \"!" = not
  @genType.opaque
  let \"==" = equals
  @genType.opaque
  let \"!=" = notEquals
  @genType.opaque
  let \"<" = lessThan
  @genType.opaque
  let \"<=" = lessThanOrEqualTo
  @genType.opaque
  let \">" = greaterThan
  @genType.opaque
  let \">=" = greaterThanOrEqualTo
}

@genType
let build = (condition, register) => {
  let rec toString = condition =>
    switch condition {
    | Comparison({lhs, comparator, rhs}) =>
      `${opString(lhs)} ${comparatorToString(comparator)} ${opString(rhs)}`
    | Between({operand, limits}) =>
      `${opString(operand)} BETWEEN ${opString(limits.lower)} AND ${opString(limits.upper)}`
    | In({operand, list}) =>
      `${opString(operand)} IN (${list->Array.map(opString)->Array.join(", ")})`
    | And({lhs, rhs}) => `(${toString(lhs)}) AND (${toString(rhs)})`
    | Or({lhs, rhs}) => `(${toString(lhs)}) OR (${toString(rhs)})`
    | Not({condition}) => `NOT (${toString(condition)})`
    | AttributeExists({identifier}) =>
      `attribute_exists(${Identifier.toString(identifier, register)})`
    | AttributeNotExists({identifier}) =>
      `attribute_not_exists(${Identifier.toString(identifier, register)})`
    | AttributeType({identifier, operand}) =>
      `attribute_type(${Identifier.toString(identifier, register)}, ${opString(operand)})`
    | BeginsWith({identifier, operand}) =>
      `begins_with(${Identifier.toString(identifier, register)}, ${opString(operand)})`
    | Contains({identifier, operand}) =>
      `contains(${Identifier.toString(identifier, register)}, ${opString(operand)})`
    | ToContains({identifier, operand}) =>
      `contains(${opString(operand)}, ${Identifier.toString(identifier, register)})`
    }
  and opString = operand =>
    switch operand {
    | AttributePath({name, subpath}) =>
      AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
    | AttributeName({name}) =>
      AttributeName.toString(Register.addName(register, AttributeName({name: name})))
    | AttributeValue({value, alias}) =>
      AttributeValue.toString(Register.addValue(register, AttributeValue({value, alias})))
    | Size({operand}) => `size(${opString(operand)})`
    }

  toString(condition)
}
