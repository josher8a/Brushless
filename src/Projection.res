@genType
type projection = array<Identifier.t>

@genType
let build = (projection: projection, register) =>
  projection->Array.map(Identifier.toString(_, register))->Array.join(", ")
