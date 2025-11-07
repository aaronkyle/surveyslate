# Pretty Tables

Pretty tables display JavaScript Objects and Arrays in a tabular format.
Importantly, _it supports nested objects._

Pretty Tables is built using
[json5-to-table](https://github.com/yetrun/json5-to-table).

Thanks to [Aaron](https://observablehq.com/@aaronkyle), for suggesting this
idea.


## Usage

### 1. Import to your notebook:

```js
import { formatTable } from "@saneef/pretty-tables"
```

### 2. Generate HTML table

In a cell:

```js
formatTable(objOrArray)
```

Also, you can customize the columns using the second argument, `props`. Read
more about on
[`json5-to-table` documentation](https://github.com/yetrun/json5-to-table#props%E5%AE%9A%E5%88%B6%E5%B5%8C%E5%A5%97%E5%B1%9E%E6%80%A7).
⚠️ _It is in Chinese._

```js
formatTable(objOrArray, props)
```

📒 Period character (`.`) in the object keys will be replaced with underscore (`_`). Mindful of those when
using `props`.


### Examples

#### Simple

```js echo
sampleObject = sampleArray[0]
```

```js echo
formatTable(sampleObject)
```

```js echo
sampleArray
```

```js echo
formatTable(sampleArray)
```

#### Using `props`

You can use `props` to cherry-pick columns, and change column name. You can read
the documentation on
[`json5-to-table` repo](https://github.com/yetrun/json5-to-table#props%E5%AE%9A%E5%88%B6%E5%B5%8C%E5%A5%97%E5%B1%9E%E6%80%A7).


```js echo
formatTable(sampleArray, [
  {
    path: "name",
    title: "Name"
  },
  {
    path: "courses",
    title: "Subjects",
    props: [
      {
        path: "title",
        title: "Title"
      },
      {
        path: "score",
        title: "Score"
      }
    ]
  }
])
```

#### Using additional options

View all supported options [in function definition](#formatTable).

```js echo
Inputs.table(sampleArray)
```

```js echo
formatTable(sampleArray, null, {
  height: 200, // Set height of the table

  width: "80%", // Set width of the table

  // Format date types
  dateFormat: (datum, path) => new Intl.DateTimeFormat("en-US").format(datum),

  // Format values. dateFormat take precedence for Date types
  format: (datum, path) => {
    if (path === "courses.score") {
      return `${datum}/100`;
    }
    return datum;
  }
})
```

## Implementation

This is built using [json5-to-table](https://github.com/yetrun/json5-to-table).

```js echo
function formatTable(
  data,
  props, // See https://github.com/yetrun/json5-to-table#props%E5%AE%9A%E5%88%B6%E5%B5%8C%E5%A5%97%E5%B1%9E%E6%80%A7
  opts = {}
) {
  const options = Object.assign(
    {
      // Format Date data types. Use path to selectively format.
      dateFormat: (datum, path) => isoformat.format(datum),

      // Format all values. Use path to selectively format.
      // 📝 dateFormat take precedence for Date types
      format: (datum, path) => datum,

      height: 274, // Set height of the table. Default is on the Inputs.table
      width: null // Set width of the table.
    },
    opts
  );

  const minHeight = 33;
  let { height, width } = options;
  const copy = cleanseData(data, options);

  height = height > minHeight ? height : null;

  const generateHTMLTableoptions = {
    attributes: {
      table: {
        // Based on Observable table styles
        style: `
max-width: initial;
${minHeight != null ? `min-height: ${length(minHeight)};` : ""}
margin: 0;
border-spacing: 0;
font-variant-numeric: tabular-nums;`
      },
      th: {
        style: `padding: 3px 6.5px; position: sticky; top: 0; background: #fff;`
      },
      td: {
        style: `padding: 3px 6.5px`
      }
    }
  };

  return html`<div style="overflow-x: auto;${
    height ? `max-height: ${height}px;` : ""
  }${width != null ? `width: ${length(width)};` : ""}">
  ${json2table.generateHTMLTable(copy, props, generateHTMLTableoptions)}
</div>`;
}
```

```js echo
function cleanseData(d, opts, path) {
  function cleanseObject(o) {
    const newObj = {};
    for (const [k, v] of Object.entries(o)) {
      const currentPath = path == null ? k : `${path}.${k}`;
      newObj[cleanKey(k)] = cleanseData(v, opts, currentPath);
    }
    return newObj;
  }

  function cleanKey(k) {
    return k.replaceAll(blacklistRegex, "_");
  }

  if (Array.isArray(d)) {
    return d.map(cleanseObject);
  }

  if (isDate(d)) {
    return typeof opts.dateFormat === "function"
      ? opts.dateFormat(d, path)
      : d.toString();
  }

  if (isObject(d)) {
    return cleanseObject(d);
  }

  return typeof opts.format === "function" ? opts.format(d, path) : d;
}
```

```js echo
function isObject(a) {
  // https://stackoverflow.com/a/8511350
  return typeof a === "object" && !Array.isArray(a) && a !== null;
}
```

```js echo
function isDate(value) {
  return value instanceof Date;
}
```

```js echo
function length(x) {
  return x == null ? null : typeof x === "number" ? `${x}px` : `${x}`;
}
```

```js echo
blacklistRegex = /(\.){1}/g
```

## Sample Data

```js
sampleArray = [
  {
    name: "Jim",
    birthday: new Date(Date.UTC(1990, 1, 18)),
    courses: [
      { title: "English", score: 87 },
      { title: "Chinese", score: 67 }
    ]
  },
  {
    name: "Lucy",
    birthday: new Date(Date.UTC(1994, 4, 4)),
    courses: [
      { title: "Math", score: 97 },
      { title: "Music", score: 77 },
      { title: "Gym", score: 57 }
    ]
  },
  {
    name: "Karen",
    birthday: new Date(Date.UTC(1994, 2, 27)),
    courses: [
      { title: "Math", score: 98 },
      { title: "Music", score: 81 },
      { title: "English", score: 79 }
    ]
  }
]
```

## Changelog

- 2022-07-04: Initial release
- 2022-07-12: Horizontal scroll for wide tables.
- 2022-07-20: Fix - Data from object keys with period (`.`) are not displayed.
- 2022-07-25: Format Date objects
- 2022-08-18: Max height and sticky headers
- 2022-09-22: Replace periods in keys with underscore instead of removing it.

## Imports

```js
json2table = require('json5-to-table@0.1.8/dist/bundle.js')
```

```js
isoformat = import("https://unpkg.com/isoformat@0.2.1/src/index.js?module")
```

```js
import { groupBy } from "@saneef/micro-lodash"
```

```js
import { footer } from "@saneef/notebooks-footer"
```

--- 

```js
footer
```
