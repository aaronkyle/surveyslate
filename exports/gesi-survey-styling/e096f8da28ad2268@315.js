import define1 from "./07643da2d0ddc701@406.js";

function _1(md){return(
md`# Utilities: Objects
`
)}

function _2(toc){return(
toc("h2,h3")
)}

function _3(md){return(
md`## Autotype

This built on top of [\`d3.autoType\`](https://github.com/d3/d3-dsv/blob/main/README.md#autoType) with support for parsing numeric strings with commas (e.g. \`"2,323.00"\`).`
)}

function _autoType(d3){return(
function autoType(obj) {
  const copy = { ...obj };
  const skippedProps = {};

  for (let key in copy) {
    const value = copy[key];

    // If a prop is null or undefined set it to empty string so that d3.autoType doesn't throw error
    if (value === null || value === undefined) {
      copy[key] = "";
      continue;
    }

    // If a prop is not string, skip passing through d3.autoType
    if (typeof value !== "string") {
      skippedProps[key] = value;
      delete copy[key];
      continue;
    }

    const str = value.replace(",", "");
    if (!isNaN(+str)) {
      copy[key] = str;
    }
  }

  return {
    ...skippedProps,
    ...d3.autoType(copy)
  };
}
)}

function _5(autoType){return(
autoType({
  Year: "2000",
  Make: "Mercury",
  Model: "Cougar",
  Length: "2.38",
  Price: "200,000"
})
)}

function _6(autoType){return(
autoType({
  Year: 2016,
  Make: "Mercury",
  Model: "Cougar",
  Length: 2.38,
  Price: "200,000",
  Length: undefined
})
)}

function _7(md){return(
md`## Map`
)}

function _8(md){return(
md`### Entries`
)}

function _mapEntries(){return(
function mapEntries(obj, { key = (k) => k, value = (v) => v } = {}) {
  if (typeof obj !== "object") return obj;

  return Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, [key(k)]: value(v) }),
    {}
  );
}
)}

function _10(mapEntries){return(
mapEntries(
  { Name: "Jane Doe", City: "Lisbon" },
  { key: (k) => k.toLowerCase(), value: (k) => k.toLowerCase() }
)
)}

function _11(md){return(
md`### Keys`
)}

function _mapKeys(mapEntries){return(
function mapKeys(obj, key) {
  return mapEntries(obj, { key });
}
)}

function _13(mapKeys){return(
mapKeys({ Name: "Jane Doe", City: "Lisbon" }, (k) => k.toLowerCase())
)}

function _14(md){return(
md`### Values`
)}

function _mapValues(mapEntries){return(
function mapValues(obj, value) {
  return mapEntries(obj, { value });
}
)}

function _16(mapValues){return(
mapValues({ Name: "Jane Doe", City: "Lisbon" }, (v) => v.toLowerCase())
)}

function _17(md){return(
md`## Translate`
)}

function _18(md){return(
md`### Keys`
)}

function _translateKeys(mapKeys){return(
function translateKeys(obj, translationMap) {
  return mapKeys(obj, (k) => translationMap.get(k) ?? k);
}
)}

function _translations(){return(
new Map([
  ["#","Index"],
  ["गा.पा./न.पा.को नाम","Name"],
  ["घरपरिवार","Households"],
  ["जम्मा","Total"],
  ["पुरुष","Men"],
  ["महिला","Women"],
  ["औषत घरपरिवार संख्या","Average household size"],
  ["लैगिंक अनुपात","Sex ratio"],
])
)}

function _example(translateKeys,translations){return(
translateKeys({
  "गा.पा./न.पा.को नाम": "जम्मा",
  घरपरिवार: "78,309",
  जम्मा: "323,288",
  पुरुष: "143,410",
  महिला: "179,878",
  "औषत घरपरिवार संख्या": "4.13",
  "लैगिंक अनुपात": "79.73",
}, translations)
)}

function _22(md){return(
md`### Value`
)}

