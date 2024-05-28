// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';


function getOr(value, $$default) {
  if (value === undefined) {
    return $$default;
  } else {
    return value;
  }
}

function equal(a, b, eq) {
  if (a === undefined) {
    if (b === undefined) {
      return true;
    } else {
      return false;
    }
  } else if (b === undefined) {
    return false;
  } else {
    return eq(a, b);
  }
}

var Undefinable = {
  getOr: getOr,
  equal: equal
};

function make(name) {
  return {
          TAG: "AttributeName",
          name: name
        };
}

function toString(name) {
  var name$1 = name.name;
  if (name$1.includes(" ") || name$1.includes(".")) {
    throw new Error("InvalidName");
  }
  return "#" + name$1.replaceAll("-", "_");
}

var Name = {
  make: make,
  toString: toString
};

function make$1(x) {
  return {
          TAG: "AttributeValue",
          value: x.value,
          alias: x.alias
        };
}

function toString$1(param) {
  return ":" + param.alias;
}

var Value = {
  make: make$1,
  toString: toString$1
};

function fromString(str) {
  var str$1 = str.trim();
  var start = 0;
  var state = 4;
  var path = [];
  var pullPush = function (start, end, isIndex) {
    var word = str$1.slice(start, end);
    if (isIndex === true) {
      var x = parseInt(word);
      var tmp;
      if (!isNaN(x) && x >= 0) {
        tmp = x;
      } else {
        throw new Error("InvalidIndex: " + word);
      }
      path.push({
            TAG: "ListIndex",
            index: tmp
          });
      return ;
    }
    var name = word.trim().replaceAll("-", "_");
    if (name.length === 0 || name.includes(" ") || name.includes(".")) {
      throw new Error("InvalidPath");
    }
    path.push({
          TAG: "AttributeName",
          name: name
        });
  };
  var max_i = str$1.length - 1 | 0;
  if (max_i < 0) {
    throw new Error("InvalidPath");
  }
  for(var i = 0; i <= max_i; ++i){
    var $$char = str$1[i];
    var match = state;
    var exit = 0;
    switch ($$char) {
      case "." :
          switch (match) {
            case 1 :
                state = 0;
                break;
            case 4 :
                pullPush(start, i, undefined);
                state = 0;
                break;
            default:
              exit = 1;
          }
          break;
      case "[" :
          switch (match) {
            case 1 :
                state = 2;
                break;
            case 4 :
                pullPush(start, i, undefined);
                state = 2;
                break;
            default:
              exit = 1;
          }
          break;
      case "]" :
          if (match === 3) {
            pullPush(start, i, true);
            state = 1;
          } else {
            throw new Error("InvalidPath");
          }
          break;
      default:
        exit = 1;
    }
    if (exit === 1) {
      switch (match) {
        case 0 :
            start = i;
            state = 4;
            break;
        case 1 :
            if ($$char.trim().length !== 0) {
              throw new Error("InvalidPath");
            }
            break;
        case 2 :
            start = i;
            state = 3;
            break;
        case 3 :
        case 4 :
            break;
        
      }
    }
    
  }
  if (state === 0 || state === 2 || state === 3) {
    throw new Error("InvalidPath");
  }
  if (state === 4) {
    pullPush(start, undefined, undefined);
  }
  var match$1 = path.shift();
  if (match$1 !== undefined) {
    if (match$1.TAG === "AttributeName") {
      return {
              TAG: "AttributePath",
              name: match$1.name,
              subpath: path
            };
    }
    throw new Error("InvalidPath");
  }
  throw new Error("InvalidPath");
}

function toString$2(param) {
  return param.subpath.reduce((function (acc, subs) {
                if (subs.TAG === "AttributeName") {
                  return acc + "." + toString({
                              TAG: "AttributeName",
                              name: subs.name
                            });
                } else {
                  return acc + "[" + String(subs.index) + "]";
                }
              }), toString({
                  TAG: "AttributeName",
                  name: param.name
                }));
}

var Path = {
  fromString: fromString,
  toString: toString$2
};

