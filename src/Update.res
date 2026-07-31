@genType
type rec operand =
  | ...AttributePath.t
  | ...AttributeName.t
  | ...AttributeValue.t
  | ListAppend({identifier: operand, operand: operand})
  | IfNotExists({identifier: operand, operand: operand})
  | Sum({lhs: operand, rhs: operand})
  | Sub({lhs: operand, rhs: operand})

@genType
let listAppend = (identifier, operand) => ListAppend({identifier, operand})
@genType
let ifNotExists = (identifier, operand) => IfNotExists({identifier, operand})
@genType
let sum = (lhs, rhs) => Sum({lhs, rhs})
@genType
let sub = (lhs, rhs) => Sub({lhs, rhs})

@genType
type rec update = {
  set?: array<(Identifier.t, operand)>,
  remove?: array<Identifier.t>,
  add?: array<(Identifier.t, AttributeValue.t)>,
  delete?: array<(Identifier.t, AttributeValue.t)>,
}

%%private(
  let rec operandToString = (operand: operand, register) =>
    switch operand {
    | AttributePath({name, subpath}) =>
      AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
    | AttributeName({name}) =>
      AttributeName.toString(Register.addName(register, AttributeName({name: name})))
    | AttributeValue({value, alias}) =>
      AttributeValue.toString(Register.addValue(register, AttributeValue({value, alias})))
    | ListAppend({identifier, operand}) =>
      `list_append(${operandToString(identifier, register)}, ${operandToString(
          operand,
          register,
        )})`
    | IfNotExists({identifier, operand}) =>
      `if_not_exists(${operandToString(identifier, register)}, ${operandToString(
          operand,
          register,
        )})`
    | Sum({lhs, rhs}) => `${operandToString(lhs, register)} + ${operandToString(rhs, register)}`
    | Sub({lhs, rhs}) => `${operandToString(lhs, register)} - ${operandToString(rhs, register)}`
    }
  let appendIfNotEmpty = (acc, arr, tag, fn) => {
    open Array
    switch arr {
    | Some(x) if x->length > 0 => acc ++ tag ++ " " ++ x->map(fn)->join(", ") ++ " "
    | _ => acc
    }
  }
)

@genType
let build = (update: update, register) => {
  open Identifier
  ""
  ->appendIfNotEmpty(update.add, "ADD", ((id, value)) =>
    toString(id, register) ++ " " ++ AttributeValue.toString(Register.addValue(register, value))
  )
  ->appendIfNotEmpty(update.delete, "DELETE", ((id, value)) =>
    toString(id, register) ++ " " ++ AttributeValue.toString(Register.addValue(register, value))
  )
  ->appendIfNotEmpty(update.set, "SET", ((id, operand)) =>
    `${toString(id, register)} = ${operandToString(operand, register)}`
  )
  ->appendIfNotEmpty(update.remove, "REMOVE", toString(_, register))
  ->String.trim
}
