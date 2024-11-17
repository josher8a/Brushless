var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/Brushless.bs.js
var require_Brushless_bs = __commonJS({
  "src/Brushless.bs.js"(exports) {
    "use strict";
    function getOr(value, $$default) {
      if (value === void 0) {
        return $$default;
      } else {
        return value;
      }
    }
    function equal(a, b, eq) {
      if (a === void 0) {
        if (b === void 0) {
          return true;
        } else {
          return false;
        }
      } else if (b === void 0) {
        return false;
      } else {
        return eq(a, b);
      }
    }
    var Undefinable = {
      getOr,
      equal
    };
    function make(name) {
      return {
        TAG: "AttributeName",
        name
      };
    }
    function toString(name) {
      let name$1 = name.name;
      if (name$1.includes(" ") || name$1.includes(".")) {
        throw new Error("InvalidName");
      }
      return "#" + name$1.replaceAll("-", "_");
    }
    var AttributeName3 = {
      make,
      toString
    };
    function make$1(x) {
      return {
        TAG: "AttributeValue",
        value: x.value,
        alias: x.alias
      };
    }
    function toString$1(value) {
      return ":" + value.alias;
    }
    var AttributeValue3 = {
      make: make$1,
      toString: toString$1
    };
    function splitWhen(str, predicate) {
      let _index = 0;
      while (true) {
        let index = _index;
        let char = str[index];
        if (char === void 0) {
          return [
            str,
            "",
            ""
          ];
        }
        if (predicate(char)) {
          return [
            str.substring(0, index),
            str.substring(index, index + 1 | 0),
            str.substring(index + 1 | 0)
          ];
        }
        _index = index + 1 | 0;
        continue;
      }
      ;
    }
    function fromString(str) {
      let parse = (_str, _state, _accOpt) => {
        while (true) {
          let accOpt = _accOpt;
          let state = _state;
          let str2 = _str;
          let acc2 = accOpt !== void 0 ? accOpt : [];
          let match2 = splitWhen(str2, (char) => {
            if (char === "[") {
              return true;
            } else {
              return char === ".";
            }
          });
          let rest = match2[2];
          let name = match2[0];
          if (state === "Name") {
            if (name === "") {
              throw new Error("InvalidPath");
            }
            acc2.push({
              TAG: "AttributeName",
              name
            });
          } else if (name !== "") {
            throw new Error("InvalidPath");
          }
          switch (match2[1]) {
            case "":
              if (rest === "") {
                return acc2;
              }
              throw new Error("InvalidPath");
            case ".":
              _accOpt = acc2;
              _state = "Name";
              _str = rest;
              continue;
            case "[":
              let match$1 = splitWhen(rest, (char) => char === "]");
              if (match$1[1] === "]") {
                acc2.push({
                  TAG: "ListIndex",
                  index: parseIndex(match$1[0])
                });
                _accOpt = acc2;
                _state = "Index";
                _str = match$1[2];
                continue;
              }
              throw new Error("InvalidPath");
            default:
              throw new Error("InvalidPath");
          }
        }
        ;
      };
      let parseIndex = (index) => {
        let x = parseInt(index);
        if (isFinite(x) && x >= 0 && index.length === x.toString().length) {
          return x | 0;
        }
        throw new Error("InvalidIndex: " + index);
      };
      let acc = [];
      let match = parse(str, "Name", acc).shift();
      if (match !== void 0) {
        if (match.TAG === "AttributeName") {
          return {
            TAG: "AttributePath",
            name: match.name,
            subpath: acc
          };
        }
        throw new Error("InvalidPath");
      }
      throw new Error("InvalidPath");
    }
    function toString$2(param) {
      return param.subpath.reduce((acc, subs) => {
        if (subs.TAG === "AttributeName") {
          return acc + "." + toString({
            TAG: "AttributeName",
            name: subs.name
          });
        } else {
          return acc + "[" + String(subs.index) + "]";
        }
      }, toString({
        TAG: "AttributeName",
        name: param.name
      }));
    }
    var AttributePath3 = {
      fromString,
      toString: toString$2
    };
    function make$2() {
      return {
        names: void 0,
        values: void 0
      };
    }
    function isValueEqual(a, b) {
      return [
        equal(a.S, b.S, (x, y) => x === y),
        equal(a.N, b.N, (x, y) => x === y),
        equal(a.NULL, b.NULL, (x, y) => x === y),
        equal(a.BOOL, b.BOOL, (x, y) => x === y),
        equal(a.SS, b.SS, (x, y) => x.every((v) => y.includes(v))),
        equal(a.NS, b.NS, (x, y) => x.every((v) => y.includes(v))),
        equal(a.L, b.L, (x, y) => x.every((v, i) => {
          let y$1 = y[i];
          if (y$1 !== void 0) {
            return isValueEqual(v, y$1);
          } else {
            return false;
          }
        })),
        equal(a.M, b.M, (x, y) => {
          let keys = Object.entries(x);
          if (keys.length === Object.keys(y).length) {
            return keys.every((param) => {
              let y$1 = y[param[0]];
              if (y$1 !== void 0) {
                return isValueEqual(param[1], y$1);
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        })
      ].some((x) => x);
    }
    function addValue(register, _element) {
      while (true) {
        let element = _element;
        let alias = element.alias;
        let value = element.value;
        let key = toString$1({
          TAG: "AttributeValue",
          value,
          alias
        });
        let dict = getOr(register.values, {});
        let exist = dict[key];
        if (exist !== void 0 && exist !== value && !isValueEqual(exist, value)) {
          _element = {
            TAG: "AttributeValue",
            value,
            alias: alias + "_"
          };
          continue;
        }
        dict[key] = value;
        register.values = dict;
        return element;
      }
      ;
    }
    function addName(register, element) {
      let name = element.name;
      let dict = getOr(register.names, {});
      dict[toString({
        TAG: "AttributeName",
        name
      })] = name;
      register.names = dict;
      return element;
    }
    function addPath(register, element) {
      let name = element.name;
      let dict = getOr(register.names, {});
      dict[toString({
        TAG: "AttributeName",
        name
      })] = name;
      element.subpath.forEach((sub2) => {
        if (sub2.TAG !== "AttributeName") {
          return;
        }
        let name2 = sub2.name;
        dict[toString({
          TAG: "AttributeName",
          name: name2
        })] = name2;
      });
      register.names = dict;
      return element;
    }
    var Register3 = {
      make: make$2,
      addValue,
      addName,
      addPath
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
    var Identifier2 = {
      toString: toString$3
    };
    function equals(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: "=",
        rhs
      };
    }
    function notEquals(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: "<>",
        rhs
      };
    }
    function lessThan(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: "<",
        rhs
      };
    }
    function lessThanOrEqualTo(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: "<=",
        rhs
      };
    }
    function greaterThan(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: ">",
        rhs
      };
    }
    function greaterThanOrEqualTo(lhs, rhs) {
      return {
        TAG: "Comparison",
        lhs,
        comparator: ">=",
        rhs
      };
    }
    function between(operand, limits) {
      return {
        TAG: "Between",
        operand,
        limits
      };
    }
    function inList(operand, list) {
      return {
        TAG: "In",
        operand,
        list
      };
    }
    function attributeExists(identifier) {
      return {
        TAG: "AttributeExists",
        identifier
      };
    }
    function attributeNotExists(identifier) {
      return {
        TAG: "AttributeNotExists",
        identifier
      };
    }
    function attributeType(identifier, operand) {
      return {
        TAG: "AttributeType",
        identifier,
        operand
      };
    }
    function beginsWith(identifier, operand) {
      return {
        TAG: "BeginsWith",
        identifier,
        operand
      };
    }
    function contains(identifier, operand) {
      return {
        TAG: "Contains",
        identifier,
        operand
      };
    }
    function toContains(identifier, operand) {
      return {
        TAG: "ToContains",
        identifier,
        operand
      };
    }
    function and(lhs, rhs) {
      return {
        TAG: "And",
        lhs,
        rhs
      };
    }
    function or(lhs, rhs) {
      return {
        TAG: "Or",
        lhs,
        rhs
      };
    }
    function not(condition) {
      return {
        TAG: "Not",
        condition
      };
    }
    function size(operand) {
      return {
        TAG: "Size",
        operand
      };
    }
    var Maker = {
      equals,
      notEquals,
      lessThan,
      lessThanOrEqualTo,
      greaterThan,
      greaterThanOrEqualTo,
      between,
      inList,
      attributeExists,
      attributeNotExists,
      attributeType,
      beginsWith,
      contains,
      toContains,
      and,
      or,
      not,
      size
    };
    var Overload = {
      $amp$amp: and,
      $pipe$pipe: or,
      $bang: not,
      $eq$eq: equals,
      $bang$eq: notEquals,
      $less: lessThan,
      $less$eq: lessThanOrEqualTo,
      $great: greaterThan,
      $great$eq: greaterThanOrEqualTo
    };
    function build(condition, register) {
      let toString$4 = (condition2) => {
        switch (condition2.TAG) {
          case "Comparison":
            return opString(condition2.lhs) + " " + condition2.comparator + " " + opString(condition2.rhs);
          case "Between":
            let limits = condition2.limits;
            return opString(condition2.operand) + " BETWEEN " + opString(limits.lower) + " AND " + opString(limits.upper);
          case "In":
            return opString(condition2.operand) + " IN (" + condition2.list.map(opString).join(", ") + ")";
          case "And":
            return "(" + toString$4(condition2.lhs) + ") AND (" + toString$4(condition2.rhs) + ")";
          case "Or":
            return "(" + toString$4(condition2.lhs) + ") OR (" + toString$4(condition2.rhs) + ")";
          case "Not":
            return "NOT (" + toString$4(condition2.condition) + ")";
          case "AttributeExists":
            return "attribute_exists(" + toString$3(condition2.identifier, register) + ")";
          case "AttributeNotExists":
            return "attribute_not_exists(" + toString$3(condition2.identifier, register) + ")";
          case "AttributeType":
            return "attribute_type(" + toString$3(condition2.identifier, register) + ", " + opString(condition2.operand) + ")";
          case "BeginsWith":
            return "begins_with(" + toString$3(condition2.identifier, register) + ", " + opString(condition2.operand) + ")";
          case "Contains":
            return "contains(" + toString$3(condition2.identifier, register) + ", " + opString(condition2.operand) + ")";
          case "ToContains":
            return "contains(" + opString(condition2.operand) + ", " + toString$3(condition2.identifier, register) + ")";
        }
      };
      let opString = (operand) => {
        switch (operand.TAG) {
          case "AttributePath":
            return toString$2(addPath(register, {
              TAG: "AttributePath",
              name: operand.name,
              subpath: operand.subpath
            }));
          case "AttributeName":
            return toString(addName(register, {
              TAG: "AttributeName",
              name: operand.name
            }));
          case "AttributeValue":
            return toString$1(addValue(register, {
              TAG: "AttributeValue",
              value: operand.value,
              alias: operand.alias
            }));
          case "Size":
            return "size(" + opString(operand.operand) + ")";
        }
      };
      return toString$4(condition);
    }
    var Condition3 = {
      Maker,
      equals,
      notEquals,
      lessThan,
      lessThanOrEqualTo,
      greaterThan,
      greaterThanOrEqualTo,
      between,
      inList,
      attributeExists,
      attributeNotExists,
      attributeType,
      beginsWith,
      contains,
      toContains,
      and,
      or,
      not,
      size,
      Overload,
      build
    };
    function build$1(projection, register) {
      return projection.map((__x) => toString$3(__x, register)).join(", ");
    }
    var Projection3 = {
      build: build$1
    };
    function equals$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: "=",
        value
      };
    }
    function notEquals$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: "<>",
        value
      };
    }
    function lessThan$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: "<",
        value
      };
    }
    function lessThanOrEqualTo$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: "<=",
        value
      };
    }
    function greaterThan$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: ">",
        value
      };
    }
    function greaterThanOrEqualTo$1(name, value) {
      return {
        TAG: "Comparison",
        name,
        comparator: ">=",
        value
      };
    }
    function between$1(name, limits) {
      return {
        TAG: "Between",
        name,
        limits
      };
    }
    function beginsWith$1(name, value) {
      return {
        TAG: "BeginsWith",
        name,
        value
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
        case "Comparison":
          return " AND " + toString(addName(register, skCondition.name)) + " " + skCondition.comparator + " " + toString$1(addValue(register, skCondition.value));
        case "Between":
          let limits = skCondition.limits;
          return " AND " + toString(addName(register, skCondition.name)) + " BETWEEN " + toString$1(addValue(register, limits.lower)) + " AND " + toString$1(addValue(register, limits.upper));
        case "BeginsWith":
          return " AND begins_with(" + toString(addName(register, skCondition.name)) + ", " + toString$1(addValue(register, skCondition.value)) + ")";
      }
    }
    function build$2(keyCondition, register) {
      return toString(addName(register, keyCondition.pk.name)) + " = " + toString$1(addValue(register, keyCondition.pk.value)) + skConditionToString(keyCondition.sk, register);
    }
    var KeyCondition3 = {
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
        identifier,
        operand
      };
    }
    function ifNotExists(identifier, operand) {
      return {
        TAG: "IfNotExists",
        identifier,
        operand
      };
    }
    function sum(lhs, rhs) {
      return {
        TAG: "Sum",
        lhs,
        rhs
      };
    }
    function sub(lhs, rhs) {
      return {
        TAG: "Sub",
        lhs,
        rhs
      };
    }
    var Maker$2 = {
      listAppend,
      ifNotExists,
      sum,
      sub
    };
    function operandToString(operand, register) {
      switch (operand.TAG) {
        case "AttributePath":
          return toString$2(addPath(register, {
            TAG: "AttributePath",
            name: operand.name,
            subpath: operand.subpath
          }));
        case "AttributeName":
          return toString(addName(register, {
            TAG: "AttributeName",
            name: operand.name
          }));
        case "AttributeValue":
          return toString$1(addValue(register, {
            TAG: "AttributeValue",
            value: operand.value,
            alias: operand.alias
          }));
        case "ListAppend":
          return "list_append(" + operandToString(operand.identifier, register) + ", " + operandToString(operand.operand, register) + ")";
        case "IfNotExists":
          return "if_not_exists(" + operandToString(operand.identifier, register) + ", " + operandToString(operand.operand, register) + ")";
        case "Sum":
          return operandToString(operand.lhs, register) + " + " + operandToString(operand.rhs, register);
        case "Sub":
          return operandToString(operand.lhs, register) + " - " + operandToString(operand.rhs, register);
      }
    }
    function appendIfNotEmpty(acc, arr, tag, fn) {
      if (arr !== void 0 && arr.length > 0) {
        return acc + tag + " " + arr.map(fn).join(", ") + " ";
      } else {
        return acc;
      }
    }
    function build$3(update, register) {
      return appendIfNotEmpty(appendIfNotEmpty(appendIfNotEmpty(appendIfNotEmpty("", update.add, "ADD", (param) => toString$3(param[0], register) + " " + toString$1(addValue(register, param[1]))), update.delete, "DELETE", (param) => toString$3(param[0], register) + " " + toString$1(addValue(register, param[1]))), update.set, "SET", (param) => toString$3(param[0], register) + " = " + operandToString(param[1], register)), update.remove, "REMOVE", (__x) => toString$3(__x, register)).trim();
    }
    var Update3 = {
      Maker: Maker$2,
      listAppend,
      ifNotExists,
      sum,
      sub,
      build: build$3
    };
    var U3 = {
      Maker: Maker$2,
      listAppend,
      ifNotExists,
      sum,
      sub,
      build: build$3
    };
    var C3 = {
      Maker,
      equals,
      notEquals,
      lessThan,
      lessThanOrEqualTo,
      greaterThan,
      greaterThanOrEqualTo,
      between,
      inList,
      attributeExists,
      attributeNotExists,
      attributeType,
      beginsWith,
      contains,
      toContains,
      and,
      or,
      not,
      size,
      Overload,
      build
    };
    var K3 = {
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
    var P3 = {
      build: build$1
    };
    exports.Undefinable = Undefinable;
    exports.AttributeName = AttributeName3;
    exports.AttributeValue = AttributeValue3;
    exports.AttributePath = AttributePath3;
    exports.Register = Register3;
    exports.Identifier = Identifier2;
    exports.Condition = Condition3;
    exports.Projection = Projection3;
    exports.KeyCondition = KeyCondition3;
    exports.Update = Update3;
    exports.U = U3;
    exports.C = C3;
    exports.K = K3;
    exports.P = P3;
  }
});

