# lopepage urls

## Tests

```js
tests()
```

```js
// --- Example Usage ---
dslExamples = [
  "view=200@tomlarkworthy/slug,25@owner/page#cell",
  "view=@tomlarkworthy/slug,@owner/page",
  "view=C(@tomlarkworthy/slug,@owner/page)",
  "view=45@tomlarkworthy/slug,56@owner/page",
  "view=@tomlarkworthy/slug,R32(@owner/page,@owner/page2)",
  "view=200@tomlarkworthy/slug,25@owner/page",
  "C100(S50(@tomlarkworthy/module-selection),S50(@tomlarkworthy/dom-view))",
  "d/1f41fef8b019cf4e@94",
  "view=C100(S50(@tomlarkworthy/cells-to-clipboard,@tomlarkworthy/module-selection),S50(@tomlarkworthy/module-selection))",
  "R100(C50(S50(@tomlarkworthy/module-selection),S50(@tomlarkworthy/editor)),S50(@tomlarkworthy/svg-boinger))"
]
```

```js echo
// --- DSL Parser ---
// Grammar:
//   View  ::= [ "view=" ] Group | List
//   List  ::= Item ( ',' Item )*
//   Item  ::= Group | Module
//   Group ::= ( 'R' | 'C' | 'S') [Number] '(' List ')'
//   Module::= [Number] '@' slug
//
// A module is specified with an optional weight then '@' then the slug.
function parseViewDSL(input) {
  if (!input)
    return {
      nodeType: "group",
      groupType: "S",
      weight: null,
      children: []
    };
  if (input.startsWith("view=")) {
    input = input.slice(5);
  }
  let i = 0;
  function err(msg) {
    throw new Error(msg + " at pos " + i + " for " + input);
  }
  function parseNumber() {
    let start = i;
    while (i < input.length && /[0-9]/.test(input[i])) {
      i++;
    }
    if (start === i) return null;
    return parseInt(input.slice(start, i), 10);
  }
  function parseModule() {
    let weight = parseNumber(); // optional
    if (input[i] == "@") {
      i++; // consume '@'
      let start = i;
      // Read slug until a comma or closing parenthesis.
      while (i < input.length && input[i] !== "," && input[i] !== ")") {
        i++;
      }
      let slug = "@" + input.slice(start, i).trim();
      return { nodeType: "module", weight, slug };
    } else if (input[i] == "d" && input[i + 1] == "/") {
      const start = i;
      let amp = Number.MAX_VALUE;
      while (i < input.length && input[i] !== "," && input[i] !== ")") {
        if (input[i] === "@") amp = i;
        i++;
      }
      let slug = input.slice(start, Math.min(amp, i)).trim();
      return { nodeType: "module", weight, slug };
    } else {
      err(`Expected ${input[i]}`);
    }
  }
  function parseGroup() {
    let groupType = "SCR".includes(input[i]) ? input[i++] : "S";
    let weight = parseNumber();
    if (input[i] == "(") i++; // skip '('
    let children = parseList();
    if (input[i] == ")") i++; // skip ')'
    return { nodeType: "group", groupType, weight, children };
  }
  function parseItem() {
    while (i < input.length && /\s/.test(input[i])) i++;
    if (i < input.length && "SCR".includes(input[i])) {
      return parseGroup();
    } else if (
      i < input.length &&
      (input[i] === "@" ||
        /[0-9]/.test(input[i]) ||
        (input[i] === "d" && input[i + 1] === "/"))
    ) {
      return parseModule();
    } else {
      err("Unexpected character: " + input[i]);
    }
  }
  function parseList() {
    let items = [];
    while (i < input.length && input[i] !== ")") {
      while (i < input.length && /\s/.test(input[i])) i++;
      items.push(parseItem());
      while (i < input.length && /\s/.test(input[i])) i++;
      if (i < input.length && input[i] === ",") {
        i++; // skip comma
      } else {
        break;
      }
    }
    return items;
  }
  const ast = parseGroup();
  while (i < input.length && /\s/.test(input[i])) i++;
  if (i < input.length) err("Unexpected input remaining");
  return ast;
}
```

```js echo
"SRC".includes("S")
```

