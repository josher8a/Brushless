// type val = string
// type t = option<val>
// exception ReturnNone

// let orReturn = (x: option<'a>): 'a => {
//   switch x {
//   | Some(x) => x
//   | None => raise(ReturnNone)
//   }
// }
// let handle = (rutine: unit => t): t => {
//   try {
//     rutine()
//   } catch {
//   | ReturnNone => None
//   | _ as toRethrow => raise(Obj.magic(toRethrow))
//   }
// }

// let x = Ok(1)

// let may_fail = (): option<int> => {Some(4)}

// let compose_may_fail = (): option<string> => {
//   handle(() => {
//     let x = may_fail()->orReturn
//     let y = may_fail()->orReturn
//     Some((x + y)->string_of_int)
//   })
// }

// ==== Result version ====

// type t = result<string, exn>
// exception ReturnError(exn)

// let orReturn = (x: result<'a, 'b>): 'a =>
//   switch x {
//   | Ok(x) => x
//   | Error(x) => raise(ReturnError(x))
//   }

// let handle = (rutine: unit => t): t =>
//   try {
//     rutine()
//   } catch {
//   | ReturnError(e) => Error(e)
//   | Exn.Error(toRethrow) => raise(Obj.magic(toRethrow))
//   | _ as toRethrow => raise(Obj.magic(toRethrow))
//   }

module type HandlerType = {
  type e
  type r
  type t = result<r, e>

  exception ReturnError(e)

  let orReturn: result<'a, e> => 'a

  let handle: (unit => t) => t
}

module Handler: HandlerType = {
  type e
  type r
  type t = result<r, e>

  exception ReturnError(e)

  let orReturn = (x: result<'a, e>): 'a =>
    switch x {
    | Ok(x) => x
    | Error(x) => raise(ReturnError(x))
    }

  let handle = (rutine: unit => t): t =>
    try {
      rutine()
    } catch {
    | ReturnError(e) => Error(e)
    | Exn.Error(toRethrow) => raise(Obj.magic(toRethrow))
    | _ as toRethrow => raise(Obj.magic(toRethrow))
    }
}

let may_fail = (): result<int, exn> => {Ok(4)}

let compose_may_fail = (): result<string, exn> => {
  let {orReturn, handle} = module(Handler: (HandlerType with type r := string)
  handle(() => {
    let x = may_fail()->orReturn
    let y = may_fail()->orReturn
    Ok((x + y)->string_of_int)
  })
}
