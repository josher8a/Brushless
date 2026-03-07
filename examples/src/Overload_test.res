open Brushless
open DefaultMarshaller
open Condition.Overload

// Helpers — return Condition.operand so overloaded operators work
let name = (n): Condition.operand => AttributeName({name: n})
let path = (s): Condition.operand => {
  let AttributePath.AttributePath({name, subpath}) = AttributePath.fromString(s)
  AttributePath({name, subpath})
}
let val = (v, alias): Condition.operand => AttributeValue({value: marshallValue(v), alias})

let assert_eq = (label, a, b) =>
  if a !== b {
    Console.error(`FAIL [${label}]: expected "${b}", got "${a}"`)
    JsError.throw(JsError.make(`Assertion failed: ${label}`))
  } else {
    Console.log(`PASS [${label}]`)
  }

// == (equals)
let () = {
  let register = Register.make()
  let expr = name("year") == val(2024, "year")
  let result = Condition.build(expr, register)
  assert_eq("==", result, "#year = :year")
}

// != (notEquals)
let () = {
  let register = Register.make()
  let expr = name("status") != val("deleted", "status")
  let result = Condition.build(expr, register)
  assert_eq("!=", result, "#status <> :status")
}

// < (lessThan)
let () = {
  let register = Register.make()
  let expr = name("age") < val(18, "age")
  let result = Condition.build(expr, register)
  assert_eq("<", result, "#age < :age")
}

// <= (lessThanOrEqualTo)
let () = {
  let register = Register.make()
  let expr = name("age") <= val(65, "age")
  let result = Condition.build(expr, register)
  assert_eq("<=", result, "#age <= :age")
}

// > (greaterThan)
let () = {
  let register = Register.make()
  let expr = name("score") > val(100, "score")
  let result = Condition.build(expr, register)
  assert_eq(">", result, "#score > :score")
}

// >= (greaterThanOrEqualTo)
let () = {
  let register = Register.make()
  let expr = name("score") >= val(0, "score")
  let result = Condition.build(expr, register)
  assert_eq(">=", result, "#score >= :score")
}

// && (and)
let () = {
  let register = Register.make()
  let expr = name("a") == val(1, "a") && name("b") == val(2, "b")
  let result = Condition.build(expr, register)
  assert_eq("&&", result, "(#a = :a) AND (#b = :b)")
}

// || (or)
let () = {
  let register = Register.make()
  let expr = name("a") == val(1, "a") || name("b") == val(2, "b")
  let result = Condition.build(expr, register)
  assert_eq("||", result, "(#a = :a) OR (#b = :b)")
}

// \"!" (not — prefix `!` syntax is always bool negation, use escaped identifier)
let () = {
  let register = Register.make()
  let expr = \"!"(name("deleted") == val(true, "deleted"))
  let result = Condition.build(expr, register)
  assert_eq("!", result, "NOT (#deleted = :deleted)")
}

// Combined: (a == x && b != y) || !(c < z)
let () = {
  let register = Register.make()
  let expr =
    (name("a") == val(1, "a") && name("b") != val(2, "b")) || \"!"(name("c") < val(3, "c"))
  let result = Condition.build(expr, register)
  assert_eq("combined", result, "((#a = :a) AND (#b <> :b)) OR (NOT (#c < :c))")
}

// Size with operator
let () = {
  let register = Register.make()
  let expr = Size({operand: name("items")}) > val(0, "zero")
  let result = Condition.build(expr, register)
  assert_eq("size >", result, "size(#items) > :zero")
}

// Operators with AttributePath
let () = {
  let register = Register.make()
  let expr = path("info.rating[0]") >= val(4, "minRating")
  let result = Condition.build(expr, register)
  assert_eq("path >=", result, "#info.#rating[0] >= :minRating")
}

Console.log("All overload tests passed!")