var Attribute = {
  Name: Name,
  Value: Value,
  Path: Path
};

function make$2() {
  return {
          names: undefined,
          values: undefined
        };
}

function isValueEqual(a, b) {
  return [
            equal(a.S, b.S, (function (x, y) {
                    return x === y;
                  })),
            equal(a.N, b.N, (function (x, y) {
                    return x === y;
                  })),
            equal(a.NULL, b.NULL, (function (x, y) {
                    return x === y;
                  })),
            equal(a.BOOL, b.BOOL, (function (x, y) {
                    return x === y;
                  })),
            equal(a.SS, b.SS, (function (x, y) {
                    return x.every(function (v) {
                                return y.includes(v);
                              });
                  })),
            equal(a.NS, b.NS, (function (x, y) {
                    return x.every(function (v) {
                                return y.includes(v);
                              });
                  })),
            equal(a.L, b.L, (function (x, y) {
                    return x.every(function (v, i) {
                                var y$1 = y[i];
                                if (y$1 !== undefined) {
                                  return isValueEqual(v, y$1);
                                } else {
                                  return false;
                                }
                              });
                  })),
            equal(a.M, b.M, (function (x, y) {
                    var keys = Object.entries(x);
                    if (keys.length === Object.keys(y).length) {
                      return keys.every(function (param) {
                                  var y$1 = y[param[0]];
                                  if (y$1 !== undefined) {
                                    return isValueEqual(param[1], y$1);
                                  } else {
                                    return false;
                                  }
                                });
                    } else {
                      return false;
                    }
                  }))
          ].some(function (x) {
              return x;
            });
}

function addValue(register, _element) {
  while(true) {
    var element = _element;
    var alias = element.alias;
    var value = element.value;
    var key = toString$1({
          TAG: "AttributeValue",
          value: value,
          alias: alias
        });
    var dict = getOr(register.values, {});
    var exist = dict[key];
    if (exist !== undefined && exist !== value && !isValueEqual(exist, value)) {
      _element = {
        TAG: "AttributeValue",
        value: value,
        alias: alias + "_"
      };
      continue ;
    }
    dict[key] = value;
    register.values = dict;
    return element;
  };
}

function addName(register, element) {
  var name = element.name;
  var dict = getOr(register.names, {});
  dict[toString({
            TAG: "AttributeName",
            name: name
          })] = name;
  register.names = dict;
  return element;
}

function addPath(register, element) {
  var name = element.name;
  var dict = getOr(register.names, {});
  dict[toString({
            TAG: "AttributeName",
            name: name
          })] = name;
  element.subpath.forEach(function (sub) {
        if (sub.TAG !== "AttributeName") {
          return ;
        }
        var name = sub.name;
        dict[toString({
                  TAG: "AttributeName",
                  name: name
                })] = name;
      });
  register.names = dict;
  return element;
}

var Register = {
  make: make$2,
  addValue: addValue,
  addName: addName,
  addPath: addPath
};

function toString$3(identifier, register) {
  if (identifier.TAG === "AttributePath") {
    return toString$2(addPath(register, {
                    TAG: "AttributePath",
                    name: identifier.name,
                    subpath: identifier.subpath
                  }));
  } else {
    return toString(addName(register, {
                    TAG: "AttributeName",
                    name: identifier.name
                  }));
  }
}

var Identifier = {
  toString: toString$3
};

function equals(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: "=",
          rhs: rhs
        };
}

function notEquals(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: "<>",
          rhs: rhs
        };
}

function lessThan(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: "<",
          rhs: rhs
        };
}

function lessThanOrEqualTo(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: "<=",
          rhs: rhs
        };
}

function greaterThan(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: ">",
          rhs: rhs
        };
}

function greaterThanOrEqualTo(lhs, rhs) {
  return {
          TAG: "Comparison",
          lhs: lhs,
          comparator: ">=",
          rhs: rhs
        };
}

function between(operand, limits) {
  return {
          TAG: "Between",
          operand: operand,
          limits: limits
        };
}