```js echo
test_parseViewDSL = dslExamples.map((dsl, idx) => parseViewDSL(dsl))
```

```js echo
// --- Conversion to Golden Layout Config ---
// Convert DSL AST into a Golden Layout–style config.
// A module becomes a component. A group becomes a row (if R) or column (if C).
// The top-level container is wrapped in a column unless ALL top-level items
// are modules with no explicit weight—in that case we use a stack.
function convertToGoldenLayout(intermediate) {
  // Convert a module to a component.
  function convertModule(item) {
    return {
      type: "component",
      title: item.slug,
      weight: item.weight,
      size: "1fr",
      id: "",
      maximised: false,
      isClosable: true,
      reorderEnabled: true,
      componentType: "module",
      componentState: {}
    };
  }
  // Convert an item (module or group).
  function convertItem(item) {
    if (item.nodeType === "module") {
      return convertModule(item);
    } else if (item.nodeType === "group") {
      if (item.groupType === "S") {
        return {
          type: "stack",
          content: item.children.map(convertItem),
          weight: item.weight,
          id: "",
          maximised: false,
          isClosable: true,
          activeItemIndex: 0,
          size: "1fr"
        };
      }
      let containerType = item.groupType === "R" ? "row" : "column";
      return {
        type: containerType,
        weight: item.weight,
        content: item.children.map(convertItem),
        id: "",
        isClosable: true
      };
    }
    throw new Error("Unknown node type: " + item.nodeType);
  }

  return convertItem(intermediate);
}
```

```js echo
test_reserialized = dslExamples.map((dsl, idx) =>
  convertToGoldenLayout(parseViewDSL(dsl))
)
```

```js echo
// --- Normalization ---
// For any container node with weights on its children, normalize them so that the sizes sum to 100%.
function normalizeWeights(node) {
  if (node.content && node.content.length > 0) {
    let total = 0;
    for (const child of node.content) {
      total += child.weight || 100.0 / node.content.length;
    }
    for (const child of node.content) {
      let w = child.weight || 100.0 / node.content.length;
      child.size = ((w / total) * 100).toFixed(2) + "%";
      delete child.weight;
      normalizeWeights(child);
    }
  }
  if (!node.size) {
    node.size = "1fr";
    delete node.weight;
  }
}
```

```js echo
// --- Main Function ---
// parseViewConfig takes a DSL string (like the examples below)
// and returns a Golden Layout config.
function parseGoldenDSL(dsl) {
  const intermediate = parseViewDSL(dsl);
  const glConfig = convertToGoldenLayout(intermediate);
  normalizeWeights(glConfig);
  return glConfig;
}
```

```js echo
layouts = dslExamples.map((dsl, idx) => parseGoldenDSL(dsl))
```

## Serialization

```js echo
function serializeGoldenDSL(layout) {
  function serialize(node) {
    if (node.type === "component") {
      return `${node.title}`;
    }
    let size;
    if (node.size === "1fr" || !node.size.endsWith) {
      size = "100";
    } else {
      size = node.size.endsWith("%")
        ? Math.round(node.size.slice(0, -1))
        : Math.round(node.size);
    }

    const childrenStr = (node.content || []).map(serialize).join(",");
    if (node.type === "row") {
      return `R${size}(${childrenStr})`;
    } else if (node.type === "stack") {
      return `S${size}(${childrenStr})`;
    } else if (node.type === "column") {
      return `C${size}(${childrenStr})`;
    }
    throw new Error("Unknown node type: " + node.type);
  }
  return serialize(layout);
}
```

```js echo
test_serializeGoldenDSL = layouts.map(serializeGoldenDSL)
```

```js echo
test_parseGoldenDSL = test_serializeGoldenDSL.map(parseGoldenDSL)
```

## Flat listModules

```js echo
listModules = (hash) => {
  if (!hash) return new Map();
  return new Map(
    _getModuleTitles(parseGoldenDSL(hash)).map((c) => [c.title, c])
  );
}
```

```js echo
function _getModuleTitles(ast) {
  let titles = [];
  if (ast.type === "component") {
    titles.push({
      title: ast.title.split("#")[0],
      cell: ast.title.split("#")[1]
    });
  }
  if (Array.isArray(ast.content)) {
    for (const child of ast.content) {
      titles = titles.concat(_getModuleTitles(child));
    }
  }
  return titles;
}
```

