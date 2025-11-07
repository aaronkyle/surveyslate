# Module map



```js
visualizeModules()
```

Figures out the import structure of a runtime, just pass a runtime to the function `moduleMap` to get a summary of the modules. Returns a map indexed by a Module object to a record.

```
module -> {
  type: "notebook import" | "module variable",
  name: <module name>,
  module: <module object ref>
  ...
}
```

```js
moduleMap = async (_runtime = runtime) => {
  keepalive(myModule, "submit_summary");
  keepalive(myModule, "sync_modules");
  return await viewof queue.send(_runtime);
}
```

### Example

```js
viewof vars = variables(runtime)
```

```js
sync_modules = {
  vars;
  const latest = await moduleMap();
  let dirty = false;
  for (let [module, info] of latest) {
    if (!viewof currentModules.value.has(module)) {
      dirty = true;
    }
  }
  viewof currentModules.value = latest;
  if (dirty) {
    viewof currentModules.dispatchEvent(new Event("input"));
  }
}
```

```js
viewof currentModules = Inputs.input(await moduleMap())
```

```js
Inputs.table([...currentModules.values()], {
  format: {
    dom: (d) => d.innerHTML,
    specifiers: JSON.stringify,
    variable: (v) => v._name
  }
})
```

### Random helpers

```js
visualizeModules = () => {
  const modules = [...currentModules.values()];
  const layout = (state, index) => [
    ...d3.pointRadial((index * 2 * Math.PI) / modules.length, 100),
    (index * 360) / modules.length
  ];
  const nodes = new Map(modules.map((m, i) => [m.name, layout(m, i)]));

  const edges = modules.flatMap(
    (from, i) =>
      (from.dependsOn &&
        from.dependsOn.map((to, j) => [
          [from.name, nodes.get(from.name)],
          [to, nodes.get(to)]
        ])) ||
      []
  );
  return Plot.plot({
    inset: 200,
    aspectRatio: 1,
    axis: null,
    marks: [
      Plot.arrow(edges, {
        x1: ([[, [x1]]]) => x1,
        y1: ([[, [, y1]]]) => y1,
        x2: ([, [, [x2]]]) => x2,
        y2: ([, [, [, y2]]]) => y2,
        bend: true,
        strokeOpacity: 0.5,
        //strokeWidth: ([, , value]) => value,
        strokeLinejoin: "miter",
        headLength: 3,
        inset: 5
      }),
      Plot.text(
        [...nodes.entries()].filter(([k, c]) => c[2] > 180),
        {
          textAnchor: "end",
          x: ([k, c]) => c[0],
          y: ([k, c]) => c[1],
          rotate: ([k, c]) => -c[2] - (c[2] > 180 ? 90 : -90),
          text: ([k, c]) => k
        }
      ),
      Plot.text(
        [...nodes.entries()].filter(([k, c]) => c[2] <= 180),
        {
          textAnchor: "start",
          x: ([k, c]) => c[0],
          y: ([k, c]) => c[1],
          rotate: ([k, c]) => -c[2] - (c[2] > 180 ? 90 : -90),
          text: ([k, c]) => k
        }
      )
    ]
  });
}
```

```js
viewof myModule = thisModule()
```

```js
tag = Symbol()
```

```js
forcePeek = {
  //console.log("force peek");
  return (variable, { forever = false } = {}) => {
    if (variable._value) return variable._value;
    let peeker;
    const promise = new Promise((resolve) => {
      peeker = variable._module.variable({}).define([variable._name], (m) => {
        resolve(m);
      });
    });
    if (!forever) promise.then((v) => peeker.delete());
    return promise;
  };
}
```

```js
observe = (module, variable_name, observer) => {
  const variable = module
    .variable(observer)
    .define(`dynamic observe ${variable_name}`, [variable_name], (m) => m);
  return () => variable.delete();
}
```

### Implementation

```js
viewof queue = flowQueue({ timeout_ms: 15000 })
```

```js
queue
```

We resolve what we can using variables named with prefix `module` that hold module values. We `forcePeek` the variables to make them resolve, which forces loading of the modules.

```js
module_definition_variables = {
  console.log("module_definition_variables");
  notebookImports;
  queue;
  let last_module_count = -1;
  let module_definition_variables = [];
  while (last_module_count < module_definition_variables.length) {
    last_module_count = module_definition_variables.length;
    module_definition_variables = await Promise.all(
      [...queue._variables]
        .filter((v) => v._name && v._name.startsWith("module "))
        .filter((v) => !v._name.startsWith("module <unknown"))
        .map(async (v) => {
          await forcePeek(v); // force module to load, may cause others to load
          return v;
        })
    );
  }
  return module_definition_variables;
}
```

```js
modules = {
  console.log("modules");
  module_definition_variables;
  return [...queue._modules.values()];
}
```