function inList(operand, list) {
  return {
          TAG: "In",
          operand: operand,
          list: list
        };
}

function attributeExists(identifier) {
  return {
          TAG: "AttributeExists",
          identifier: identifier
        };
}

function attributeNotExists(identifier) {
  return {
          TAG: "AttributeNotExists",
          identifier: identifier
        };
}

function attributeType(identifier, operand) {
  return {
          TAG: "AttributeType",
          identifier: identifier,
          operand: operand
        };
}

function beginsWith(identifier, operand) {
  return {
          TAG: "BeginsWith",
          identifier: identifier,
          operand: operand
        };
}

function contains(identifier, operand) {
  return {
          TAG: "Contains",
          identifier: identifier,
          operand: operand
        };
}

function and(lhs, rhs) {
  return {
          TAG: "And",
          lhs: lhs,
          rhs: rhs
        };
}

function or(lhs, rhs) {
  return {
          TAG: "Or",
          lhs: lhs,
          rhs: rhs
        };
}

function not(condition) {
  return {
          TAG: "Not",
          condition: condition
        };
}

function size(operand) {
  return {
          TAG: "Size",
          operand: operand
        };
}

var Maker = {
  equals: equals,
  notEquals: notEquals,
  lessThan: lessThan,
  lessThanOrEqualTo: lessThanOrEqualTo,
  greaterThan: greaterThan,
  greaterThanOrEqualTo: greaterThanOrEqualTo,
  between: between,
  inList: inList,
  attributeExists: attributeExists,
  attributeNotExists: attributeNotExists,
  attributeType: attributeType,
  beginsWith: beginsWith,
  contains: contains,
  and: and,
  or: or,
  not: not,
  size: size
};

var Overload = {
  $amp$amp: and,
  $pipe$pipe: or,
  not: not,
  $eq$eq: equals,
  $bang$eq: notEquals,
  $less: lessThan,
  $less$eq: lessThanOrEqualTo,
  $great: greaterThan,
  $great$eq: greaterThanOrEqualTo
};

function build(condition, register) {
  var toString$4 = function (condition) {
    switch (condition.TAG) {
      case "Comparison" :
          return opString(condition.lhs) + " " + condition.comparator + " " + opString(condition.rhs);
      case "Between" :
          var limits = condition.limits;
          return opString(condition.operand) + " BETWEEN " + opString(limits.lower) + " AND " + opString(limits.upper);
      case "In" :
          return opString(condition.operand) + " IN (" + condition.list.map(opString).join(", ") + ")";
      case "And" :
          return "(" + toString$4(condition.lhs) + ") AND (" + toString$4(condition.rhs) + ")";
      case "Or" :
          return "(" + toString$4(condition.lhs) + ") OR (" + toString$4(condition.rhs) + ")";
      case "Not" :
          return "NOT (" + toString$4(condition.condition) + ")";
      case "AttributeExists" :
          return "attribute_exists(" + toString$3(condition.identifier, register) + ")";
      case "AttributeNotExists" :
          return "attribute_not_exists(" + toString$3(condition.identifier, register) + ")";
      case "AttributeType" :
          return "attribute_type(" + toString$3(condition.identifier, register) + ", " + opString(condition.operand) + ")";
      case "BeginsWith" :
          return "begins_with(" + toString$3(condition.identifier, register) + ", " + opString(condition.operand) + ")";
      case "Contains" :
          return "contains(" + toString$3(condition.identifier, register) + ", " + opString(condition.operand) + ")";
      
    }
  };
  var opString = function (operand) {
    switch (operand.TAG) {
      case "AttributeName" :
          return toString(addName(register, {
                          TAG: "AttributeName",
                          name: operand.name
                        }));
      case "AttributeValue" :
          return toString$1(addValue(register, {
                          TAG: "AttributeValue",
                          value: operand.value,
                          alias: operand.alias
                        }));
      case "AttributePath" :
          return toString$2(addPath(register, {
                          TAG: "AttributePath",
                          name: operand.name,
                          subpath: operand.subpath
                        }));
      case "Size" :
          return "size(" + opString(operand.operand) + ")";
      
    }
  };
  return toString$4(condition);
}

