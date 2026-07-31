let throwError = message => JsError.throw(JsError.make(message))

@send external reduce: (array<'b>, ('a, 'b) => 'a, 'a) => 'a = "reduce"
