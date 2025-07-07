# Bidirectional Observable JS <=> Runtime Toolchain

```js
import {decompile, compile, cellMap} from "@tomlarkworthy/observablejs-toolchain"
```

### Compilation, source to runtime variable(s)

Compilation takes notebook source cells written in `Observable Javascript` and turns them into reactive variables for execution in the `Observable Runtime`. A cell is usually compiled to one runtime variable, however, mutable variables are more complicated and are represented as three runtime variables.

ObservableHQ does the compilation process as part of the hosted notebook experience but in this notebook we provide a way to do it in userspace.

### Decompilation, Runtime variables(s) to source
The aim of decompilation is to go from the live runtime variable definitions, back to the source as best as possible. ObseervableHQ does not have this feature. In this notebook we implement it in userspace.


### Codeveloped with AI

This notebook is setup for was AI collaboration. Important runtime values, such as the test suite report, are highlighted to the LLM, which helps it decide how to fix test cases.

### Prior work

_Alex Garcia_ pioneered the first third-party Observable **_compiler_** [[asg017/unofficial-observablehq-compiler](https://github.com/asg017/unofficial-observablehq-compiler)]. The compiler here differs by being entirely text/data based, _i.e._ the output is a string/JSON, not hydrated variables and functions.

This is the first **_decompiler_**.

## TODO
- Tagged templates (decompilation works, but there is no source compile for them)
- notebook imports (WIP some decompilation works)
   - need to dedupe some of the implied imports, e.g. `viewof foo` also imports `foo` but we don't need to explicitly import `foo`, it's implied
- anonymous variables work, but the test cases fail due to naming mismatches
- Bug with unobserved module imports, moduleSource does not resolve, we just adjusted source to avoid that problem now 
- cellmap: assigning an imported viewof to a variable creates two cells where there should be 1
- class body assignments can't be decompiled

```js
observable = import(
  "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js"
)
```

## Continuous Integration Testing

We sniff the entire runtime to test that each cell is de-compilable

```js
import { tests, viewof runtime_variables, modules } from "@tomlarkworthy/tests"
```

```js
tests()
```

### All cells are decompileable

```js
cellMaps = new Map(
  await Promise.all(
    [...modules.entries()].map(async ([module, info]) => [
      module,
      await cellMap(module)
    ])
  )
)
```

```js
allCells = [...cellMaps.values()].map((cells) => [...cells.values()]).flat()
```

```js
all_decompiled = Promise.all(
  allCells.map(async (cell) => {
    try {
      return {
        cell,
        source: await decompile(cell)
      };
    } catch (error) {
      return {
        cell,
        error
      };
    }
  })
)
```

```js
test_all_cells_decompilable = {
  const errors = all_decompiled.filter((s) => s.error);
  if (errors.length > 0) throw errors;
  return `${all_decompiled.length} cells decompiled without error`;
}
```

### All decompiled cells can be recompiled

```js
all_compiled = all_decompiled
  .filter((source) => !source.error)
  .map((source) => {
    try {
      return {
        ...source,
        compiled: compile(source.source)
      };
    } catch (error) {
      return {
        ...source,
        error
      };
    }
  })
```

```js
test_decompiled_cells_recompilable = {
  const errored = all_compiled.filter((cell) => cell.error);
  if (errored.length > 0) throw JSON.stringify(errored, null, 2);
  return `${all_compiled.length} cells recompiled without error`;
}
```

### All cells roundtrip compile

```js
roundtripped = Promise.all(
  all_compiled
    .filter((c) => !c.error)
    .map(async (cell) => {
      try {
        const decompiled = await decompile(cell.compiled);
        return {
          ...cell,
          decompiled
        };
      } catch (error) {
        return {
          ...cell,
          error
        };
      }
    })
)
```

```js
test_all_cells_roundtrippable = {
  const errored = roundtripped.filter((cell) => cell.error);
  if (errored.length > 0) throw JSON.stringify(errored, null, 2);
  return `${roundtripped} cells decompiled, recompiled and decompiled again without error`;
}
```

## Reference Data

### Source code
The source code of a [reference notebook](https://observablehq.com/@tomlarkworthy/notebook-semantics?collection=@tomlarkworthy/lopebook) is extracted directly from the `https://api.observablehq.com/document/...` endpoint


```js
dependancy_document = ({
  id: "1fb3132464653a8f",
  slug: "dependancy",
  trashed: false,
  description: "",
  likes: 0,
  publish_level: "live_unlisted",
  forks: 0,
  fork_of: null,
  has_importers: true,
  update_time: "2024-10-15T18:06:59.080Z",
  first_public_version: 16,
  paused_version: null,
  publish_time: "2024-10-15T18:07:25.850Z",
  publish_version: 16,
  latest_version: 16,
  thumbnail: "52bb3d5b2f48b727e0eea931c0093fe5778fb9b809bebb1edfb949d2f4b5590a",
  default_thumbnail:
    "52bb3d5b2f48b727e0eea931c0093fe5778fb9b809bebb1edfb949d2f4b5590a",
  roles: [],
  sharing: null,
  owner: {
    id: "7db5ed2b0697d645",
    avatar_url:
      "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
    login: "tomlarkworthy",
    name: "Tom Larkworthy",
    bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
    home_url: "https://taktile.com",
    type: "team",
    tier: "starter_2024"
  },
  creator: {
    id: "5215f6ec4a999d40",
    avatar_url:
      "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
    login: "tomlarkworthy",
    name: "Tom Larkworthy",
    bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
    home_url: "https://taktile.com",
    tier: "pro"
  },
  authors: [
    {
      id: "5215f6ec4a999d40",
      avatar_url:
        "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
      name: "Tom Larkworthy",
      login: "tomlarkworthy",
      bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
      home_url: "https://taktile.com",
      tier: "pro",
      approved: true,
      description: ""
    }
  ],
  collections: [
    {
      id: "cf72f19f55f3a048",
      type: "public",
      slug: "lopebook",
      title: "lopebook",
      description: "",
      update_time: "2024-10-11T18:10:59.078Z",
      pinned: false,
      ordered: false,
      custom_thumbnail: null,
      default_thumbnail: null,
      thumbnail: null,
      listing_count: 0,
      parent_collection_count: 0,
      owner: {
        id: "7db5ed2b0697d645",
        avatar_url:
          "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
        login: "tomlarkworthy",
        name: "Tom Larkworthy",
        bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
        home_url: "https://taktile.com",
        type: "team",
        tier: "starter_2024"
      }
    }
  ],
  files: [],
  comments: [],
  commenting_lock: null,
  suggestion_from: null,
  suggestions_to: [],
  version: 16,
  title: "Dependancy",
  license: null,
  copyright: "",
  nodes: [
    {
      id: 0,
      value: "# Dependancy",
      pinned: false,
      mode: "md",
      data: null,
      name: ""
    },
    {
      id: 7,
      value: 'dep = "a"',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 9,
      value: "viewof viewdep = Inputs.input()",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 11,
      value: "mutable mutabledep = ({})",
      pinned: false,
      mode: "js",
      data: null,
      name: null
    }
  ],
  resolutions: [],
  schedule: null,
  last_view_time: null
})
```

```js
dependancy_source = dependancy_document.nodes.map((s) => ({
  value: s.value,
  name: s.name
}))
```


```
curl https://api.observablehq.com/document/@tomlarkworthy/notebook-semantics
```

```js
notebook_semantics_document = ({
  id: "483a346021943f64",
  slug: "notebook-semantics",
  trashed: false,
  description: "",
  likes: 0,
  publish_level: "live_unlisted",
  forks: 0,
  fork_of: null,
  has_importers: false,
  update_time: "2025-03-17T18:36:45.520Z",
  first_public_version: 90,
  paused_version: null,
  publish_time: "2024-10-15T18:29:58.853Z",
  publish_version: 152,
  latest_version: 152,
  thumbnail: "10dc93e33f09bad8366c143415404f378b6bd94f1148589113ff5fb2d22573ee",
  default_thumbnail:
    "10dc93e33f09bad8366c143415404f378b6bd94f1148589113ff5fb2d22573ee",
  roles: [],
  sharing: null,
  edits: [
    { node_id: 48, value: 'file = FileAttachment("empty")' },
    { node_id: 55, value: "mutable_dep_2 = {\n  file;\n  return q + 1;\n}" },
    { node_id: 151, value: "thisReference = (this || 0) + 1" }
  ],
  owner: {
    id: "7db5ed2b0697d645",
    avatar_url:
      "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
    login: "tomlarkworthy",
    name: "Tom Larkworthy",
    bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
    home_url: "https://taktile.com",
    type: "team",
    tier: "starter_2024"
  },
  creator: {
    id: "5215f6ec4a999d40",
    avatar_url:
      "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
    login: "tomlarkworthy",
    name: "Tom Larkworthy",
    bio: "Tech Lead at Taktile. ex Firebase, Google.\n🦋 larkworthy.bsky.social",
    home_url: "https://bsky.app/profile/larkworthy.bsky.social",
    tier: "pro"
  },
  authors: [
    {
      id: "5215f6ec4a999d40",
      avatar_url:
        "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
      name: "Tom Larkworthy",
      login: "tomlarkworthy",
      bio: "Tech Lead at Taktile. ex Firebase, Google.\n🦋 larkworthy.bsky.social",
      home_url: "https://bsky.app/profile/larkworthy.bsky.social",
      tier: "pro",
      approved: true,
      description: ""
    }
  ],
  collections: [
    {
      id: "cf72f19f55f3a048",
      type: "public",
      slug: "lopebook",
      title: "lopecode",
      description: "",
      update_time: "2024-11-17T07:27:34.529Z",
      pinned: false,
      ordered: true,
      custom_thumbnail: null,
      default_thumbnail:
        "dab1604ccf4a760060379630da0876da27b79509b738f8d5c300c9a9a320e38a",
      thumbnail:
        "dab1604ccf4a760060379630da0876da27b79509b738f8d5c300c9a9a320e38a",
      listing_count: 9,
      parent_collection_count: 0,
      owner: {
        id: "7db5ed2b0697d645",
        avatar_url:
          "https://avatars.observableusercontent.com/avatar/47327a8bc1966f2186dcb3ebf4b7ee6e4e7ab9a5c2a07405aff57200ea778f71",
        login: "tomlarkworthy",
        name: "Tom Larkworthy",
        bio: "Tech Lead at Taktile.\nFormerly Firebase, Google",
        home_url: "https://taktile.com",
        type: "team",
        tier: "starter_2024"
      }
    }
  ],
  files: [
    {
      id: "50cad75d56578d08f50d560a50a6f4a66919f1f0b9c189221c6768a04dc958323335dac14ca3526e6527019d02e9e00d21d247eb5c2646b38ec7720e0ddcaa7e",
      url: "https://static.observableusercontent.com/files/50cad75d56578d08f50d560a50a6f4a66919f1f0b9c189221c6768a04dc958323335dac14ca3526e6527019d02e9e00d21d247eb5c2646b38ec7720e0ddcaa7e",
      download_url:
        "https://static.observableusercontent.com/files/50cad75d56578d08f50d560a50a6f4a66919f1f0b9c189221c6768a04dc958323335dac14ca3526e6527019d02e9e00d21d247eb5c2646b38ec7720e0ddcaa7e?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27empty",
      name: "empty",
      create_time: "2024-10-15T18:03:32.575Z",
      mime_type: "application/octet-stream",
      status: "public",
      size: 2,
      content_encoding: null,
      private_bucket_id: null
    }
  ],
  comments: [],
  commenting_lock: null,
  suggestion_from: null,
  suggestions_to: [],
  version: 152,
  title: "Test Notebook of Semantics",
  license: "mit",
  copyright: "Copyright 2024 Tom Larkworthy",
  nodes: [
    {
      id: 0,
      value: "# Test Notebook of Semantics",
      pinned: false,
      mode: "md",
      data: null,
      name: ""
    },
    { id: 9, value: "1", pinned: true, mode: "js", data: null, name: null },
    {
      id: 31,
      value: '{\n  ("");\n}',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 100,
      value: "<div>",
      pinned: false,
      mode: "html",
      data: null,
      name: "html"
    },
    {
      id: 115,
      value: "obj_literal = ({})",
      pinned: false,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 11,
      value: 'x = ""',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 13,
      value: "y = x",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 15,
      value: 'z = {\n  ("");\n  return x + y;\n}',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 145,
      value: 'comments = {\n  // a comment\n  return "";\n}',
      pinned: false,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 17,
      value: "generator = {\n  yield x + y;\n}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 20,
      value: "_function = function () {}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 71,
      value: "asyncfunction = async function () {}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 25,
      value: "named_function = function foo() {}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 151,
      value: "thisReference = (this || 0) + 1",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 22,
      value: "lambda = () => {}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 33,
      value: "error = {\n  throw new Error();\n}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 39,
      value: "viewof view = Inputs.input()",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 42,
      value: "mutable q = 6",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 45,
      value: "inbuilt = _",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 48,
      value: 'file = FileAttachment("empty")',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 52,
      value:
        "mutable_dep = {\n  viewof view;\n  lambda;\n  mutable q;\n  return mutable q;\n}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 55,
      value: "mutable_dep_2 = {\n  file;\n  return q + 1;\n}",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 57,
      value: "viewofdep_inline = viewof view",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    {
      id: 61,
      value: "viewofdatadep = view",
      pinned: true,
      mode: "js",
      data: null,
      name: null
    },
    { id: 93, value: "dep", pinned: true, mode: "js", data: null, name: null },
    {
      id: 64,
      value:
        'import {\n  dep,\n  mutable mutabledep,\n  viewof viewdep,\n  dep as dep_alias,\n  mutable mutabledep as aslias_mutabledep,\n  viewof viewdep as aslias_viewdep,\n  mutabledep as aslias_mutabledep_data,\n  viewdep as aslias_viewdep_data\n} from "@tomlarkworthy/dependancy";',
      pinned: true,
      mode: "js",
      data: null,
      name: null
    }
  ],
  resolutions: [],
  schedule: null,
  last_view_time: null
})
```

```js
notebook_semantics_source = notebook_semantics_document.nodes.map((s) => ({
  value: s.value,
  name: s.mode == "js" ? parser.parseCell(s.value)?.id?.name : null,
  mode: s.mode
}))
```

### Runtime Representation (v4)

```js
dependancy_module = import(
  "https://api.observablehq.com/@tomlarkworthy/dependancy.js?v=4"
)
```

```js
notebook_semantics_module = import(
  "https://api.observablehq.com/@tomlarkworthy/notebook-semantics.js?v=4"
)
```

```js
dependancy_runtime = {
  const runtime = new observable.Runtime();
  runtime.module(dependancy_module.default);
  return runtime;
}
```

```js
notebook_semantics_runtime = {
  dependancy_module;
  const runtime = new observable.Runtime();
  const module = runtime.module(
    notebook_semantics_module.default,
    observable.Inspector.into(document.createElement("div"))
  );
  await runtime._computeNow();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    runtime,
    module
  };
}
```

```js
notebook_semantics_variables = [
  ...notebook_semantics_runtime.runtime._variables
]
  .filter((v) => v._type == 1)
  .map(variableToObject)
```

```js
highlight(notebook_semantics_variables)
```

```js
notebook_define = notebook_semantics_module.default.toString()
```

```js
highlight(notebook_define)
```

### Cell map

`viewof` and `mutable` cells define more than one runtime variable, so we often need to group by their source cell label. imports also redefine many variables in a single cell.


```js
sourceModule = async (v) => {
  if (
    // imported variable is observed
    v._inputs.length == 1 && // always a single dependancy
    v._inputs[0]._module !== v._module // bridging across modules
  )
    return v._inputs[0]._module;

  // Import from API
  // 'async () => runtime.module((await import("/@tomlarkworthy/exporter.js?v=4&resolutions=ab5a63c64de95b0d@298")).default)'
  /*
  if (
    v._inputs.length == 0 &&
    v._definition.toString().includes("runtime.module((await import")
  ) {
    debugger;
    v._value = await v._definition();
    return v._value;
  }*/
  if (
    // imported variable unobserved and loaded by API
    v._inputs.length == 2 && // always a single dependancy
    v._inputs[1]._name == "@variable" // bridging across modules
  ) {
    if (v._inputs[0]._value) return v._inputs[0]._value;
    else {
      return;
      //const module = await v._inputs[0]._definition();
      //debugger;
      //return module;
    }
  }

  // The inline case for live notebook
  // _definition: "async t=>t.import(e.name,e.alias,await i)"
  if (
    v._inputs.length == 1 &&
    v._inputs[0]._name == "@variable" &&
    v._definition.toString().includes("import(")
  ) {
    if (v._name === "rag") {
      debugger;
      console.error("error: can't find source module for, skipping TODO", v);
      return;
    }
    return await new Promise((resolve, reject) =>
      v._definition({
        import: (...args) => resolve(args[2])
      })
    );
  }

  return null;
}
```

```js
cellMap = async (
  module,
  { excludeInbuilt = true, extraModuleLookup = new Map() } = {}
) => {
  const runtime = module._runtime;
  try {
    let c = 0;
    const viewofs = new Set();
    const mutables = new Set();
    const imports = new Map();

    const sources = new Map(
      await Promise.all(
        [...runtime._variables]
          .filter(
            (v) =>
              v._module == module &&
              (!excludeInbuilt || v._type == 1) &&
              v._name
          )
          .map(async (v) => [v._name, await sourceModule(v)])
      )
    );

    const moduleNamesPromises = new Map();

    const groups = [...runtime._variables]
      .filter((v) => v._module == module && (!excludeInbuilt || v._type == 1))
      .reduce((groups, v) => {
        if (v._name) {
          const source = sources.get(v._name);
          if (source) {
            if (!imports.has(source)) {
              imports.set(source, []);
              moduleNamesPromises.set(
                source,
                extraModuleLookup.get(source) ||
                  findModuleName(v._module._scope, source, {
                    unknown_id: v._name
                  })
              );
            }
            imports.get(source).push(v);
          } else if (v._name.startsWith("viewof ")) {
            viewofs.add(v);
            groups.set(v._name, []);
          } else if (v._name.startsWith("mutable ")) {
            mutables.add(v);
            groups.set(v._name, []);
          } else if (v._name.startsWith("module ")) {
            // skip these
          } else if (v._name.startsWith("dynamic ")) {
            // skip these
          } else {
            groups.set(v._name, [v]);
          }
        } else {
          groups.set(c++, [v]);
        }
        return groups;
      }, new Map());

    const moduleNames = new Map(
      await Promise.all(
        [...moduleNamesPromises.entries()].map(async ([k, v]) => [k, await v])
      )
    );
    for (const v of viewofs) {
      const name = v._name.substring(7);
      if (groups.has(name)) {
        groups.get(v._name).push(...[v, groups.get(name)[0]]);
        groups.delete(name);
      } else {
        groups.delete(v._name);
      }
    }

    for (const v of mutables) {
      const name = v._name.substring(8);
      const intital = "initial " + name;
      if (groups.has(name) && groups.has(intital)) {
        groups
          .get(v._name)
          .push(...[groups.get(intital)?.[0], v, groups.get(name)[0]]);
        groups.delete(intital);
        groups.delete(name);
      } else {
        groups.delete(v._name);
        groups.delete(intital);
        groups.delete(name);
      }
    }

    for (const [module, variables] of imports.entries()) {
      const name = `module ${moduleNames.get(module)}`;
      groups.set(name, variables);
    }

    return groups;
  } catch (e) {
    debugger;
    throw e;
  }
}
```

```js
semanticsCells = cellMap(notebook_semantics_runtime.module)
```

### Imports

observed modules are variables in the parent notebook, so their module is the main, however, their dependency is something else. -- this holds even for live notebook. They can only have one dependancy (inputs.length = 1)

### runtime in observable

## Test cases

```js
test_cases = {
  let anonIdx = 1; // hack to get things to align as we filtered by ".js" , test suite specific
  const testCases = notebook_semantics_source
    .filter((s) => s.mode == "js")
    .map((source) => {
      const comments = [],
        tokens = [];
      const ast = parser.parseCell(source.value, {
        ranges: true,
        onComment: comments,
        onToken: tokens
      });
      const prefix =
        ast?.id?.type == "ViewExpression"
          ? "viewof "
          : ast?.id?.type == "MutableExpression"
          ? "mutable "
          : "";
      const importName =
        ast.body.type == "ImportDeclaration" &&
        "module @tomlarkworthy/dependancy";
      const name = ast.id?.name || ast?.id?.id?.name || importName || anonIdx++;
      const variables = semanticsCells.get(
        typeof name === "string" ? prefix + name : name
      );
      return {
        ast,
        name,
        source: {
          name: source.name,
          value: source.value
        },
        normalizeSource: source && normalizeObservableSource(source.value),
        variables
      };
    });
  return testCases;
}
```

```js
highlight(test_cases)
```

```js
viewof decompilationSuite = createSuite({
  name: "Decompilation Test Cases"
})
```

```js echo
decompilationSuite.test("@variable support", async () => {
  const decompiled = await decompile([
    {
      _name: "v",
      _definition: "function _x($variable) {return ($variable);}",
      _inputs: [
        {
          _name: "@variable"
        }
      ]
    }
  ]);
  expect(decompiled).toEqual("v = $variable");
})
```

```js
viewof decompilationResults = decompilationSuite.viewofResults
```

```js echo
decompilation_test_results = decompilationResults && report(decompilationSuite)
```

```js
reference_decompilation_cases = ({
  prompt: "Write a declarative testing interface",
  time: 1726339624075
} &&
  Promise.all(
    test_cases.map(({ name, source, variables, normalizeSource }, i) => {
      return decompilationSuite.test(name || `test-${i}`, async (done) => {
        await expect(await decompile(variables)).toEqual(normalizeSource);
        done();
      });
    })
  ))
```

```js
highlight(decompilation_test_results)
```

```js echo
// Bug in escodegen https://github.com/estools/escodegen/pull/467
test_decompile_class_with_property = decompile([
  {
    _inputs: [],
    _definition: `function _Cls(){return(
        class Cls {
          d;
        }
    )}`
  }
])
```

### The Decompiler

```js
import { escodegen } from "@tomlarkworthy/escodegen"
```

```js
viewof decompileObservableVariableSelection = Inputs.select(
  notebook_semantics_variables.map((s) => s._definition),
  { label: "decompile case", value: "1" }
)
```

```js
decompileObservableVariableSelection
```

```js
decompileVariable = notebook_semantics_variables.find(
  (v) => v._definition == decompileObservableVariableSelection
)
```

```js echo
decompiled_example = {
  return decompile([decompileVariable]);
}
```

```js
function extractModuleInfo(str) {
  const named = /@([^/]+)\/([^.]+)\.js\?v=\d+(?:&resolutions=[^@]+@(\d+))?/;
  const matchNamed = str.match(named);

  if (matchNamed) {
    const namespace = matchNamed[1];
    const notebook = matchNamed[2];
    const version = matchNamed[3];
    return { namespace, notebook, version };
  }
  const id = /\/?d\/([^@]+)@?(\d+)/;
  const matchId = str.match(id);

  if (matchId) {
    const notebook = matchId[1];
    const version = matchId[2];
    return { id: notebook, version };
  }

  const lopebook = /"@([^/]+)\/([^"]+)"/;
  const lopebookId = str.match(lopebook);

  if (lopebookId) {
    const namespace = lopebookId[1];
    const notebook = lopebookId[2];
    return { namespace, notebook };
  }

  return {};
}
```

```js echo
extractModuleInfo_test_1 = extractModuleInfo(
  'async () => runtime.module((await import("/@tomlarkworthy/whisper-input.js?v=4&resolutions=03dda470c56b93ff@4883")).default)'
)
```

```js echo
extractModuleInfo_test_2 = extractModuleInfo(
  'async () => runtime.module((await import("/d/c2dae147641e012a@46.js?v=4&resolutions=03dda470c56b93ff@4883")).default)'
)
```

```js echo
extractModuleInfo_test_3 = extractModuleInfo(
  'async () => runtime.module((await import("d/58f3eb7334551ae6@215")).default)'
)
```

```js echo
extractModuleInfo_test_4 = extractModuleInfo(
  'await import("https://api.observablehq.com/@tomlarkworthy/observable-notes.js?v=4"'
)
```

```js
import_ast_example = parser.parseCell(
  'import {runtime, viewof main as foo} from "@mootari/access-runtime"'
)
```

```js
findModuleName = (scope, module, { unknown_id = Math.random() } = {}) => {
  try {
    const scopedVariables = [...scope.values()];
    const moduleVariables = scopedVariables.filter((v) => v._module == module);
    // Look for module definition cell
    const module_definition_variable = scopedVariables.find((v) => {
      if (v._value == module) {
        const dfn = v._definition.toString();
        const info = extractModuleInfo(dfn);
        if (info.id || info.notebook) {
          return true;
        }
      }
      return false;
    });
    if (module_definition_variable) {
      const dfn = module_definition_variable._definition.toString();
      const info = extractModuleInfo(dfn);
      if (info.namespace) {
        return `@${info.namespace}/${info.notebook}`;
      } else if (info.id) {
        return `d/${info.id}@${info.version}`;
      } else {
        debugger;
      }
    }
    return `<unknown ${unknown_id}>`;
  } catch (e) {
    debugger;
    return "error";
  }
}
```

```js
findImportedName = async (v) => {
  if (v._inputs.length == 1 && v._inputs[0]._name === "@variable") {
    // import in a live-notebook hides the alias in a closure
    let capture;
    await v._definition({ import: (...args) => (capture = args) });
    return capture[0];
  }
  if (v._inputs.length == 1) {
    return v._inputs[0]._name;
  }
  const regex = /v\.import\("([^"]+)",\s*"([^"]+)"/;
  const match = v._definition.toString().match(regex);
  if (match) {
    // Handle two cases (two arguments)
    return match[1];
  }
  return v._name;
}
```

```js echo
decompile = ({ prompt: "fix tests", time: 1726546383668 } &&
  async function decompile(variables) {
    // Non-import cases
    if (!variables || variables.length == 0)
      throw new Error("no variables to decompile");

    try {
      // Import cases
      if (
        variables[0]._inputs.length == 1 &&
        variables[0]._module !== variables[0]._inputs[0]._module
      ) {
        const module_name = findModuleName(
          variables[0]._module._scope,
          variables[0]._inputs[0]._module
        );
        const import_aliasses = await Promise.all(
          variables.map(async (v) => {
            const importedName = await findImportedName(v);
            return importedName == v._name
              ? v._name
              : `${importedName} as ${v._name}`;
          })
        );
        return `import {${import_aliasses.join(", ")}} from "${module_name}"`;
      }

      const variable = variables[0];

      const name = variable._name;
      const compiled =
        typeof variable._definition == "string"
          ? variable._definition
          : variable._definition.toString();
      const inputs = variable._inputs.map((i) =>
        typeof i == "string" ? i : i._name
      );
      const wrappedCode = "(" + compiled + ")";
      const comments = [],
        tokens = [];
      let parsed = acorn.parse(wrappedCode, {
        ecmaVersion: 2022,
        sourceType: "module",
        ranges: true,
        onComment: comments,
        onToken: tokens
      });
      parsed = escodegen.attachComments(parsed, comments, tokens);

      const functionExpression = parsed.body[0].expression;
      const body = functionExpression.body;

      let varName = name;
      let prefix = "";

      // Handle special variables
      if (name) {
        if (name.startsWith("initial ")) {
          prefix = "mutable ";
          varName = name.replace(/^initial /, "");
        } else if (name.startsWith("mutable ")) {
          prefix = "mutable ";
          varName = name.replace(/^mutable /, "");
        } else if (name.startsWith("viewof ")) {
          prefix = "viewof ";
          varName = name.replace(/^viewof /, "");
        }
      }

      let expression = "";
      if (
        body.type === "BlockStatement" &&
        body.body.length === 1 &&
        body.body[0].type === "ReturnStatement" &&
        comments.length == 0
      ) {
        // If the body is a single ReturnStatement, decompile its argument
        if (wrappedCode[body.body[0].argument.start] == "{") {
          // bugfix if the body is an object literal we need to escape it
          expression = `(${escodegen.generate(body.body[0].argument, {
            comment: true
          })})`;
        } else {
          expression = escodegen.generate(body.body[0].argument, {
            comment: true
          });
        }
      } else {
        // For other types, decompile the whole body
        expression = escodegen.generate(body, { comment: true });
      }
      let source = `${varName ? `${prefix}${varName} = ` : ""}${expression}`;

      // replace mutable and viewofs
      let id = 0;
      inputs.forEach((input, idx) => {
        if (input.startsWith("mutable ")) {
          source = source.replaceAll(`$${id++}.value`, input);
        } else if (input.startsWith("viewof ")) {
          source = source.replaceAll(`$${id++}`, input);
        } else if (input == "@variable") {
          source = source.replaceAll(`$${id++}`, input);
        }
      });
      return source;
    } catch (e) {
      debugger;
      throw e;
    }
  })
```

## Javascript Source Normalization

```js
viewof normalizeJavascriptSourceSelector = Inputs.select(
  notebook_semantics_variables.map((s) => s._definition),
  {
    label: "variable source",
    value: notebook_semantics_variables[5]._definition
  }
)
```

```js
normalizeJavascriptSource = (source) => {
  var comments = [];
  var tokens = [];

  var ast = acorn.parse(source, {
    ranges: true,
    onComment: comments,
    onToken: tokens
  });

  escodegen.attachComments(ast, comments, tokens);
  return escodegen.generate(ast, {
    comment: true
  });
}
```

```js echo
{
  return normalizeJavascriptSource(normalizeJavascriptSourceSelector);
}
```

```js
normalizeVariables = (variables) =>
  variables.map(variableToObject).map((v) => ({
    ...v,
    _definition: normalizeJavascriptSource(v._definition)
  }))
```

```js
variableToObject = (v) => ({
  _name: v._name,
  _definition: v._definition.toString(),
  _inputs: v._inputs.map((v) => v._name || v)
})
```

## Observable Source Normalization

```js
viewof normalizeObservableSourceSelector = Inputs.select(
  notebook_semantics_source.map((s) => s.value),
  { label: "test case", value: "1" }
)
```

```js
{
  debugger;
  return normalizeObservableSource(normalizeObservableSourceSelector);
}
```

```js
parsed = parser.parseCell(normalizeObservableSourceSelector)
```

```js
function generate(node, source) {
  if (node.type == "Cell") {
    if (
      node.body.type != "BlockStatement" &&
      source &&
      source[node.body.start] == "{"
    ) {
      return `${node.id ? `${generate(node.id)} = ` : ""}(${escodegen.generate(
        node.body
      )})`;
    } else {
      return `${node.id ? `${generate(node.id)} = ` : ""}${escodegen.generate(
        node.body
      )}`;
    }
  } else if (node.type == "Identifier") {
    return escodegen.generate(node);
  } else if (node.type == "ViewExpression") {
  } else {
    throw node.type;
  }
}
```

```js
normalizeObservableSource = ({
  prompt:
    'I see some of the test are failing because the AST generator uses a different set of quotes than the original source and various formatting quirks. This should not count as failure. I would suggest normalizing. Its not super easy because source code is not vanilla JS, we need to normalize just the bit after the block expression, and replace the "viewof XX" and "mutable XXX" macros with a placeholder whic we can normalize and then undo. Write the normalizeObservableSource.',
  time: 1729097489369
} &&
  function normalizeObservableSource(source) {
    // Replace viewof and mutable with placeholders
    const viewofRegex = /viewof\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    const mutableRegex = /mutable\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;

    // Temporary placeholders
    const VIEWOF_PLACEHOLDER = "__VIEWOF_PLACEHOLDER__";
    const MUTABLE_PLACEHOLDER = "__MUTABLE_PLACEHOLDER__";

    // Maps to store original names
    const viewOfMap = new Map();
    const mutableMap = new Map();

    // Replace viewof XX with placeholder and store mapping
    source = source.replace(viewofRegex, (match, p1) => {
      const placeholder = `${VIEWOF_PLACEHOLDER}_${p1}`;
      viewOfMap.set(placeholder, p1);
      return placeholder;
    });

    // Replace mutable XXX with placeholder and store mapping
    source = source.replace(mutableRegex, (match, p1) => {
      const placeholder = `${MUTABLE_PLACEHOLDER}_${p1}`;
      mutableMap.set(placeholder, p1);
      return placeholder;
    });

    // Normalize quotes: convert all to single quotes
    const comments = [],
      tokens = [];
    const cell = parser.parseCell(source, {
      ranges: true,
      onComment: comments,
      onToken: tokens
    });
    

    source = generate(cell, source);

    // Restore original viewof and mutable identifiers
    viewOfMap.forEach((original, placeholder) => {
      source = source.replaceAll(placeholder, `viewof ${original}`);
    });

    mutableMap.forEach((original, placeholder) => {
      source = source.replaceAll(placeholder, `mutable ${original}`);
    });

    return source;
  })
```

## The Compiler



```js
viewof compilationSuite = createSuite({
  name: "Compilation Test Cases"
})
```

```js
compilationSuite.test("compiling preserves comments", async () => {
  const source = notebook_semantics_source.find(
    (s) => s.name === "comments"
  ).value;
  const compiled = await compile(source);
  expect(compiled[0]._definition.toString()).toContain("a comment");
})
```

```js
compilationSuite.test("class support", async () => {
  const compiled = compile("class foo {}")[0];
  expect(compiled._definition.toString()).toEqual(
    "function _foo() {return (class foo {\n});}"
  );
  expect(compiled._inputs).toEqual([]);
})
```

```js
compilationSuite.test(
  "@variable support, $variable is mapped to @variable dependancy",
  async () => {
    const compiled = compile("x = $variable")[0];
    expect(compiled._definition.toString()).toEqual(
      "function _x($variable) {return ($variable);}"
    );
    expect(compiled._inputs).toEqual(["@variable"]);
  }
)
```

```js
viewof compilationResults = compilationSuite.viewofResults
```

```js
compilation_test_results = compilationResults && report(compilationSuite)
```

```js
highlight(compilation_test_results)
```

```js echo
({ prompt: "Write tests for the compile", time: 1726339624075 } &&
  Promise.all(
    test_cases.map(({ name, source, variables, normalizeSource }, i) => {
      return compilationSuite.test(name || `test-${i}`, async (done) => {
        await expect(
          normalizeVariables(
            await compile(source.value, { anonymousName: `_${i + 2}` })
          )
        ).toEqual(normalizeVariables(variables));
        done();
      });
    })
  ))
```

```js echo
test_async_interpolation = eval(
  "let _fn = " +
    compile("md`${await FileAttachment('image@1.png').url() }`")[0]._definition
)
```

```js echo
{
  debugger;
  compile("md`${await FileAttachment('image@1.png').url() }`")[0];
}
```

```js
viewof compilerSourceSelector = Inputs.select(
  notebook_semantics_source.map((s) => s.value),
  { label: "compilation test case", value: "1" }
)
```

```js
test_case = test_cases.find(
  (test) => test.source.value == compilerSourceSelector
)
```

```js
compiled = await compile(test_case.source.value)
```

```js
{
  const comments = [];
  const tokens = [];
  const ast = parser.parseCell(test_case.source.value, {
    ranges: true,
    onComment: comments,
    onToken: tokens
  });

  return {
    ast,
    comments,
    tokens
  };
}
```

```js echo
viewof compiled_selector = Inputs.radio(compiled, {
  format: (v) => v._name,
  value: compiled[0]
})
```

```js
JSON.stringify(
  {
    ...compiled_selector,
    _definition: normalizeJavascriptSource(compiled_selector._definition)
  },
  null,
  2
)
```

```js
compile(test_case.source.value)
```

```js echo
normalizeVariables(test_case.variables)[0]._definition
```

```js
singleCompileTest = {
  try {
    const compiled = await compile(test_case.source.value);
    return expect(normalizeVariables(compiled)).toEqual(
      normalizeVariables(test_case.variables)
    );
  } catch (e) {
    return e;
  }
}
```

```js
highlight(singleCompileTest || "OK")
```

```js echo
compile = ({ prompt: "fix the singleCompileTest", time: 1729232320503 } &&
  function compile(source, { anonymousName = "_anonymous" } = {}) {
    // Parse the cell using the Observable parser
    const comments = [],
      tokens = [];
    const cell = parser.parseCell(source, {
      ranges: true,
      onComment: comments,
      onToken: tokens
    });
    let dollarIdx = 0;
    const inputToArgMap = {};
    const dollarToMacro = {};
    // references contain all source references, so expect duplication
    const inputs = Array.from(cell.references || []).flatMap((i) => {
      if (i.name) {
        if (inputToArgMap[i.name]) return [];
        inputToArgMap[i.name] = i.name;
        return i.name;
      } else {
        if (inputToArgMap[i.id.name]) return [];
        const dollarName = "$" + dollarIdx;
        inputToArgMap[i.id.name] = dollarName;
        dollarToMacro[dollarName] =
          i.type == "ViewExpression"
            ? "viewof " + i.id.name
            : "mutable " + i.id.name;
        dollarIdx++;
        return dollarName;
      }
    });

    // Determine the function name
    let variables;
    if (cell.id) {
      if (cell.id.type === "Identifier") {
        variables = [
          {
            functionName: "_" + cell.id.name,
            name: cell.id.name,
            inputs,
            params: inputs.join(",")
          }
        ];
      } else if (cell.id.type === "ViewExpression") {
        variables = [
          {
            functionName: "_" + cell.id.id.name,
            name: "viewof " + cell.id.id.name,
            inputs,
            params: inputs.join(",")
          },
          {
            functionName: "_" + cell.id.id.name,
            name: cell.id.id.name,
            _definition: "(G, _) => G.input(_);",
            inputs: ["Generators", "viewof " + cell.id.id.name],
            params: inputs.join(",")
          }
        ];
      } else if (cell.id.type === "MutableExpression") {
        variables = [
          {
            functionName: "_" + cell.id.id.name,
            name: "initial " + cell.id.id.name,
            inputs,
            params: inputs.join(",")
          },
          {
            functionName: "_" + cell.id.id.name,
            name: "mutable " + cell.id.id.name,
            _definition: "(M, _) => new M(_);",
            inputs: ["Mutable", "initial " + cell.id.id.name],
            params: inputs.join(",")
          },
          {
            functionName: "_" + cell.id.id.name,
            name: cell.id.id.name,
            _definition: "_ => _.generator;",
            inputs: ["mutable " + cell.id.id.name],
            params: inputs.join(",")
          }
        ];
      }
    } else {
      // For anonymous cells
      variables = [
        {
          functionName: anonymousName,
          name: null,
          inputs,
          params: inputs.join(",")
        }
      ];
    }

    // Generate code for the function body
    return variables.map((v) => {
      let _definition = v._definition;

      if (!_definition) {
        let functionBody;
        if (cell.body.type === "BlockStatement") {
          // For BlockStatement, use the block directly
          functionBody = observableToJs(
            cell.body,
            inputToArgMap,
            comments,
            tokens
          );
        } else {
          // For other expressions, wrap in return ()
          const bodyCode = observableToJs(
            cell.body,
            inputToArgMap,
            comments,
            tokens
          );
          functionBody = `{return (${bodyCode});}`;
        }

        // Construct the function definition
        _definition = `${cell.async ? "async " : ""}function${
          cell.generator ? "*" : ""
        } ${v.functionName}(${v.inputs.map(
          (i) => inputToArgMap[i] || i
        )}) ${functionBody}`;
      }

      return {
        _name: v.name,
        _inputs: v.inputs.map(
          (i) => dollarToMacro[i] || (i == "$variable" ? "@variable" : i)
        ),
        _definition: _definition
      };
    });
  })
```

```js echo
observableToJs = (ast, inputMap, comments, tokens) => {
  // Replace ViewExpression with their id so they are removed from
  // source and replaced with a JS compatible one
  const offset = 0;
  acorn_walk.ancestor(
    ast,
    {
      ViewExpression(node, ancestors) {
        const reference = "viewof " + node.id.name;
        node.type = "Identifier";
        node.name = inputMap[node.id.name];
      },
      MutableExpression(node, ancestors) {
        const reference = "mutable " + node.id.name;
        node.type = "Identifier";
        // hack as ".value" is not valid identifier, but escodegen allows it
        node.name = inputMap[node.id.name] + ".value";
      }
    },
    parser.walk
  );
  escodegen.attachComments(ast, comments, tokens);
  const js = escodegen.generate(ast, { comment: true });
  return js;
}
```

### Bundled deps

```js
decompress_url = async (attachment, overrides) => {
  let decompressedStream;

  if (!overrides) {
    decompressedStream = (await attachment.stream()).pipeThrough(
      new DecompressionStream("gzip")
    );
  } else {
    decompressedStream = (await attachment.stream())
      .pipeThrough(new DecompressionStream("gzip"))
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            // Rewrite URLs in the text
            let modifiedChunk = chunk;
            Object.entries(overrides).forEach(([override, replacement]) => {
              modifiedChunk = modifiedChunk.replace(override, replacement);
            });
            controller.enqueue(modifiedChunk);
          }
        })
      )
      .pipeThrough(new TextEncoderStream());
  }
  const arrayBuffer = await new Response(decompressedStream).arrayBuffer();

  // Create a Blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: "application/javascript" });

  return URL.createObjectURL(blob);
}
```

```js
parser = import(
  await decompress_url(FileAttachment("parser-6.1.0.js.gz"), {
    "/npm/acorn@8.11.3/+esm": acorn_url,
    "/npm/acorn-walk@8.3.2/+esm": acorn_walk_url
  })
)
```

```js
acorn_walk = import(acorn_walk_url)
```

```js
acorn = import(acorn_url)
```

```js
acorn_walk_url = decompress_url(FileAttachment("acorn-walk-8.3.2.js.gz"))
```

```js
acorn_url = decompress_url(FileAttachment("acorn-8.11.3.js.gz"))
```

```js
import { createSuite, report, expect } from "@tomlarkworthy/testing"
```

### AI Assitant

```js
import {
  ask,
  excludes,
  cells,
  on_prompt,
  variables,
  api_call_response,
  background_tasks,
  instruction,
  highlight,
  mutable context,
  viewof prompt,
  viewof suggestion,
  viewof settings,
  viewof OPENAI_API_KEY,
  viewof api_endpoint,
  viewof context_viz
} from "@tomlarkworthy/robocoop"
```

```js
viewof prompt
```

```js
Inputs.button("copy code", {
  reduce: () => {
    navigator.clipboard.writeText(suggestion);
  }
})
```

```js
viewof suggestion
```

## Current Chat context
code is automatically added to the context. Use `highlight(<expr>)` to selectively bring runtime values into the context as well

```js
viewof context_viz
```

### AI Settings

```js
viewof OPENAI_API_KEY
```

```js
viewof api_endpoint
```

```js
viewof settings
```

```js
observable_js_skill = ({
  prompt: "Explain the Observablehq programming model",
  time: 1700163368139
} &&
  html`<h2>Observable Programming Skill</h2>
<details>
  ${md`
The JavaScript dialect used in Observable notebooks is almost—but not entirely—vanilla. This is intentional: by building on the native language of the web, Observable is familiar. And you can use the libraries you know and love, such as D3, Lodash, and Apache Arrow. Yet for dataflow, Observable needed to change JavaScript in a few ways.

> **Note**  
> Observable JavaScript is used in notebooks only. Observable Framework uses vanilla JavaScript.

Here's a quick overview of what's different from vanilla.

## Cells are Separate Scripts

Each cell in a notebook is a separate script that runs independently. A syntax error in one cell won't prevent other cells from running.

~~~javascript
// Example of a syntax error in a cell
This is English, not JavaScript.
~~~

~~~javascript
// Example of a valid cell assignment
myCell = "some string"
~~~

~~~javascript
// Example of a runtime error in a cell
{ throw new Error("oopsie"); }
~~~

Even if one cell has a syntax or runtime error, it does not affect the execution of other cells.

Local variables are only visible to the cell that defines them. For example:

~~~javascript
// Defining a local variable in one cell
{ const local = "I am a local variable."; }
~~~
  
~~~javascript
// Attempting to use the local variable in another cell
local // not defined
~~~

The second cell above will cause a runtime error because \`local\` is not defined in that cell's scope.

## Cells Run in Topological Order

In vanilla JavaScript, code runs from top to bottom. Not so here; Observable runs like a spreadsheet, so you can define your cells in whatever order makes sense.

~~~javascript
// Using a variable defined in a later cell
a + 2 // a is defined below
~~~

~~~javascript
// Defining the variable 'a'
a = 1
~~~

You can define cells in any order you like. Here, \`a\` is successfully used as a variable in the cell before it is defined. However, circular definitions are not allowed:

~~~javascript
// Circular reference causing an error
c1 = c2 - 1
c2 = c1 + 1
~~~

Both \`c1\` and \`c2\` will throw a runtime error due to circular definition.

## Cells Re-run When Any Referenced Cell Changes

You don't have to run cells explicitly when you edit or interact—the notebook updates automatically. If a cell allocates resources that won't be automatically cleaned up by the garbage collector, such as an animation loop or event listener, use the \`invalidation\` promise to dispose of these resources manually and avoid leaks.

~~~javascript
// Using the invalidation promise for cleanup
{ invalidation.then(() => console.log("I was invalidated.")); }
~~~

## Cells Implicitly Await Promises

Cells can contain promises, and referencing cells will implicitly wait for these promises to resolve before running:

~~~javascript
// Defining a cell with a promise
hello = new Promise(resolve => {
  setTimeout(() => {
    resolve("hello there");
  }, 30000);
})
~~~

Referencing cells will wait for \`hello\` to resolve before they execute.

## Cells Implicitly Iterate Over Generators

If a cell yields, any referencing cell will see the most recently yielded value.

~~~javascript
// Using a generator with yield statements
c = {
  yield 1;
  yield 2;
  yield 3;
}
~~~

~~~javascript
// Referencing the generator cell
c
~~~

Referencing \`c\` will return the most recently yielded value, which in this example would be \`3\`.

## Named Cells are Declarations, Not Assignments

Named cells look like, and function almost like, assignment expressions in vanilla JavaScript. But cells can be defined in any order, so think of them as hoisted function declarations.

~~~javascript
// Trying to reassign a cell's value
foo = 2
{ foo = 3 } // SyntaxError: Assignment to constant variable foo
~~~

Cell names must also be unique, and you cannot reassign the value of another cell without using \`mutable\` variables.

## Statements Need Curly Braces, and Return or Yield

A cell body can be a simple expression, such as a number or string literal, or a function call. But for statements like loops, you'll need curly braces and a \`return\` statement to give the cell a value.

~~~javascript
// Using a block statement with a return
{
  let sum = 0;
  for (let i = 0; i < 10; ++i) {
    sum += i;
  }
  return sum;
}
// Output: 45
~~~

## Object Literals Need Parentheses or Return

Wrap object literals in parentheses or use a block statement with a \`return\` to ensure they are interpreted correctly.

~~~javascript
// Correctly defining object literals
object = ({ foo: "bar" })

block = { return { foo: "bar" }; }
~~~

Without parentheses or \`return\`, the cell would interpret the object literal incorrectly, leading to undefined behavior.

~~~javascript
// Incorrectly defining an object literal
label = { foo: "bar" }
// Output: undefined
~~~

## Cells Can Be Views

Observable has a special \`viewof\` operator which lets you define interactive values. A view is a cell with two faces: its user interface, and its programmatic value.

~~~javascript
// Using viewof to create an interactive text input
viewof text = html\`<input value="edit me">\`

// Accessing the value of 'text'
text
// Output: "edit me"
~~~

## Cells Can Be Mutables

Observable provides the \`mutable\` operator so you can opt into mutable state:

~~~javascript
// Defining and using a mutable variable
mutable thing = 0

// Mutating the value of \'thing\'
++mutable thing
// Output: 1
~~~

## Observable Has a Standard Library

Observable provides a small standard library for essential features, such as a reactive width and Inputs.

## Cells Can Be Imported from Other Notebooks

You can import any named cell from any Obserable notebooks, with syntax similar to static ES imports.

~~~javascript
// Importing the 'ramp' function from another notebook
import { ramp } from "@mbostock/ramp"

// Using the imported 'ramp' function
ramp(d3.interpolateBrBG)
~~~

## Static ES Imports Are Not Supported; Use Dynamic Imports

You cannot use normal static ES imports. To use the vanilla JS ecosystem, dynamically import modules from\`esm.sh\` or \`skypack\`.

~~~javascript
// Dynamically importing lodash
_ = import("https://cdn.skypack.dev/lodash-es@4")

// Using lodash function
_.camelCase("lodash was here")
// Output: "lodashWasHere"
~~~

This completes the overview of Observable's programming model, including specific behaviors and differences from standard JavaScript, emphasizing interactivity, reactivity, and cell independence.
`}
</details>
`)
```

---

```js echo
ask
```

```js echo
api_call_response
```

```js
background_tasks
```

```js
//import { footer } from "@tomlarkworthy/footer"  
```

```js
//footer
```