function _translateValue(){return(
function translateValue(
  obj,
  translationMap,
  {
    key, // The key of the value to be translated
    currentValueLang, // ISO Language code ("ne", "hi",...) of the current value. This will be appended to the key.
    translatedValueLang // ISO Language code ("ne", "hi",...) of the translate value. This will be appended to the key.
  } = {}
) {
  if (!(translationMap instanceof Map))
    throw new Error("`translationMap` should be an instance of Map");
  if (key == null) throw new Error("`key` is not provided");
  if (currentValueLang == null)
    throw new Error("`currentValueLang` is not provided");

  const copy = { ...obj };

  const currentValueKey = `${key}:${currentValueLang}`;
  const translatedValueKey =
    translatedValueLang == null ? key : `${key}:${translatedValueLang}`;

  const value = obj[key];

  // Return the object if the key is not present in the Object
  if (value === undefined) return obj;

  const translatedValue = translationMap.get(value);
  delete copy[key];

  return {
    ...copy,
    [translatedValueKey]: translatedValue,
    [currentValueKey]: value
  };
}
)}

function _24(md){return(
md`Translating an object:`
)}

function _example2(){return(
{
  Name: "जम्मा",
  Households: "78,309",
  Total: "323,288",
  Men: "143,410",
  Women: "179,878",
  "Average household size": "4.13",
  "Sex ratio": "79.73"
}
)}

function _26(translateValue,example2){return(
translateValue(
  example2,
  new Map([
    ["जम्मा", "Total"],
    ["महिला", "Female"],
    ["पुरुष", "Male"]
  ]),
  {
    key: "Name",
    currentValueLang: "ne"
  }
)
)}

function _27(md){return(
md`Translating an object, with not present \`key\`. The object will be returned as it
is.
`
)}

function _28(translateValue,example2){return(
translateValue(
  example2,
  new Map([
    ["जम्मा", "Total"],
    ["महिला", "Female"],
    ["पुरुष", "Male"]
  ]),
  {
    key: "SomethingNotThere",
    currentValueLang: "ne"
  }
)
)}

function _29(md){return(
md`Translating an array of objects:`
)}

function _exampleArray(){return(
[
  {
    season: "ग्रीष्म ऋतु"
  },
  {
    season: "शरद ऋतु"
  },
  {
    season: "जाडो"
  },
  {
    season: "वसन्त"
  }
]
)}

function _31(exampleArray,translateValue){return(
exampleArray.map((d) =>
  translateValue(
    d,
    new Map([
      ["ग्रीष्म ऋतु", "Summer"],
      ["शरद ऋतु", "Autumn"],
      ["जाडो", "Winter"]
    ]),
    {
      key: "season",
      currentValueLang: "ne"
    }
  )
)
)}

function _32(md){return(
md`## Value Accessor`
)}

function _33(md){return(
md`Generates an accessor function if the user provides a key. Otherwise, if user provide a function, the function is returned.`
)}

function _accessor(){return(
function accessor(keyOrFn) {
  if (typeof keyOrFn === "function") return keyOrFn;

  return (d) => d[keyOrFn];
}
)}

function _35(accessor){return(
accessor("name")({
  name: "Jane Doe", age: 29
})
)}

function _36(accessor){return(
accessor((d) => d.name)({
  name: "Jane Doe",
  age: 29
})
)}

function _37(md){return(
md`## Imports`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["toc"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("autoType")).define("autoType", ["d3"], _autoType);
  main.variable(observer()).define(["autoType"], _5);
  main.variable(observer()).define(["autoType"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("mapEntries")).define("mapEntries", _mapEntries);
  main.variable(observer()).define(["mapEntries"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("mapKeys")).define("mapKeys", ["mapEntries"], _mapKeys);
  main.variable(observer()).define(["mapKeys"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("mapValues")).define("mapValues", ["mapEntries"], _mapValues);
  main.variable(observer()).define(["mapValues"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("translateKeys")).define("translateKeys", ["mapKeys"], _translateKeys);
  main.variable(observer("translations")).define("translations", _translations);
  main.variable(observer("example")).define("example", ["translateKeys","translations"], _example);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("translateValue")).define("translateValue", _translateValue);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("example2")).define("example2", _example2);
  main.variable(observer()).define(["translateValue","example2"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["translateValue","example2"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("exampleArray")).define("exampleArray", _exampleArray);
  main.variable(observer()).define(["exampleArray","translateValue"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("accessor")).define("accessor", _accessor);
  main.variable(observer()).define(["accessor"], _35);
  main.variable(observer()).define(["accessor"], _36);
  main.variable(observer()).define(["md"], _37);
  const child1 = runtime.module(define1);
  main.import("toc", child1);
  return main;
}