```js
resolve_modules = {
  console.log("resolve_modules");
  const module_definitions = new Map();
  const unresolved = [];
  modules.forEach((m) => {
    const md = module_definition_variables.find((md) => md._value == m);
    if (md) {
      if (md._name == "module @tomlarkworthy/observable-notes") {
        debugger;
      }
      module_definitions.set(m, {
        type: "module variable",
        name: findModuleName(md._module._scope, m),
        variable: md
      });
    } else {
      unresolved.push(m);
    }
  });
  return { module_definitions, unresolved };
}
```

modules imported via notebook imports do not have module variables, so they are trickier to figure out. We can sniff the page DOM to find the import expressions, and try to map them to the modules we could to resolve earlier

```js
notebookImports = {
  console.log("notebookImports");
  main;
  return new Map(
    [...document.querySelectorAll(".observablehq--import")]
      .map((dom) => [dom, parser.parseCell(dom.textContent)])
      .map(([dom, node]) => [
        dom.parentElement,
        node.body.specifiers.map((s) => ({
          name: node.body.source.value,
          dom: dom.parentElement,
          ast: s,
          local: s.local.name,
          imported: s.imported.name
        }))
      ])
  );
}
```

```js
notebookImportVariables = {
  console.log("notebookImportVariables");
  return [
    ...[...runtime._variables] // Observable DOM nodes are referenced in runtime variables
      .filter(
        (v) =>
          v._observer &&
          v._observer._node &&
          notebookImports.get(v._observer._node)
      )
      .map((v) => ({
        variable: v,
        notebookImports: notebookImports.get(v._observer._node)
      })),
    ...[
      ...[...notebookImports.entries()] // visualizer DOM nodes have the variable attached
        .filter(([pi, vars]) => pi.variable)
        .map(([pi, vars]) => ({
          variable: pi.variable,
          notebookImports: vars
        }))
    ]
  ].sort((a, b) => b.notebookImports.length - a.notebookImports.length); // sort by complexity
}
```

```js
pageImportMatch = async (notebookImportVariables, modules) => {
  console.log("pageImportMatch");
  const backupHas = Map.prototype.has; // Save the original `has` method on Map.prototype

  let currentImport = undefined;
  const matches = new Map();
  // Override `Map.prototype.has` to intercept calls to `has` on any Map instance
  Map.prototype.has = function (...args) {
    const module = modules.find((m) => m._scope == this);
    if (currentImport && module) {
      matches.set(module, {
        type: "notebook import",
        name: currentImport.notebookImports[0].name,
        module: module,
        dom: currentImport.notebookImports[0].dom,
        specifiers: currentImport.notebookImports.map((pi) => ({
          local: pi.local,
          imported: pi.imported,
          variable: pi.variable
        }))
      });
    }
    return backupHas.call(this, ...args); // Call the original `has` method
  };

  // Iterate through the notebook imports and define them while capturing `has` calls

  await notebookImportVariables.reduce((chain, pageImportVariable) => {
    // Call the definition chain
    return chain.then(async () => {
      currentImport = pageImportVariable;
      try {
        await pageImportVariable.variable._definition();
      } catch (err) {
        console.warn(err);
      }
      currentImport = undefined;
    });
  }, Promise.resolve());

  // Restore the original `has` method after the operations are done
  Map.prototype.has = backupHas;

  return matches;
}
```

```js
notebookImportMatches = {
  console.log("notebookImportMatches");
  return pageImportMatch(notebookImportVariables, modules);
}
```

```js
summary = {
  console.log("generate summary");
  const modules = new Map([
    ...notebookImportMatches.entries(),
    ...[...resolve_modules.module_definitions.entries()].map(([m, spec]) => [
      m,
      {
        ...spec,
        module: m,
        name: spec.name,
        dependsOn: [],
        dependedBy: []
      }
    ])
  ]);
  // add cross links
  module_definition_variables.forEach((v) => {
    const hostModule = modules.get(v._module);
    const importedModule = modules.get(v._value);
    if (!hostModule?.dependsOn || !importedModule?.dependedBy) {
      console.error(
        "error building module dependancy map",
        hostModule,
        importedModule
      );
      return;
    }
    hostModule.dependsOn.push(importedModule.name);
    importedModule.dependedBy.push(hostModule.name);
  });
  return modules;
}
```

```js
submit_summary = {
  resolve_modules;
  queue;
  console.log("submit_summary");
  notebookImports;
  viewof queue.resolve(summary);
}
```

```js
import { flowQueue } from "@tomlarkworthy/flow-queue"
```

```js
import {
  parser,
  sourceModule,
  findModuleName
} from "@tomlarkworthy/observablejs-toolchain"
```

```js
import { runtime, main } from "@mootari/access-runtime"
```

```js
import { keepalive, thisModule, variables } from "@tomlarkworthy/runtime-sdk"
```
