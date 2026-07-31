@genType.import(("./external", "AtLeastOne"))
type atLeastOne<'a> = 'a

@genType
type rec attributeValue_ = {
  @as("S") s?: string,
  @as("N") n?: string,
  @as("B") b?: Uint8Array.t,
  @as("SS") ss?: array<string>,
  @as("NS") ns?: array<string>,
  @as("BS") bs?: array<Uint8Array.t>,
  @as("M") m?: dict<atLeastOne<attributeValue_>>,
  @as("L") l?: array<atLeastOne<attributeValue_>>,
  @as("NULL") null?: bool,
  @as("BOOL") bool?: bool,
  @as("$unknown") unknown?: (string, unknown),
}

@genType
type attributeValue = atLeastOne<attributeValue_>

@genType
type comparator =
  | @as("=") Equals
  | @as("<>") NotEquals
  | @as("<") LessThan
  | @as("<=") LessThanOrEqual
  | @as(">") GreaterThan
  | @as(">=") GreaterThanOrEqual

external comparatorToString: comparator => string = "%identity"
