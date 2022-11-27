// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Dynamo = require("dynamo-res/src/Dynamo.bs.js");
var Marshaller = require("./Marshaller.bs.js");

console.log(Dynamo.splitWhen("hello world", (function ($$char) {
            return $$char === " ";
          })));

var register = Dynamo.Register.make(undefined);

var rating = {
  TAG: "AttributeName",
  name: "rating"
};

var plot = {
  TAG: "AttributeName",
  name: "plot"
};

var examplePath_1 = [
  rating,
  {
    TAG: "ListIndex",
    index: 0
  },
  plot,
  {
    TAG: "ListIndex",
    index: 1
  },
  {
    TAG: "ListIndex",
    index: 1
  }
];

var examplePath = {
  TAG: "AttributePath",
  name: "info",
  subpath: examplePath_1
};

console.log(Dynamo.AttributePath.toString(Dynamo.AttributePath.fromString("info.rating[0].plot[1][1]")));

console.log(Dynamo.AttributePath.toString(examplePath));

var year_1 = [{
    TAG: "ListIndex",
    index: 0
  }];

var year = {
  TAG: "AttributePath",
  name: "year",
  subpath: year_1
};

var title = {
  TAG: "AttributeName",
  name: "title"
};

var yearValue_0 = Marshaller.DefaultMarshaller.marshallValue(1992);

var yearValue = {
  TAG: "AttributeValue",
  value: yearValue_0,
  alias: "year"
};

var titleValue_0 = Marshaller.DefaultMarshaller.marshallValue("The Last of the Mohicans");

var titleValue = {
  TAG: "AttributeValue",
  value: titleValue_0,
  alias: "title"
};

var file = {
  TAG: "AttributeName",
  name: "file"
};

var minFileSize_0 = Marshaller.DefaultMarshaller.marshallValue(0);

var minFileSize = {
  TAG: "AttributeValue",
  value: minFileSize_0,
  alias: "minFileSize"
};

var exampleConditionExpression = Dynamo.Condition.Overload.$amp$amp(Dynamo.Condition.Overload.$amp$amp(Dynamo.Condition.Overload.$eq$eq(year, yearValue), Dynamo.Condition.Overload.$bang$eq(title, titleValue)), Dynamo.Condition.Overload.$great({
          TAG: "Size",
          operand: file
        }, minFileSize));

console.log(Dynamo.Condition.build(exampleConditionExpression, register));

var exampleProjectionExpression = [
  {
    TAG: "AttributeName",
    name: "year"
  },
  {
    TAG: "AttributeName",
    name: "title"
  },
  {
    TAG: "AttributeName",
    name: "info"
  }
];

console.log(Dynamo.Projection.build(exampleProjectionExpression, register));

var exampleKeyConditionExpression_pk = {
  name: {
    TAG: "AttributeName",
    name: "year"
  },
  value: {
    TAG: "AttributeValue",
    value: Marshaller.DefaultMarshaller.marshallValue(1992),
    alias: "year"
  }
};

var exampleKeyConditionExpression_sk = {
  TAG: "Comparison",
  name: {
    TAG: "AttributeName",
    name: "title"
  },
  comparator: "Equals",
  value: {
    TAG: "AttributeValue",
    value: Marshaller.DefaultMarshaller.marshallValue("The Last of the Mohicans"),
    alias: "title"
  }
};

var exampleKeyConditionExpression = {
  pk: exampleKeyConditionExpression_pk,
  sk: exampleKeyConditionExpression_sk
};

console.log(Dynamo.KeyCondition.build(exampleKeyConditionExpression, register));

var exampleUpdateExpression_set = [
  [
    {
      TAG: "AttributeName",
      name: "rating"
    },
    {
      TAG: "AttributeValue",
      value: Marshaller.DefaultMarshaller.marshallValue(5),
      alias: "rating"
    }
  ],
  [
    {
      TAG: "AttributeName",
      name: "plot"
    },
    {
      TAG: "IfNotExists",
      identifier: {
        TAG: "AttributeName",
        name: "plot"
      },
      operand: {
        TAG: "AttributeValue",
        value: Marshaller.DefaultMarshaller.marshallValue("test"),
        alias: "plot"
      }
    }
  ]
];

var exampleUpdateExpression_remove = [{
    TAG: "AttributeName",
    name: "actors"
  }];

var exampleUpdateExpression_add = [[
    {
      TAG: "AttributeName",
      name: "actors"
    },
    {
      TAG: "AttributeValue",
      value: Marshaller.DefaultMarshaller.marshallValue([
            "Daniel Day-Lewis",
            "Madeleine Stowe"
          ]),
      alias: "actors"
    }
  ]];

var exampleUpdateExpression = {
  set: exampleUpdateExpression_set,
  remove: exampleUpdateExpression_remove,
  add: exampleUpdateExpression_add
};

console.log(Dynamo.Update.build(exampleUpdateExpression, register));

console.log(register.names);

console.log(register.values);

var info = {
  TAG: "AttributeName",
  name: "info"
};

exports.register = register;
exports.info = info;
exports.rating = rating;
exports.plot = plot;
exports.examplePath = examplePath;
exports.year = year;
exports.title = title;
exports.yearValue = yearValue;
exports.titleValue = titleValue;
exports.file = file;
exports.minFileSize = minFileSize;
exports.exampleConditionExpression = exampleConditionExpression;
exports.exampleProjectionExpression = exampleProjectionExpression;
exports.exampleKeyConditionExpression = exampleKeyConditionExpression;
exports.exampleUpdateExpression = exampleUpdateExpression;
/*  Not a pure module */
