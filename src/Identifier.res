@genType
type rec t =
  | ...AttributePath.t
  | ...AttributeName.t

@genType
let toString = (identifier: t, register) =>
  switch identifier {
  | AttributePath({name, subpath}) =>
    AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
  | AttributeName({name}) =>
    AttributeName.toString(Register.addName(register, AttributeName({name: name})))
  }