```js echo
test_list_modules = dslExamples.map((dsl, idx) => listModules(dsl))
```

## Get cell

```js echo
getCell = (hash, module) => {
  if (!hash) return undefined;
  return _getModuleTitles(parseGoldenDSL(hash));
}
```

## Add linkTo

```js echo
isOnObservableCom = () =>
  location.href.includes("observableusercontent.com") &&
  !location.href.includes("blob:")
```

```js echo
links = [
  "https://observablehq.com/@tom/foo",
  "https://observablehq.com/@tom/foo?query1#view=@tomlarkworthy/slug,@owner/page&foo=bar"
]
```

```js echo
targets = ["@tom/bar", "d/1f41fef8b019cf4e@94", "@tom/bar#cell"]
```

```js echo
function linkTo(
  module,
  { baseURI = document.baseURI, onObservable = isOnObservableCom() } = {}
) {
  if (onObservable) {
    return module.startsWith("#") ? module : "/" + module;
  }
  try {
    const base = new URL(baseURI);
    const hash = base.hash || "#";
    const baseHash = new URLSearchParams(hash.substring(1));
    const view = baseHash.get("view");
    const ast = parseViewDSL(view);
    ast.children.push({ nodeType: "module", weight: null, slug: module });
    const layout = convertToGoldenLayout(ast);
    normalizeWeights(layout);
    baseHash.set("view", serializeGoldenDSL(layout));
    base.hash = "#" + baseHash.toString();
    return base.toString();
  } catch (err) {
    console.error(err);
    debugger;
  }
}
```

```js echo
viewof vars = variables(runtime)
```

```js echo
test_linkTo = links.map((link) =>
  targets.map((target) =>
    linkTo(target, { baseURI: link, onObservable: false })
  )
)
```

## Auto switch to url structure

Watch the runtime for imports and swap them for our structure

```js
import { runtime, variables } from "@tomlarkworthy/runtime-sdk"
```

```js echo
href_examples = [
  "https://tomlarkworthy/import-notebook",
  "https://d/e1c39d41e8e944b0@939",
  "https://tomlarkworthy/visualizer#unorderedSync",
  "https://observablehq.com/@tomlarkworthy/robocoop",
  "https://observablehq.com/@tomlarkworthy/robocoop#on_prompt",
  "https://observablehq.com/d/936eb1bc1db1ac62",
  "@tomlarkworthy/robocoop#on_prompt"
]
```

```js echo
test_extractNotebookAndCell = href_examples.map(extractNotebookAndCell)
```

```js echo
function extractNotebookAndCell(href) {
  const regex =
    /^(https:\/\/(?<host>[\w.-]+)\/)?(?<nb>(@?[\w-]+\/[\w-]+|d\/[a-f0-9]+|e\/[a-f0-9]+@[0-9]+|[a-f0-9]+@[0-9]+|[\w-]+))(?:#(?<cell>[\w-]+))?$/;
  const match = href.match(regex);
  if (match && match.groups) {
    let notebook;
    if (match.groups.host === "observablehq.com") {
      notebook = match.groups.nb;
    } else {
      // For non-observablehq.com hosts, prepend the host.

      notebook = match.groups.host
        ? `${match.groups.host}/${match.groups.nb}`
        : match.groups.nb;
    }
    // Optionally, you can append an "@" to the notebook identifier later if needed,
    if (!notebook.startsWith("d/") && notebook[0] !== "@") {
      notebook = "@" + notebook;
    }

    notebook = notebook.replace(/@[0-9]+$/, "");
    return { notebook, cell: match.groups.cell || null };
  }
  return null;
}
```

```js
updateNotebookImports = {
  for (const variable of vars) {
    let import_dom;
    if (
      (import_dom = variable?._observer?._node?.firstChild) &&
      import_dom?.classList?.contains("observablehq--import")
    ) {
      import_dom.querySelectorAll("[href]").forEach((link) => {
        const extracted = extractNotebookAndCell(link.href);
        if (extracted) {
          link.href = linkTo(extracted.notebook);
        }
      });
    }
  }
}
```

```js
import { tests } from "@tomlarkworthy/tests"
```