var Condition = {
  Maker: Maker,
  equals: equals,
  notEquals: notEquals,
  lessThan: lessThan,
  lessThanOrEqualTo: lessThanOrEqualTo,
  greaterThan: greaterThan,
  greaterThanOrEqualTo: greaterThanOrEqualTo,
  between: between,
  inList: inList,
  attributeExists: attributeExists,
  attributeNotExists: attributeNotExists,
  attributeType: attributeType,
  beginsWith: beginsWith,
  contains: contains,
  and: and,
  or: or,
  not: not,
  size: size,
  Overload: Overload,
  build: build
};

function build$1(projection, register) {
  return projection.map(function (__x) {
                return toString$3(__x, register);
              }).join(", ");
}

var Projection = {
  build: build$1
};

function equals$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: "=",
          value: value
        };
}

function notEquals$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: "<>",
          value: value
        };
}

function lessThan$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: "<",
          value: value
        };
}

function lessThanOrEqualTo$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: "<=",
          value: value
        };
}

function greaterThan$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: ">",
          value: value
        };
}

function greaterThanOrEqualTo$1(name, value) {
  return {
          TAG: "Comparison",
          name: name,
          comparator: ">=",
          value: value
        };
}

function between$1(name, limits) {
  return {
          TAG: "Between",
          name: name,
          limits: limits
        };
}

function beginsWith$1(name, value) {
  return {
          TAG: "BeginsWith",
          name: name,
          value: value
        };
}

var Maker$1 = {
  equals: equals$1,
  notEquals: notEquals$1,
  lessThan: lessThan$1,
  lessThanOrEqualTo: lessThanOrEqualTo$1,
  greaterThan: greaterThan$1,
  greaterThanOrEqualTo: greaterThanOrEqualTo$1,
  between: between$1,
  beginsWith: beginsWith$1,
  any: "Any"
};

function skConditionToString(skCondition, register) {
  if (typeof skCondition !== "object") {
    return "";
  }
  switch (skCondition.TAG) {
    case "Comparison" :
        return " AND " + toString(addName(register, skCondition.name)) + " " + skCondition.comparator + " " + toString$1(addValue(register, skCondition.value));
    case "Between" :
        var limits = skCondition.limits;
        return " AND " + toString(addName(register, skCondition.name)) + " BETWEEN " + toString$1(limits.lower) + " AND " + toString$1(limits.upper);
    case "BeginsWith" :
        return " AND begins_with(" + toString(addName(register, skCondition.name)) + ", " + toString$1(addValue(register, skCondition.value)) + ")";
    
  }
}

function build$2(keyCondition, register) {
  return toString(addName(register, keyCondition.pk.name)) + " = " + toString$1(addValue(register, keyCondition.pk.value)) + skConditionToString(keyCondition.sk, register);
}

var KeyCondition = {
  Maker: Maker$1,
  equals: equals$1,
  notEquals: notEquals$1,
  lessThan: lessThan$1,
  lessThanOrEqualTo: lessThanOrEqualTo$1,
  greaterThan: greaterThan$1,
  greaterThanOrEqualTo: greaterThanOrEqualTo$1,
  between: between$1,
  beginsWith: beginsWith$1,
  any: "Any",
  build: build$2
};

function listAppend(identifier, operand) {
  return {
          TAG: "ListAppend",
          identifier: identifier,
          operand: operand
        };
}

function ifNotExists(identifier, operand) {
  return {
          TAG: "IfNotExists",
          identifier: identifier,
          operand: operand
        };
}

function sum(lhs, rhs) {
  return {
          TAG: "Sum",
          lhs: lhs,
          rhs: rhs
        };
}

function sub(lhs, rhs) {
  return {
          TAG: "Sub",
          lhs: lhs,
          rhs: rhs
        };
}

var Maker$2 = {
  listAppend: listAppend,
  ifNotExists: ifNotExists,
  sum: sum,
  sub: sub
};