// src/Brushless.bs.ts
var BrushlessJS = require_Brushless_bs();
var AttributeName_make = BrushlessJS.AttributeName.make;
var AttributeName_toString = BrushlessJS.AttributeName.toString;
var AttributeValue_make = BrushlessJS.AttributeValue.make;
var AttributeValue_toString = BrushlessJS.AttributeValue.toString;
var AttributePath_fromString = BrushlessJS.AttributePath.fromString;
var AttributePath_toString = BrushlessJS.AttributePath.toString;
var Register_make = BrushlessJS.Register.make;
var Register_addValue = BrushlessJS.Register.addValue;
var Register_addName = BrushlessJS.Register.addName;
var Register_addPath = BrushlessJS.Register.addPath;
var Identifier_toString = BrushlessJS.Identifier.toString;
var Condition_Maker_equals = BrushlessJS.Condition.Maker.equals;
var Condition_Maker_notEquals = BrushlessJS.Condition.Maker.notEquals;
var Condition_Maker_lessThan = BrushlessJS.Condition.Maker.lessThan;
var Condition_Maker_lessThanOrEqualTo = BrushlessJS.Condition.Maker.lessThanOrEqualTo;
var Condition_Maker_greaterThan = BrushlessJS.Condition.Maker.greaterThan;
var Condition_Maker_greaterThanOrEqualTo = BrushlessJS.Condition.Maker.greaterThanOrEqualTo;
var Condition_Maker_between = BrushlessJS.Condition.Maker.between;
var Condition_Maker_inList = BrushlessJS.Condition.Maker.inList;
var Condition_Maker_attributeExists = BrushlessJS.Condition.Maker.attributeExists;
var Condition_Maker_attributeNotExists = BrushlessJS.Condition.Maker.attributeNotExists;
var Condition_Maker_attributeType = BrushlessJS.Condition.Maker.attributeType;
var Condition_Maker_beginsWith = BrushlessJS.Condition.Maker.beginsWith;
var Condition_Maker_contains = BrushlessJS.Condition.Maker.contains;
var Condition_Maker_toContains = BrushlessJS.Condition.Maker.toContains;
var Condition_Maker_and = BrushlessJS.Condition.Maker.and;
var Condition_Maker_or = BrushlessJS.Condition.Maker.or;
var Condition_Maker_not = BrushlessJS.Condition.Maker.not;
var Condition_Maker_size = BrushlessJS.Condition.Maker.size;
var Condition_equals = BrushlessJS.Condition.equals;
var Condition_notEquals = BrushlessJS.Condition.notEquals;
var Condition_lessThan = BrushlessJS.Condition.lessThan;
var Condition_lessThanOrEqualTo = BrushlessJS.Condition.lessThanOrEqualTo;
var Condition_greaterThan = BrushlessJS.Condition.greaterThan;
var Condition_greaterThanOrEqualTo = BrushlessJS.Condition.greaterThanOrEqualTo;
var Condition_between = BrushlessJS.Condition.between;
var Condition_inList = BrushlessJS.Condition.inList;
var Condition_attributeExists = BrushlessJS.Condition.attributeExists;
var Condition_attributeNotExists = BrushlessJS.Condition.attributeNotExists;
var Condition_attributeType = BrushlessJS.Condition.attributeType;
var Condition_beginsWith = BrushlessJS.Condition.beginsWith;
var Condition_contains = BrushlessJS.Condition.contains;
var Condition_toContains = BrushlessJS.Condition.toContains;
var Condition_and = BrushlessJS.Condition.and;
var Condition_or = BrushlessJS.Condition.or;
var Condition_not = BrushlessJS.Condition.not;
var Condition_size = BrushlessJS.Condition.size;
var Condition_build = BrushlessJS.Condition.build;
var Projection_build = BrushlessJS.Projection.build;
var KeyCondition_Maker_equals = BrushlessJS.KeyCondition.Maker.equals;
var KeyCondition_Maker_notEquals = BrushlessJS.KeyCondition.Maker.notEquals;
var KeyCondition_Maker_lessThan = BrushlessJS.KeyCondition.Maker.lessThan;
var KeyCondition_Maker_lessThanOrEqualTo = BrushlessJS.KeyCondition.Maker.lessThanOrEqualTo;
var KeyCondition_Maker_greaterThan = BrushlessJS.KeyCondition.Maker.greaterThan;
var KeyCondition_Maker_greaterThanOrEqualTo = BrushlessJS.KeyCondition.Maker.greaterThanOrEqualTo;
var KeyCondition_Maker_between = BrushlessJS.KeyCondition.Maker.between;
var KeyCondition_Maker_beginsWith = BrushlessJS.KeyCondition.Maker.beginsWith;
var KeyCondition_Maker_any = BrushlessJS.KeyCondition.Maker.any;
var KeyCondition_equals = BrushlessJS.KeyCondition.equals;
var KeyCondition_notEquals = BrushlessJS.KeyCondition.notEquals;
var KeyCondition_lessThan = BrushlessJS.KeyCondition.lessThan;
var KeyCondition_lessThanOrEqualTo = BrushlessJS.KeyCondition.lessThanOrEqualTo;
var KeyCondition_greaterThan = BrushlessJS.KeyCondition.greaterThan;
var KeyCondition_greaterThanOrEqualTo = BrushlessJS.KeyCondition.greaterThanOrEqualTo;
var KeyCondition_between = BrushlessJS.KeyCondition.between;
var KeyCondition_beginsWith = BrushlessJS.KeyCondition.beginsWith;
var KeyCondition_any = BrushlessJS.KeyCondition.any;
var KeyCondition_build = BrushlessJS.KeyCondition.build;
var Update_Maker_listAppend = BrushlessJS.Update.Maker.listAppend;
var Update_Maker_ifNotExists = BrushlessJS.Update.Maker.ifNotExists;
var Update_Maker_sum = BrushlessJS.Update.Maker.sum;
var Update_Maker_sub = BrushlessJS.Update.Maker.sub;
var Update_listAppend = BrushlessJS.Update.listAppend;
var Update_ifNotExists = BrushlessJS.Update.ifNotExists;
var Update_sum = BrushlessJS.Update.sum;
var Update_sub = BrushlessJS.Update.sub;
var Update_build = BrushlessJS.Update.build;
var U_listAppend = BrushlessJS.U.listAppend;
var U_ifNotExists = BrushlessJS.U.ifNotExists;
var U_sum = BrushlessJS.U.sum;
var U_sub = BrushlessJS.U.sub;
var U_build = BrushlessJS.U.build;
var C_equals = BrushlessJS.C.equals;
var C_notEquals = BrushlessJS.C.notEquals;
var C_lessThan = BrushlessJS.C.lessThan;
var C_lessThanOrEqualTo = BrushlessJS.C.lessThanOrEqualTo;
var C_greaterThan = BrushlessJS.C.greaterThan;
var C_greaterThanOrEqualTo = BrushlessJS.C.greaterThanOrEqualTo;
var C_between = BrushlessJS.C.between;
var C_inList = BrushlessJS.C.inList;
var C_attributeExists = BrushlessJS.C.attributeExists;
var C_attributeNotExists = BrushlessJS.C.attributeNotExists;
var C_attributeType = BrushlessJS.C.attributeType;
var C_beginsWith = BrushlessJS.C.beginsWith;
var C_contains = BrushlessJS.C.contains;
var C_toContains = BrushlessJS.C.toContains;
var C_and = BrushlessJS.C.and;
var C_or = BrushlessJS.C.or;
var C_not = BrushlessJS.C.not;
var C_size = BrushlessJS.C.size;
var C_build = BrushlessJS.C.build;
var K_equals = BrushlessJS.K.equals;
var K_notEquals = BrushlessJS.K.notEquals;
var K_lessThan = BrushlessJS.K.lessThan;
var K_lessThanOrEqualTo = BrushlessJS.K.lessThanOrEqualTo;
var K_greaterThan = BrushlessJS.K.greaterThan;
var K_greaterThanOrEqualTo = BrushlessJS.K.greaterThanOrEqualTo;
var K_between = BrushlessJS.K.between;
var K_beginsWith = BrushlessJS.K.beginsWith;
var K_any = BrushlessJS.K.any;
var K_build = BrushlessJS.K.build;
var P_build = BrushlessJS.P.build;
var AttributeName = BrushlessJS.AttributeName;
var K = BrushlessJS.K;
var Identifier = BrushlessJS.Identifier;
var Condition = BrushlessJS.Condition;
var KeyCondition = BrushlessJS.KeyCondition;
var Update = BrushlessJS.Update;
var Register = BrushlessJS.Register;
var Projection = BrushlessJS.Projection;
var AttributePath = BrushlessJS.AttributePath;
var U = BrushlessJS.U;
var C = BrushlessJS.C;
var AttributeValue = BrushlessJS.AttributeValue;
var P = BrushlessJS.P;

// src/index.ts
var AttributeName2 = AttributeName;
var AttributePath2 = AttributePath;
var AttributeValue2 = AttributeValue;
var Condition2 = Condition;
var KeyCondition2 = KeyCondition;
var Update2 = Update;
var Projection2 = Projection;
var Register2 = Register;
var C2 = Condition2;
var K2 = KeyCondition2;
var U2 = Update2;
var P2 = Projection2;
var R = Register2;
export {
  AttributeName2 as AttributeName,
  AttributePath2 as AttributePath,
  AttributeValue2 as AttributeValue,
  C2 as C,
  Condition2 as Condition,
  K2 as K,
  KeyCondition2 as KeyCondition,
  P2 as P,
  Projection2 as Projection,
  R,
  Register2 as Register,
  U2 as U,
  Update2 as Update
};
//# sourceMappingURL=index.mjs.map