function operandToString(operand, register) {
  switch (operand.TAG) {
    case "AttributeName" :
        return toString(addName(register, {
                        TAG: "AttributeName",
                        name: operand.name
                      }));
    case "AttributeValue" :
        return toString$1(addValue(register, {
                        TAG: "AttributeValue",
                        value: operand.value,
                        alias: operand.alias
                      }));
    case "AttributePath" :
        return toString$2(addPath(register, {
                        TAG: "AttributePath",
                        name: operand.name,
                        subpath: operand.subpath
                      }));
    case "ListAppend" :
        return "list_append(" + operandToString(operand.identifier, register) + ", " + operandToString(operand.operand, register) + ")";
    case "IfNotExists" :
        return "if_not_exists(" + operandToString(operand.identifier, register) + ", " + operandToString(operand.operand, register) + ")";
    case "Sum" :
        return operandToString(operand.lhs, register) + " + " + operandToString(operand.rhs, register);
    case "Sub" :
        return operandToString(operand.lhs, register) + " - " + operandToString(operand.rhs, register);
    
  }
}

function build$3(update, register) {
  var acc = [];
  var pushIfNotEmpty = function (arr, tag, fn) {
    if (arr !== undefined && arr.length > 0) {
      acc.push(tag);
      acc.push(arr.map(fn).join(", "));
      return ;
    }
    
  };
  pushIfNotEmpty(update.add, "ADD", (function (param) {
          return toString$3(param[0], register) + " " + toString$1(addValue(register, param[1]));
        }));
  pushIfNotEmpty(update.delete, "DELETE", (function (param) {
          return toString$3(param[0], register) + " " + toString$1(addValue(register, param[1]));
        }));
  pushIfNotEmpty(update.set, "SET", (function (param) {
          return toString$3(param[0], register) + " = " + operandToString(param[1], register);
        }));
  pushIfNotEmpty(update.remove, "REMOVE", (function (__x) {
          return toString$3(__x, register);
        }));
  if (acc.length === 0) {
    throw new Error("EmptyUpdate");
  }
  return acc.join(" ").trim();
}

var Update = {
  Maker: Maker$2,
  listAppend: listAppend,
  ifNotExists: ifNotExists,
  sum: sum,
  sub: sub,
  build: build$3
};

var U = {
  Maker: Maker$2,
  listAppend: listAppend,
  ifNotExists: ifNotExists,
  sum: sum,
  sub: sub,
  build: build$3
};

var C = {
  Maker: Maker,
  equals: equals,
  notEquals: notEquals,
  lessThan: lessThan,
  lessThanOrEqualTo: lessThanOrEqualTo,
  greaterThan: greaterThan,
  greaterThanOrEqualTo: greaterThanOrEqualTo,
  between: between,
  inList: inList,
  attributeExists: attributeExists,
  attributeNotExists: attributeNotExists,
  attributeType: attributeType,
  beginsWith: beginsWith,
  contains: contains,
  and: and,
  or: or,
  not: not,
  size: size,
  Overload: Overload,
  build: build
};

var K = {
  Maker: Maker$1,
  equals: equals$1,
  notEquals: notEquals$1,
  lessThan: lessThan$1,
  lessThanOrEqualTo: lessThanOrEqualTo$1,
  greaterThan: greaterThan$1,
  greaterThanOrEqualTo: greaterThanOrEqualTo$1,
  between: between$1,
  beginsWith: beginsWith$1,
  any: "Any",
  build: build$2
};

var P = {
  build: build$1
};

var A = {
  Name: Name,
  Value: Value,
  Path: Path
};

exports.Undefinable = Undefinable;
exports.Attribute = Attribute;
exports.Register = Register;
exports.Identifier = Identifier;
exports.Condition = Condition;
exports.Projection = Projection;
exports.KeyCondition = KeyCondition;
exports.Update = Update;
exports.U = U;
exports.C = C;
exports.K = K;
exports.P = P;
exports.A = A;
/* No side effect */
